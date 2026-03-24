---
title: "Hosting apps on-prem using Cloudflare Tunnels"
description: "Host apps on your own kit - and expose them to the internet - safely!"
date: 2025-03-12
tags: ["Cloudflare", "On-prem hosting"]
image: https://a.storyblok.com/f/325167/1792x1024/5c6a255b26/cloudflare-tunnels.webp
imageAlt: ""
---

Recently our organisation was given access to some hardware for experimentation and evaluation. In order to check it out we needed to install some of our own software on that machine - a web application. We needed this application to properly evaluate the hardware.

The trouble was, the sandbox environment that we were given access to wasn't publicly addressable, and so we weren't able to get a public IP address or domain name for it. We needed several users to be testing at once, so logging on to the server and using the `localhost` address wasn't a practical option.

So with no inbound access - how could we possibly host a public-facing web application on it? Read on to find out...

## Cloudflare Tunnels

[Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) solve exactly this problem. They provide a secure way to connect resources to Cloudflare without a publicly routable IP address.

A lightweight daemon called `cloudflared` is installed your infrastructure, which calls _outwards_ to Cloudflare. Using that connection, Cloudflare is able to securely transfer data to and from your application.

In addition to that, Cloudflare will give you a DNS record and protect the true origin of your server. Amazing!

## Setup

1. Log in to your Cloudflare account and [follow instructions](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/) to set up a new Tunnel under the Zero Trust feature. 
2. Follow the instructions to run the `cloudflared` docker container. I hosted mine alongside some other containers in my `docker-compose.yml`

```yaml [docker-compose.yml]
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    command: tunnel --no-autoupdate run --token ${your-token}
```

My web app was hosted on port 8000, so I configured a hostname on my tunnel to point at `localhost:8000`

And that is all you need to do! Your web app will be available at `https://your-app.your-domain.com` for as long as your `cloudflared` container is running.

## Additional Security

One final step was to make sure that this domain name was only accessible to the people who need it - i.e the people within my organisation. 

Within the Zero Trust -> Access feature, create yourself an Application to represent your app. Under 'Policies', create a new Policy and configure a rule to ensure that only people from a certain IP range can access your application.

Policies can be configured with a wide variety of restrictions - go and explore!

Hope this helps
