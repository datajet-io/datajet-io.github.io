---
layout: post
title: One year with Apache Mesos - The Good, The Bad, and the Ugly
author: Domen Pogacnik
---

We chose [Apache Mesos](http://mesos.apache.org) as the backbone of our infrastructure, [to serve a global customer base](http://datajet.io/Building-infrastructure-for-a-real-time-search-and-recommendation-platform-post.html) and solve some of the technical challenges we faced from our microservice-oriented architecture. These challenges were instrumenting diverse execution environment as well as, service discovery and deployment. Getting hardware provisioned and setting up a deployment process was always a necessary evil to get our stuff out the door and Mesos promised us to solve these issues.

We use our infrastructure to log millions of events like product views and purchases daily and serve search and recommendation results from our APIs. After running Mesos in production for about a year we thought it would be a good time to reflect on the things we learned so far.

## The Good - Releasing a (new) service
Pre-Mesos we had to prepare the necessary execution environments from testing to production and everything in between. Using Docker alongside Mesos allows us to encapsulate execution environments inside the container. That frees us from the effort of provisioning the infrastructure of every new microservice we want to release.

Our release process initially consisted of pushing to a service’s git release branch, which automatically triggered the continuous integration process. [Marathon](https://mesosphere.github.io/marathon) serves as deployment manager. In coordination with Mesos it allocates a suitable machine for the service, and deploys it by pulling it from our private Docker hub onto the allocated machine.

However, for external software like ElasticSearch we have no need for continuous integration and we release them directly from our local dev environment. To handle this use case we developed Shovel, which we plan to open-source shortly. It automates the process from building the Docker image containing the microservice to finally releasing them to the public. To release a microservice today we only have to prepare a Dockerfile and provide basic configuration. The basic configuration includes settings like public URL endpoint or amount of required CPU and memory resources. The rest of the release process is then completely handled by Shovel. To further simplify bootstrapping, we have a service template that contains commonly used components and allows us release a new microservice in minutes.

## The Bad - Version dependencies
Mesos is still in its early days, probably best exemplified by the very sub-1.0 version numbers. New Mesos releases often include important bug fixes but upgrading has been a pain point for us due to the number of moving parts that led to catch-22 situations.

As an example, we experienced [memory leaks with Docker 1.6](https://github.com/docker/docker/issues/9139) but were [not able to upgrade](https://issues.apache.org/jira/browse/MESOS-2986) for some time even though the bug got fixed in Docker 1.8. Upgrading Docker would have required upgrading to a Mesos version (0.23) that was [untested with Marathon version 0.10](https://github.com/mesosphere/marathon/releases/tag/v0.10.0).

## The Ugly - Stateful Services
Our search and recommendation services rely extensively on ElasticSearch. Therefore we deployed Elasticsearch running on Marathon as we do with our microservices. The promise of upgrading by just deploying a new Docker image and scaling-up by increasing the instance count in Marathon sounded very enticing. However, we later regretted making this decision and deployed subsequent stateful software like Apache Kafka not on Mesos

On several occasions healthy ElasticSearch nodes were restarted by Marathon which often resulted in partial downtime of our service. After some investigation we found out that the issue occurs due to [a failure to reconcile the running application state on Marathon master failover](https://github.com/mesosphere/marathon/issues/1553). The issue was solved in the latest stable release but gracefully shutting down (stateful) services remains [a pain point of Marathon](https://github.com/mesosphere/marathon/issues/712) that has not been solved yet.

## What’s next?

Despite the hurdles we experienced, we never regretted the decision of choosing Mesos. It allows us to easily prototype and iterate on our search and recommendation services since the cost of releasing new services is negligible. We’re also looking forward to reaping the benefits of better resource utilization as we grow. Mesos’ eco-system has a vibrant community with rapid release cycles, and major challenges like running stateful services are being actively addressed with dynamic reservation and persistent volumes.

**We’re hiring!**

Build infrastructure that handles billions of API calls or crunch terabytes of data to help people discover products they love. Drop us a line at [team@datajet.io](mailto:team@datajet.io) if you like to join the fun.
