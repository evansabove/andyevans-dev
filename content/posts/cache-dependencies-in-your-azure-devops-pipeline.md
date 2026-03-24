---
title: "Cache dependencies in your Azure DevOps pipeline"
description: "We take a look at how caching your npm dependencies using the Cache task in Azure DevOps can improve performance and avoid upstream bandwidth limitations!"
date: 2025-06-09
tags: ["Azure DevOps"]
image: https://a.storyblok.com/f/325167/1792x1024/6dcaf02cf9/automating-pr-descriptions.webp
imageAlt: ""
---

Recently I encountered a failing Azure DevOps pipeline. No surprise there then! 

This turned out to be an issue with a licensed dependency in a Vue project that we were installing using `npm install`. The project was using the Font Awesome library but we were running into bandwidth restrictions on our Pro licence. We were downloading too often during our automated CI pipeline - and running into problems where the `npm install` task was failing. This was a busy project with lots of code churn, and we were building on each submitted PR, then also building a few times during the CI build on `main`.

Each time we ran `npm install`, we were downloading from font awesome using our licence key and this was costing us precious bandwidth.

## Caching

I decided to investigate caching to stop us having to pull from the source every time. Azure DevOps offers free cache storage even for free subscriptions - and it's dead easy to use!

## Before the changes

Before the changes I had the following step in the pipeline, as you might expect:

```yaml [client-app.yml]
- script: |
    npm install
  displayName: 'Install Dependencies'
  workingDirectory: $(System.DefaultWorkingDirectory)/src/ClientApp
```

## After the changes

Using the `Cach@2` task, I am able to cache the dependencies the first time it runs, then restore them from the local cache thereafter.

```yaml [client-app.yml]
- task: Cache@2
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json' 
    restoreKeys: |
      npm | "$(Agent.OS)"
    path: $(Pipeline.Workspace)/.npm
  displayName: Cache npm packages

- script: |
    npm config set cache $(Pipeline.Workspace)/.npm --global
    npm ci --prefer-offline
  displayName: 'Install Dependencies'
  workingDirectory: $(System.DefaultWorkingDirectory)/src/ClientApp
```

The `key` field is critical here. By specifying `package-lock.json` in the key, the hash of that file is included in the cache key, meaning that it will always restore from cache until the package-lock file changes.

The `Cache@2` task specifies a path where the cache should be stored - we're using `.npm`. Also note that the `npm install` command has been replaced with `npm ci --prefer-offline` to force restoration from the cache.

And that is it! Experiment with this carefully - you may find that performance is not actually any better than downloading from the source. But you might work around a licensing issues as I did.

Happy caching!
