---
title: "Hosting an Azure Functions API for an Azure DevOps Extension"
description: "Following on from my post about creating a web-based Azure DevOps extension using Vue, in this post I demonstrate how to securely host a backend API for your DevOps extension"
date: 2025-03-04
tags: ["Azure DevOps", "Azure Functions", "C#", "Azure DevOps Extensions"]
image: /images/posts/hosting-a-backend-api-for-an-azure-devops-extension/devops-function-backend.webp
imageAlt: ""
---

If you've written an Azure DevOps extension, chances are you want to call out to a backend API to perform some process. 

You might not have an API already, and you might need something cheap to host that will only be used periodically. Therefore, an HTTP-triggered Azure Function might fit the bill for you!

But how do you go about securing your functions to ensure that it is only callable from your extension? In this post I show you how.

This post follows on from the previous post on this topic [here](/posts/azure-devops-web-extensions-with-vue).

## Prepare your token

The approach that we will take is to generate a token from the Azure DevOps SDK in the front end of our web application and pass this through in our request to our API in the `Authorization` header.

In your front end code, using the `azure-devops-extension-sdk` library, retrieve an App Token:

```ts
const appToken = await SDK.getAppToken()
```

## Make your request

Now we can use this token to send a request to our API endpoint. For example:

```ts
const body = { someData: 123 };

const response = await fetch("https://{your-function-app}.azurewebsites.net/api/{your-endpoint}", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${appToken.token}`
    },
    body: JSON.stringify(body)
});
```

## Securing the API

I won't go through how to host your Azure Function app - you don't need my help with that - but I'll take you through what you need to do to secure it. I'll assume that you've got your function app up and running in Azure.

Here's my example Azure function

```csharp [DevopsExtensionFunction.cs]
[Function(nameof(DevopsExtensionFunction))]
public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
{
    return await ExecuteIfCalledFromDevopsExtensionAsync(req, async () =>
    {
        var request = await req.ReadFromJsonAsync<RequestFromDevops>();
        if (request == null)
        {
            logger.LogError("Request body was not supplied or could not be deserialized");

            return new BadRequestObjectResult("Request body must be supplied");
        }

        //do your thing, return your thing

        return new OkResult();
    }, async () =>
    {
        logger.LogWarning("Unauthorized access attempt");
        return await Task.FromResult(new UnauthorizedResult());
    });
}
```

Things to note:

- The `AuthorizationLevel` of this function is set to `Anonymous`. This is OK because we are going to manually verify the authorization token.
- The method `ExecuteIfCalledFromDevopsExtensionAsync` requires two callback functions - one for when the authorization is successful and one for when the authorization is unsuccessful.

The `ExecuteIfCalledFromDevopsExtensionAsync` is defined as follows. We check for a `Authorization` header, and if one is found then we delegate out to the `azureDevopsTokenValidator`, which will validate that the supplied app token originated from our extension. It will also return us the principal, which will contain the claims embedded in the token. If there is any problem, then we call the `unauthorized` callback, which will return a `401` response to our client.

```csharp
private async Task<IActionResult> ExecuteIfCalledFromDevopsExtensionAsync(HttpRequestData req, Func<Task<IActionResult>> action, Func<Task<IActionResult>> unauthorized)
{
    if (!req.Headers.TryGetValues("Authorization", out var authHeaders))
    {
        logger.LogError("No Authorization header found in request");
        return await unauthorized();
    }

    var token = authHeaders.FirstOrDefault()?.Replace("Bearer ", "");
    if (string.IsNullOrEmpty(token))
    {
        logger.LogError("No bearer token found in Authorization header");
        return await unauthorized();
    }

    var principal = azureDevopsTokenValidator.Validate(token);
    if (principal == null)
    {
        logger.LogError("Token validation failed");
        return await unauthorized();
    }

    logger.LogInformation("Token validation successful");
    return await action();
}
```

## The Validator

The `AzureDevopsTokenValidator` is defined as follows. The `secretKey` parameter passed to the constructor is the 'Certificate' secret that can be downloaded from your extension's registration on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).

The validator ensures that the issuer signing key of the app token that has been sent to the API matches the certificate - thereby verifying if a request was made from your extension.

```csharp [AzureDevopsTokenValidator.cs]
namespace DevopsApiSecurity;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

public class AzureDevopsTokenValidator(string secretKey)
{
    public ClaimsPrincipal? Validate(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(secretKey);
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = true
        };

        try
        {
            return tokenHandler.ValidateToken(token, validationParameters, out _);
        }
        catch
        {
            return default;
        }
    }
}
```

## Registering the validator

Fetch the app settings from the function configuration and then register the `AzureDevopsTokenValidator` in DI like this so that it is available to be injected into the function class.

```csharp [Program.cs]
var appSettings = builder.Configuration.GetSection("AppSettings").Get<AppSettings>()
                  ?? throw new Exception("AppSettings not found");

builder.Services.AddSingleton(new AzureDevopsTokenValidator(appSettings.DevopsExtensionSecret));
```

```json [local.settings.json]
"Values": {
  "AppSettings:DevopsExtensionSecret": "your-extension-secret"
}
```

```csharp [AppSettings.cs]
public class AppSettings
{
    public required string DevopsExtensionSecret { get; set; }
}
```

And that is everything! You can now guarantee that any requests that make it past your security have originated from your extension and nowhere else 

See the [full example here](https://github.com/evansabove/example-code/tree/main/DevopsApiSecurity).
