---
title: "Ephemeral environments with Kubernetes and Azure DevOps in the cloud"
description: "Learn how I introduced a whole new way to test - and boosted team productivity - by creating the ability for developers and testers create their own throwaway deployment of our product"
date: 2025-12-13
tags: ["Kubernetes", "Azure DevOps", "Helm", "AKS"]
image: https://a.storyblok.com/f/325167/1536x1024/23cafb524d/chatgpt-image-mar-23-2026-10_50_33-pm.png
imageAlt: ""
---

When we started developing our latest product offering, our development and test cycle was similar to that of others teams: it was simple, straightforward, and all we needed at the time.

Over time, the team grew in size and the number of complex features demanded from us increased. We ran into a few problems in our development cycle - read on to learn about how I solved these problems with ephemeral environments.

## The starting point

So what was our original process?

1. The `main` branch is stable at all times. Releases come from tagged commits on `main` 
2. A long-lived `develop` branch exists for unreleased changes
3. Developers create feature branches off `develop`, then create PRs into `develop`
4. On merge into `develop`, an Azure DevOps pipeline runs and deploys the `develop` code to a single, long-lived 'test' environment.

That final point is key: we used only a _single, long-lived test environment_. All features have to go through the test environment before they can be signed off and released.

## The problems

This actually suited us for quite a long time! But there were a few problems starting to emerge in the team's process:

- Some complex features merged into `develop` introduced breaking changes to the test environment, meaning that sometimes all testing had to stop.
- In order to maintain stability on `develop` when approaching a release, PRs were left pending, unmerged and untested - meaning that ultimately we were releasing less through fear of breaking the test environment.

Now there are a lot of things that could be done about this: more automated testing earlier in the process, a different branching strategy - but for our team at this point in time, what I now describe is what we've decided to try first.

## Requirements

I set about a project to offer the ability to create an **ephemeral environment**for any branch, tag or commit. These were my objectives:

- Must be able to deploy a self-contained, isolated instance of the application for any **branch**, **tag** or **commit**.
- Must have its own domain name
- Must be very simple to create - a **one-click** solution was the goal
- Must not live too long and must be torn down automatically

## Helm Chart

The application in question is already deployable to Kubernetes via a Helm chart. This means we can deploy the same application to Kubernetes, but vary the configuration that is passed into in via the `values.yaml` file.

This will come in very helpful for what we're about to do...

## AKS - Kubernetes in Azure

I set up a single AKS cluster in Azure to host the ephemeral environments. Each environment will be given its own namespace when it is deployed (named based on its branch, tag or commit). 

AKS is a great choice for us. The application in question is moderately resource intensive, and so we'd need rather a lot of on-premise machinery to host these environments on site. Azure will scale the node pool automatically, spinning up new nodes as we deploy more ephemeral environments, and scaling them back once they are deleted.

## Ingress with Cloudflare and nginx

In order to route traffic into the cluster, I set up a wildcard DNS `A` record in Cloudflare to point traffic from my chosen subdomain (`*.aks.my-domain.com`) to the public IP address of my Kubernetes cluster.

This means that when I create an ephemeral environment for my branch, I can give it a domain name such as `my-cool-branch.aks.my-domain.com` and this will resolve to the IP address of the cluster.

In order to keep the environments private, I also used an IP restriction within Cloudflare to make sure that the environments are only accessible from within our organisation's network.

Once inside the cluster, the request is routed to the correct namespace and service using an nginx `Ingress` component which could looks something like this:

```yaml [ingress.yml]
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  namespace: {{ .Release.Namespace }}
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-dns
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - {{ .Values.domain }}
      secretName: web-tls
  rules:
    - host: {{ .Values.domain }}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: {{ .Values.webclient.serviceName }}
                port:
                  number: 80
```

## Deployment Pipeline

In order to make this a 'one-click' operation, I created an Azure DevOps pipeline to deploy the application to Kubernetes. Our team already uses Azure DevOps for build pipelines, task management and source control, so this was a familiar tool for everybody.

All the developer or tester needs to do is to run the pipeline and select the chosen branch (or tag or commit).

A `values-develop-aks.yml` file has been created to provide basic values for an ephemeral environment helm chart deployment, based off the `develop` branch. This is uploaded to Azure DevOps as a secure file, and then during the pipeline certain values are overridden to tailor the deployment for our branch.

These are the steps we follow for the pipeline (some details omitted!).

First, we build the containers for all of the different services for the branch, tag or commit selected. This means that we've got container images for each service for this branch. We can use a 'matrix' strategy in Azure DevOps to make these tasks run in parallel:

```yaml [deploy-ephemeral.yml]
- job: BuildContainers
  displayName: "Build Containers"
  strategy:
    matrix:
      Service1:
        projectFolder: 'Service1'
        containerRepository: 'service1'
      Service2:
        projectFolder: 'Service2'
        containerRepository: 'service2'
      Service3:
        projectFolder: 'Service3'
        containerRepository: 'service3'
  steps:
    - template: _build_container.yml
      parameters:
        projectFolder: $(projectFolder)
        containerRepository: $(containerRepository)
```

Then we can push these containers to a container registry and tag them with the name of the branch (converted to a url-safe name).

```yaml [deploy-ephemeral.yml]
docker build ...

az acr login --name my-container-registry:my-branch
docker tag image-tag tag-name
docker push tag-name
```

Then we can also build the helm chart and push it to the container registry (Azure Container Registries also serve as OCI registries capable of serving helm charts).

```yaml [deploy-ephemeral.yml]
- task: HelmInstaller@1
    displayName: 'Install Helm Tools'
    inputs:
      helmVersionToInstall: 'latest'

  - task: Bash@3
    displayName: 'Lint and Package Chart'
    inputs:
      targetType: 'inline'
      script: |
        helm lint helm/my-product
        helm template helm/my-product
        helm package helm/my-product --version my-product-$(chartVersion)

  - task: AzureCLI@2
    displayName: 'Push chart to ACR'
    inputs:
      visibleAzLogin: false
      azureSubscription: azureSub
      scriptType: pscore
      scriptLocation: inlineScript
      inlineScript: |
        az acr login --name my-container-registry

        helm push my-product-$(chartVersion).tgz oci://my-container-registry.azurecr.io/helm
```

Then we can log in to Kubernetes using a service connection, create a namespace and label it:

```yaml [deploy-ephemeral.yml]
- task: Kubernetes@1
  displayName: 'Kubernetes Login'
  inputs:
    connectionType: 'Kubernetes Service Connection'
    kubernetesServiceEndpoint: 'aks-ephemeral'
    command: 'login'

- script: |
    set -e

    kubectl apply -f - <<EOF
    apiVersion: v1
    kind: Namespace
    metadata:
      name: ${{ parameters.targetNamespace }}
    EOF
  displayName: "Create namespace if not exists"

- script: |
    kubectl label namespace ${{ parameters.targetNamespace }} ephemeral=true
  displayName: "Label namespace as ephemeral"
```

Now, download the helm chart and install it into the cluster, overriding domain and API url:

```yaml [deploy-ephemeral.yml]
- task: AzureCLI@2
  displayName: 'Download Helm Chart'
  inputs:
    visibleAzLogin: false
    azureSubscription: azureSub
    scriptType: pscore
    scriptLocation: inlineScript
    inlineScript: |
      az acr login --name my-container-registry
      helm pull oci://my-container-registry.azurecr.io/helm/my-product --version ${{ parameters.helmChartVersion }}

- task: HelmDeploy@1
  displayName: "Install Helm chart into cluster"
  inputs:
    connectionType: 'Kubernetes Service Connection'
    kubernetesServiceConnection: 'aks-ephemeral'
    command: 'upgrade'
    chartType: 'FilePath'
    chartPath: 'myproduct-${{ parameters.helmChartVersion }}.tgz'
    releaseName: 'myproduct'
    namespace: '${{ parameters.targetNamespace }}'
    valueFile: '$(valuesFile.secureFilePath)'
    overrideValues: |
      appVersion=${{ parameters.helmChartVersion }}
      domain=${{ parameters.helmChartVersion }}.aks.my-domain.com
      clientAppUrl=https://${{ parameters.helmChartVersion }}.aks.my-domain.com
      apiUrl=$(apiUrl)
```

## Teardown

Finally - how do we make sure that these environments don't stick around for ever?

You'll remember that we labelled each environment with `ephemeral=true`. I wrote a simple Kubernetes cron job which runs at 2am every night and deletes all namespaces with this label:

```yaml [namespace-deleter.yml]
apiVersion: batch/v1
kind: CronJob
metadata:
  name: delete-ephemeral-namespaces
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: kubectl
              image: bitnami/kubectl:latest
              command:
                - /bin/sh
                - -c
                - |
                  # Delete namespaces which are labelled as ephemeral=true
                  
                  for ns in $(kubectl get ns -l ephemeral=true -o jsonpath='{.items[*].metadata.name}'); do
                    echo "Deleting namespace: $ns"
                    kubectl delete ns "$ns"
                  done
          restartPolicy: OnFailure
          serviceAccountName: namespace-deleter
```

And the service account along with its permissions:

```yaml [namespace-deleter.yml]
apiVersion: v1
kind: ServiceAccount
metadata:
  name: namespace-deleter
  namespace: default

---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: namespace-deleter-role
rules:
  - apiGroups: [""]
    resources: ["namespaces"]
    verbs: ["get", "list", "delete", "watch"]

---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: namespace-deleter-binding
subjects:
  - kind: ServiceAccount
    name: namespace-deleter
    namespace: default
roleRef:
  kind: ClusterRole
  name: namespace-deleter-role
  apiGroup: rbac.authorization.k8s.io

```

## The Impact

The team have really engaged with this tooling. I can tell this because they keep asking me for improvements and extensions! It's really allowed us to be bold and experiment with new changes, testing them in a production-like environment before we commit to merging these changes into `develop`. It also lets testing proceed in separate environments while we're stabilising for a release.

This isn't the last improvement I will make - I will keep listening to the team, observe what's happening and what other tooling or process changes will help us develop more productively!
