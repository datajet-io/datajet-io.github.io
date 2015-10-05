---
layout: post
title: Building infrastructure for a real-time search and recommendation platform
---

At datajet we are logging 182 million requests daily, stemming from interactions like product views and purchases on our customer’s sites and apps. We use these events to power algorithms that optimize the relevancy of our search results and product recommendations.

We built our first prototype in September 2014 consisting of a two server setup, one for data collection and crunching, and one for serving our first search service. [Speed is paramount for eCommerce](http://glinden.blogspot.de/2006/11/marissa-mayer-at-web-20.html) and search in particular, so we deployed our services on metal in our customer’s data centers to minimize network delays. The latter can be huge (~300-600ms) if you have a globally distributed customer base like ours. However, deploying our apps “locally” increased deployment complexity considerably. Our customer base grew and so did the diversity of server operating systems we needed to support in testing and deployment.

##Containerize and AWSize all the things

The first step to minimize this complexity was using Docker containers for deployments to abstract away the differences of the underlying server operating systems. This made our life easier but not simple. Frequently our services would be affected by maintenance on our customer’s hardware. Also some customers were using older CentOS distributions that needed special attention to get Docker up and running.

Finally we decided to move to the Amazon's AWS platform to a have homogenous platform for our services. We chose AWS over Google mainly for the clearer documentation on data center location. This allowed us to pick a location that would be close to our customer’s data center to minimize network delays and respect data privacy requirements which highly depended on the legal framework our customers operated in.

##Containerized complexity

While Docker improved our deployment process considerably, orchestrating even just a small number of containers comes [with it’s own challenges](https://valdhaus.co/writings/docker-misconceptions/). Just a year ago the number of Docker orchestration options were scarce. [EC2 container service](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) was in private beta, [Google's Kubernetes](http://kubernetes.io/) was still in stealth mode and others like [CoreOS Quay](https://coreos.com/using-coreos/containers/), or [Docker’s own solution](https://docs.docker.com/compose/) were not available yet. Over the course of 2015 the number of options increased steadily and there does not seem to be a company that is [either offering an orchestration solution as service or open-sourcing its inhouse tech](https://www.quora.com/What-is-the-best-Docker-Linux-Container-orchestration-tool).

##Apache Mesos to the rescue

Still, in November 2014 we were left with the option of hand-wiring our own solution or using something like [Apache Mesos](http://mesos.apache.org/) that was already being put through its paces at Twitter or Airbnb. However, we had some concerns of over-engineering since our number of servers was far from being in the hundreds. Also vanilla Mesos required hand-wiring a lot of custom parts to handle actual deployment. Luckily we came across [Mesosphere's Marathon](https://github.com/mesosphere/marathon) and have been running it along with Mesos for almost a year now successfully in production. We will share our learnings from using them in our next blog post.

We’re hiring! Help us to build infrastructure and crunch data at scale.
