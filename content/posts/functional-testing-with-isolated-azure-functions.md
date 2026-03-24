---
title: "Functional Testing for .NET 8 Isolated Azure Functions"
description: "Follow along to learn how to create functional tests using UnitTestEx for your .NET 8 (Isolated) HTTP-triggered functions "
date: 2025-02-15
tags: ["C#", "Azure Functions", "XUnit"]
image: /images/posts/functional-testing-with-isolated-azure-functions/functional-testing.webp
imageAlt: "A futuristic image showing laptops and clouds and the words 'Functional Testing'"
---

While working on a project recently, I needed an approach for creating some functional tests for a few HTTP-triggered Azure Functions I was working on. Typically I would use `WebApplicationFactory` for testing a .NET web application, but this doesn't seem to be available for isolated Azure Functions. I saw a post that mentioned [UnitTestEx ](https://github.com/Avanade/UnitTestEx)might offer a way forward and decided to give it a try!

## The code under test

This is a straightforward HTTP-triggered Azure function that I've put together which doubles a given number. It takes a request in the format defined by `DoubleMyNumberRequest`. The request body is deserialized into an object of this type. If the body is not present, then the caller will receive a `400 Bad Request` result, but if the request is successfully decoded then the caller will receive a `200 OK` response with the doubled number in the response body.

```csharp [DoubleMyNumberFunction.cs]
namespace FunctionalTestingExample;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

public class DoubleMyNumberFunction(ILogger<DoubleMyNumberFunction> logger)
{
    [Function(nameof(DoubleMyNumberFunction))]
    public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "double-my-number")] HttpRequest req)
    {
        logger.LogInformation("Received a request to double a number...");

        var request = await req.ReadFromJsonAsync<DoubleMyNumberRequest>();
        if (request == null)
        {
            return new BadRequestObjectResult("A request object must be supplied");
        }

        return new OkObjectResult(request.Number * 2);
    }
}

public record DoubleMyNumberRequest(double Number);

```

## The test code

I'm an XUnit fan, so that's what I've used in this example. This is a test fixture which uses XUnit's `InlineData` feature to supply several different test cases to a single test. See [this excellent guide here](https://andrewlock.net/creating-parameterised-tests-in-xunit-with-inlinedata-classdata-and-memberdata/) on creating parameterised tests in XUnit.

Use `FunctionTester.Create<T>` to create an instance of the function tester. Then, configure that tester to point at your function under test, in our case `DoubleMyNumberFunction`.

Then, create an HTTP request using the function tester, supplying the HTTP method, API route, body and content type. Execute the request, and then assert the results!

This is a simple example and you may wish to extract / generalise / simplify this for use across several different tests.

```csharp [WhenDoublingANumber.cs]
namespace FunctionalTestingExample.Tests;

using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Shouldly;
using UnitTestEx;
using UnitTestEx.Azure.Functions;
using UnitTestEx.Xunit;
using Xunit.Abstractions;

public class WhenDoublingANumber(ITestOutputHelper helper) : UnitTestBase(helper)
{
    [Theory]
    [InlineData(0, 0)]
    [InlineData(-2, -4)]
    [InlineData(3.5, 7)]
    public async Task ShouldDoubleTheNumberAsync(double number, int expectedResult)
    {
        using var functionTester = FunctionTester.Create<Program>();

        var triggerTester = functionTester
            .HttpTrigger<DoubleMyNumberFunction>()
            .WithRouteCheck(RouteCheckOption.None);

        var requestBody = new DoubleMyNumberRequest(number);

        var request = functionTester.CreateHttpRequest(HttpMethod.Post, "api/double-my-number", JsonSerializer.Serialize(requestBody), "application/json");
        var response = await triggerTester.RunAsync(f => f.RunAsync(request));

        response.Result.ShouldBeOfType<OkObjectResult>();

        var responseBody = ((OkObjectResult)response.Result).Value as double?;
        responseBody.ShouldNotBeNull();

        responseBody.Value.ShouldBe(expectedResult);
    }
}

```

## Full Example

Check out a full example in [this repository.](https://github.com/evansabove/example-code/tree/main/functional-testing-isolated-functions)
