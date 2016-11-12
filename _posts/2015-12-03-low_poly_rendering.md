---
layout: post
title: Low-Poly Rendering
lang: en
---

<script type="text/javascript" src="{{site.baseurl}}/assets/low-poly/low-poly.js"></script>
<link rel="stylesheet" type="text/css" href="{{site.baseurl}}/assets/low-poly/low-poly.css">

<figure>
<div id='container'></div>
<figcaption>click/hover on the right image to view wireframe</figcaption>
</figure>

## Preamble
I was starting to prepare this year's birthday gift for someone, I find Low Poly rendering an artistic gift for her who "likes" arts, so I decided to work on this, however I just keep this as a secret from her so you may just pretend you didn't read anything written by me.

## Background
A [question](http://www.zhihu.com/question/29856775) on 知乎 already suggests how low-poly images can be rendered. In fact, this is the discussion that has inspired me to create one of my own, with Python, of course. I recommend you to take a look at this post as some of the points made are also adopted by my implementation.

I looked into [Xianzhe's](https://github.com/Ovilia/Polyvia) answer, she uses WebGL with Three.js to accomplish the task. I am not a graphics person so WebGL. But there are rooms of improvement in the algorithm that she implemented. In fact, I find the quality of her rendered images less satisfactory compared to [Meng]() who also answered the question. Meng's answer suggests ways which we can optimize the arrangement of the vertices in the Delaunay triangulation. I couldn't access his paper but I think he used the [Lloyd's algorithm](https://en.wikipedia.org/wiki/Lloyd's_algorithm) to space out the vertices first identified in edge extraction. Scipy has some function that uses Qhull for spatial calculation of the Delaunay triangles and Voronoi Diagrams. It does not however include the Lloyd algorithm tailored to our specific task. So I implemented one of my own. I used the horse image found on Xianzhe's' [blog](http://zhangwenli.com/Polyvia/image.html) as benchmark, it is under public domain.

![Start coding! Some initial progress I made](https://farm1.staticflickr.com/631/21972752350_f787f7bf81_b.jpg)  

There are some problems with color rendering of the triangles due to the inability to configure the RGB colours with the `plt.pcolor()` function in Matplotlib. I have fixed this by using Polygon collections instead of pseudo colours.

![After fixing coloring problem, the initial result](https://farm1.staticflickr.com/665/22134795806_dd741162e9_b.jpg)  

This is the result we have after fixing the coloring problem. It looks okay. You should compare it with her result, you can try different vertices but apparently the features of image are not captured with the random vertex generation method. Notice another difference is that Xianzhe has triangles with larger internal angles. Delaunay triangulation ensures that we obtain triangular subdivisions with as large internal angles as possible. However, the allocation of the vertices in the image space will nevertheless affect the angles, and further, the aesthetics of our low-poly image. We will discuss how we will address the allocation of vertices later.

![Xian Zhe's result, retrieved from Github](https://raw.githubusercontent.com/Ovilia/Polyvia/gh-pages/src/img/3.png)   
Take a look at how the vertices are optimized by the Voronoi iteration.

![Voronoi iteration](https://farm1.staticflickr.com/703/21537993264_cf00fc680e_o.png)

The second one looks slightly better after the Lloyd relaxation. Take a look at the fence at the left bottom. It is smoother in Figure 2 than in Figure 1. I forgot to include the four vertices of the rectangle so it looks slightly different, but more artistic, doesn't it?

![Maybe it will look great just by having fewer vertices?](https://farm6.staticflickr.com/5742/21973225448_98b8319ff8_b.jpg)

This figure looks better than the aforementioned two figures. Why? For simple reason that it uses fewer vertices. This has prompted me to think that whether our defined number of vertices is appropriate. Some of the vertices we randomly choose may live in close proximity and may as well be merged into a single vertex. This is the motivation behind my using K-means to cluster the selected points into fewer number of vertices.

One arises when we want to do this: Fewer vertices but how many is considered "fewer"?

The code is on Github. This is just a piece of code I write in order to familiarize myself to computer vision and machine learning in image processing so please feel free to use it.


<script>
renderFig("{{site.baseurl}}/assets/images/original.jpg","{{site.baseurl}}/assets/images/rendered.svg", $("#container"));
</script>
