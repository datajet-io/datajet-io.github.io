---
layout: post
title: Hacking an Image-based Recommender System
author: Domen Pogacnik
---

Recently we came across Grace Avery’s [interesting](http://blog.thehackerati.com/post/126701202241/eigenstyle) approach to create an image-based recommender system for fashion. As we work with a lot of fashion related e-commerce companies ourselves the post immediately took our attention.

A common use case for recommender systems is to find products that are somehow similar to each other. We set our goal to find dresses of a similar style to a given seed dress. Similar to Grace’s approach we extract the latent factors from images using [PCA](https://en.wikipedia.org/wiki/Principal_component_analysis). However, Instead of feeding them to a logistic regression classifier we compare the feature vectors directly to find similar dresses. We omit the classification step due to lack of explicit user feedback, a common limitation with e-Commerce recommender systems [1].

We experimented with different similarity metrics to compare the feature vector and settled for cosine similarity at first. [Later we came across](https://indico.io/blog/clothing-similarity-how-a-program-is-more-fashionable-than-me/) [t-SNE](https://lvdmaaten.github.io/tsne/) which yielded even better results.

Our dataset contains 892 pictures of long dresses from one of our customer’s product catalogue. Images were scaled down to a uniform size and fed in a raw form to the PCA method; we kept 10 best principal components.

So enough talking - show us the goods. For a quick taste we include three examples that, we think, our recommender got right and for a balanced view the same number of examples that would need improvement. The leftmost image in all examples is the seed image - the one we’re searching similar images for.

The good

![Example 1](http://i.imgur.com/w7qLX22.png)
![Example 2](http://i.imgur.com/7gZNCff.png)
![Example 3](http://i.imgur.com/98Z7Bum.png)

The bad

![Example 1](http://i.imgur.com/TWNswPh.png)
![Example 2](http://i.imgur.com/Kcxnggc.png)
![Example 3](http://i.imgur.com/vYHaDHF.png)

From the example above we can see the universal usefulness and power of the PCA method. Nevertheless every method has its disadvantages. In this case the major disadvantage is that we do not know what the latent factors represent, e.g. if it is color, the shape or the pattern, which makes tuning the factors unfeasible.

Imagine buying a new formal night dress. Some might argue that a color of the dress for that particular occasion plays a crucial role. Unfortunately, here the PCA method falls short as we don’t know which latent factor describes the color. An obvious way to improve results would then be to add the explicit color feature to the mix. In addition, small differences like cut-outs can make the difference whether a dress is for formal or more casual occasions. So while a purely PCA-based approach provides a simple baseline for doing item-based recommendation in fashion, it needs further tuning due to the number of false-positives.

Lately there’s a lot of buzz about deep learning, especially when it comes to learning from images. Deep convolutional neural network have indeed proved themselves on the image classification tasks and it feels they would be a perfect fit for our problem as well.

P.S.
Here's the visualization of our dataset using t-SNE (click on the image for higher resolution)

[![t-sne](http://i.imgur.com/sCpFNr2.jpg)](http://i.imgur.com/sCpFNr2.jpg)

References:
[1] Y. Hu, Y. Koren, C. Volinsky: Collaborative Filtering for Implicit Feedback Datasets
