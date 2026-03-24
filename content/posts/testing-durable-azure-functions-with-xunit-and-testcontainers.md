---
title: "Testing Durable Azure Function Apps using XUnit and TestContainers"
description: "My new approach to writing functional tests against Azure Durable Functions. Use a similar approach for any containerised web app!"
date: 2025-06-28
tags: ["Azure Functions", "XUnit", "Containerisation", "Durable Functions"]
image: /images/posts/testing-durable-azure-functions-with-xunit-and-testcontainers/functional-testing.webp
imageAlt: ""
---

Earlier this year [I published a post](/posts/functional-testing-with-isolated-azure-functions) on how I like to write functional tests against an Azure Function application. This works really well for standard HTTP-triggered functions, but recently I encountered a new challenge - how to write tests against a _Durable_ function app?

The app in question that I wanted to test was an Azure Function app with a durable orchestrator. It provided an async HTTP API which receives a POST request, then adds several work items to a background queue of another system. It waits for those tasks to be completed, and then sends a response containing the results to a specified callback URL. In short - it's a complex orchestration, and it was important that my tests targeted the whole app!

I tried to apply the same approach as in my previous post, but I couldn't get it to work - I needed to supply a `DurableTaskClient`. I could have tried to mock that out, but it got me thinking that actually what I _really_ want to test is the whole, real app with no mocked dependencies. These are _functional_ tests - meaning that I want to be testing the app as close to the real thing as possible.

## Containerisation

I've never containerised an Azure function app before - I've never really needed to - but I remember reading once that it was possible, and it was this thought that triggered the idea for this approach.

If I could containerise the app to be tested, then I could also utilise another recent discovery of mine: [TestContainers](https://testcontainers.com/).

TestContainers allows the easy starting-and-stopping of containers for test dependencies. For example, if you need Azurite, or a SQL server, you can easily spin one up in your test fixture setup, and then stop it again when your tests complete. It's easier than writing a docker-compose file and remembering to have to start it!

But instead of starting a dependency - what if I could start the containerised app under test? That way, it'd be a complete, configured, _real_ application that I could send HTTP requests to and otherwise interact with.

## Containerising the app

My app is a .NET 8 Isolated function app, and my `Dockerfile` looks like this:

```dockerfile [Dockerfile]
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS installer-env

COPY . /src/dotnet-function-app
RUN cd /src/dotnet-function-app && \
mkdir -p /home/site/wwwroot && \
dotnet publish *.csproj --output /home/site/wwwroot

FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY --from=installer-env ["/home/site/wwwroot", "/home/site/wwwroot"]
```

## Approach

We now have our main building blocks together:

- A dockerfile to be able to build our application
- XUnit for the testing library
- TestContainers to start the application (and its dependencies).
- Some C# code to orchestrate the magic!

Let's go and put it all together! First up, create your XUnit test project and install the following nuget packages:

- `TestContainers`
- `TestContainers.Azurite` (we need to start an azurite instance to support the Azure Function app)
- `Flurl.Http` (for making HTTP requests to our API. You can use a plain `HttpClient` if you like).
- `Shouldly` for assertions in your tests (optional).

## Test Fixture Setup

I created a new `FixtureBase` class implementing `IAsyncLifetime` from XUnit, which gives us the opportunity to run async setup tasks before a test suite run. I've created some empty methods to demonstrate the approach we'll take for the test setup:

1. Build the application container
2. Create a docker network
3. Start azurite to support to azure function app
4. Start the application under test

**Note**: yes, we are building the container on each test run! This isn't ideal - it is slow, no question. If you're developing your tests only, you could perhaps comment this out, but it needs to be in place to ensure the latest version of the app is built before testing.

I'm continuing to think about a way forwards to make this faster!

```csharp [FixtureBase.cs]
using DotNet.Testcontainers.Containers;
using DotNet.Testcontainers.Networks;
using Testcontainers.Azurite;

public class FixtureBase : IAsyncLifetime
{
    public async Task InitializeAsync()
    {
        await BuildApplicationContainerAsync();
        await CreateNetworkAsync();
        await StartAzuriteAsync();
        await StartFunctionAppContainerAsync();
    }

    private async Task CreateNetworkAsync()
    {
        // ...
    }

    private async Task StartAzuriteAsync()
    {
        // ...
    }

    private async Task StartFunctionAppContainerAsync()
    {
        // ...
    }

    private async Task BuildApplicationContainerAsync()
    {
        // ...
    }

    public async Task DisposeAsync()
    {
        if (container is not null)
        {
            await container.DisposeAsync();
        }

        if (AzuriteContainer is not null)
        {
            await AzuriteContainer.DisposeAsync();
        }

        if (network is not null)
        {
            await network.DisposeAsync();
        }
    }
}
```

## Building the app into a container

This one is quite manual - we call down to the shell to build the docker container. I'd like in future to find a better / faster way of doing this! If your container is already built in another way - you can skip this step.

```csharp [FixtureBase.cs]
private async Task BuildApplicationContainerAsync()
{
    var startInfo = new ProcessStartInfo
    {
        FileName = "docker",
        Arguments = "build -t your-app .",
        WorkingDirectory = "your-app-directory",
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = true
    };

    using var process = new Process();
    process.StartInfo = startInfo;
    process.Start();

    await process.WaitForExitAsync();
}
```

## Create the docker network

We need to run two containers in order to run our tests:

1. The app itself
2. An instance of Azurite in order to support the function.

If you're not using azure functions like I am, this may be different for you. 

These two containers need to be on the same network so they can talk to each other. Thankfully with TestContainers, this is easy! We get started by creating a new network with a randomized name:

```csharp [FixtureBase.cs]
private async Task CreateNetworkAsync()
{
    network = new NetworkBuilder()
        .WithName(Guid.NewGuid().ToString("N"))
        .Build();

    await network.CreateAsync();
}
```

## Start the Azurite dependency

OK, this is where things get juicy!

Starting the Azurite container is easy using the `AzuriteBuilder` from the `TestContainers.Azurite` package. We specify the exact version of the image that we want, we set the previously created network, and we also supply a network alias, so we can find the azurite container on the network from the app under test.

The container is then started. But - we need to make a modification to the connection string. The `AzuriteContainer.GetConnectionString` gives us a connection string _as it would be on the host machine_. But where we're accessing the container from is on our docker network.

So in this method, we:

1. Deconstruct the connection string into its constituent parts
2. Respecify the `BlobEndpoint`, `QueueEndpoint` and `TableEndpoint` properties to use the network alias for the azurite container.
3. Reconstruct the connection string and store it in our class.

```csharp [FixtureBase.cs]
private async Task StartAzuriteAsync()
{
    AzuriteContainer = new AzuriteBuilder()
        .WithImage("mcr.microsoft.com/azure-storage/azurite:3.33.0")
        .WithNetwork(network)
        .WithNetworkAliases("azurite")
        .WithCommand("--skipApiVersionCheck")
        .Build();

    await AzuriteContainer.StartAsync();

    var connectionProperties = AzuriteContainer.GetConnectionString()
        .Split(";")
        .Select(part => part.Split('=', 2))
        .ToDictionary(pair => pair[0], pair => pair[1]);

    connectionProperties["BlobEndpoint"] = $"http://azurite:10000/devstoreaccount1";
    connectionProperties["QueueEndpoint"] = $"http://azurite:10001/devstoreaccount1";
    connectionProperties["TableEndpoint"] = $"http://azurite:10002/devstoreaccount1";

    AzuriteConnectionString = string.Join(";", connectionProperties.Select(x => $"{x.Key}={x.Value}"));
}
```

## Start the app

Now we're moving! Time to start the application itself. There's a few things here to unpack once you've had a read of this:

```csharp [FixtureBase.cs]
private async Task StartFunctionAppContainerAsync()
{
    var hostJsonLocation = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "..", "..", "..", "test-host", "host.json"));

    container = new ContainerBuilder()
        .WithImage("your-app")
        .WithName("your-app-func-test")
        .WithEnvironment("Storage", AzuriteConnectionString)
        .WithEnvironment("WEBSITE_HOSTNAME", "localhost:8080")
        .WithEnvironment("YourEnvVariable1", "something")
        .WithEnvironment("YourEnvVariable2", "something")
        .WithEnvironment("AzureWebJobsSecretStorageType", "files")
        .WithResourceMapping(hostJsonLocation, "/azure-functions-host/Secrets")
        .WithNetwork(network)
        .WithPortBinding(8080, 80)
        .WithWaitStrategy(Wait.ForUnixContainer()
            .UntilHttpRequestIsSucceeded(req => req.ForPath("/")
                .ForStatusCode(HttpStatusCode.OK)))
        .Build();

    await container.StartAsync();
}
```

Using the container image we built previously, we start a new container. But before we start it, we configure a number of very important things:

- **Environment variables** - the `Storage` and `WEBSITE_HOSTNAME` variables are essential to start the Azure function app (yours might vary). I've also shown here how to specify your own custom environment variables.
- **Network** - the app is set up to be on the same docker network as its dependencies (Azurite).
- **Port** - the binding from `8080` (host machine) to `80` (docker container) makes the app accessible from our test code.
- **Wait strategy** - This ensures the test code does not proceed before the container has started - i.e. until it responses with an `OK` status code at its root.
- **Authentication** - the azure function that I'm testing is using `AuthorizationLevel.Function`. Therefore I must send a `code` parameter or an `X-Functions-Key` header in order to authenticate. We'll talk about this next...** **

## Authenticating with the Azure Function

We are running a real version of our app for testing, and that means real authentication. As mentioned, I'm using an HTTP function protected by `AuthorizationLevel.Function`, which means that the function key or admin key has to be supplied in the `code` querystring parameter or in the `X-Functions-Key` header.

When running in Azure, these keys are easily accessible from the Azure portal or the Azure CLI. However, when we containerise the function, we cannot retrieve the function key in the same way. 

By using the environment variable `AzureWebJobsSecretStorageType=files` , we are able to manually specify our own custom master key in a file which we can use to authenticate with the function.

Create a file locally call `host.json` in the following format:

```json [host.json]
{
    "masterKey": {
        "name": "master",
        "value": "custom-key",
        "encrypted": false
    },
    "functionKeys": []
}
```

And then we can map that resource onto our app's container in the `/azure-functions-host/Secrets` directory using the following command:

`.WithResourceMapping(hostJsonLocation, "/azure-functions-host/Secrets")`

When that file is placed in that directory with the `AzureWebJobsSecretStorageType` value set to `files`, we can then authenticate using our `custom-key`.

## Writing a simple test

Now our application stack is fully up and running, we can at last write a test, extending from our base fixture! Here's one I prepared earlier:

```csharp [WhenDoingAThingWithMyApp.cs]
using Flurl.Http;
using Shouldly;

public class WhenDoingAThingWithMyApp : FixtureBase
{
    private const string FunctionUrl =
        $"http://localhost:8080/api/thing?code=custom-key";

    [Fact]
    public async Task ShouldReturn202AcceptedStatusCodeAsync()
    {
        var response = await FunctionUrl
            .AllowAnyHttpStatus()
            .PostJsonAsync(new ThingRequest());

        response.StatusCode.ShouldBe(202);
    }

    private record ThingRequest();
}
```

## A more complex test

Now let's take a look at a more complex, real-world example. Here's a durable azure function that waits for an external event to complete before finishing. When it's complete, it returns 'The process was approved'.

```csharp [TestFunctionApi.cs]
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.DurableTask;
using Microsoft.DurableTask.Client;

public static class TestFunctionApi
{
    [Function(nameof(TestFunctionApi))]
    public static async Task<HttpResponseData> HttpStartAsync(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "thing")] HttpRequestData req,
        [DurableClient] DurableTaskClient client,
        FunctionContext executionContext)
    {
        string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(nameof(TestFunctionOrchestrator));

        return await client.CreateCheckStatusResponseAsync(req, instanceId);
    }
}

public class TestFunctionOrchestrator
{
    [Function(nameof(TestFunctionOrchestrator))]
    public static async Task<string> RunOrchestratorAsync(
        [OrchestrationTrigger] TaskOrchestrationContext context)
    {
        await context.WaitForExternalEvent<ExternalEvent>("SomeProcessApproval");

        return "The process was approved";
    }
}
```

And here's a test that starts the orchestration, sends the custom event in, and then checks the output of the function is as expected:

```csharp [ExampleTest.cs]
using System.Text.Json;
using Flurl.Http;
using Shouldly;

public class ExampleTest : FixtureBase
{
    private const string FunctionUrl = $"http://localhost:8080/api/thing?code=custom-key";

    [Fact]
    public async Task ShouldWaitForExternalEventAsync()
    {
        var response = await FunctionUrl
            .AllowAnyHttpStatus()
            .PostJsonAsync(new ThingRequest());

        response.StatusCode.ShouldBe(202);

        var requestAcceptedResponse = await response.GetJsonAsync<RequestAcceptedResponse>();

        await WaitForFunctionToHaveStatusAsync(requestAcceptedResponse.StatusQueryGetUri, "Running");

        await RaiseEventAsync(requestAcceptedResponse.SendEventPostUri);

        await WaitForFunctionToHaveStatusAsync(requestAcceptedResponse.StatusQueryGetUri, "Completed");

        var finalStatusResponse = await requestAcceptedResponse.StatusQueryGetUri.GetJsonAsync<StatusResponse>();
        finalStatusResponse.Output.ShouldBe("The process was approved");
    }

    private async Task RaiseEventAsync(string sendEventUri)
    {
        var eventResponse = await sendEventUri
            .Replace("{eventName}", "SomeProcessApproval")
            .PostJsonAsync(new ExternalEvent());

        eventResponse.StatusCode.ShouldBe(202);
    }

    private async Task WaitForFunctionToHaveStatusAsync(string statusQueryGetUri, string status)
    {
        string lastReportedStatus = string.Empty;
        object lastReportedOutput = null;

        for (var i = 0; i < 10; i++)
        {
            var statusResponse = await statusQueryGetUri.GetJsonAsync<StatusResponse>();
            if (statusResponse.RuntimeStatus == status)
            {
                return;
            }

            lastReportedStatus = statusResponse.RuntimeStatus;
            lastReportedOutput = statusResponse.Output;

            await Task.Delay(1000);
        }

        Assert.Fail($"Function did not report running status in time. Last reported status was {lastReportedStatus}. Last reported status {JsonSerializer.Serialize(lastReportedOutput)}");
    }

    private record ThingRequest();
    private record RequestAcceptedResponse(string StatusQueryGetUri, string SendEventPostUri);
    private record StatusResponse(string RuntimeStatus, string Output);
}
```

Check out the full example [here](https://github.com/evansabove/example-code/tree/main/FunctionalTestingDurableFunctions).
