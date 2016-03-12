---
layout: post
title: My precious experience on making data science production ready
lang: en
---

[Writing in progress]

## Overview

Since June 2014 when I first worked with Som on the Synergy Graph, I have been working as an ambitious data scientists. While the Synergy Graph is really about multi-agent systems, our application to the NBA has a rather large weightage dedicated to data analysis. I have since then learned a few tools of trade about data science, managing all the tasks related to data processing and analysis in our collaboration.

I started re-implementing a lot of the programs since last month. This is almost my third time (or more) rewriting my code about the data analysis workflow. You may find my first implementation on Github, populatedwith random scripts, IPython notebooks, CSV files all mixed up to the extent that is impossible for me to manage alone. The second time I practiced using MySQL, which makes the storing and querying of the data more persistent and consistent. Still it is a rather painful experience: MySQL proves to be rather challenging in managing the not-so-relational data. Furthermore, my approach of managing game_ids (ids for identifying the NBA games) or player_ids is rather broken in the end. The third time was ephemeral as I tried to adopt some API from py-Goldsberry. I ended up with the frustration of not being able to integrate it with my existing workflow, more importantly I find myself in a better situation writing my own code to handle those API access (the source code of Goldsberry is a bit length and broken IMHO). As we still want to do more thorough analysis on the Adversarial Synergy Graph and I am currently on break, I started since last month and prayed for everything to get right this time round.

Implementing such a system proves to be a rather challenging lone wolf task because doing everything by myself really requires a lot of thinking about the infrastructure, something I previously had little exposure to. the ESaaS course inspires me to take maintainability in to account: I also do that because if I designed the codebase poorly I will be the one who will suffer in the end. Along with learning from ESaaS, I decided to note my exploration on how I will contribute a maintainable data science side project along withe Synergy Graph to share my thoughts on this subject. This post will probably continue being updated for quite some time so stay tuned if you find the experience relatable to you :)

