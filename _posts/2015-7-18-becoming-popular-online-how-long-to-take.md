---
layout: post
title: How long does it take to get popular on Zhihu?
lang: en

---
I recently posted an [answer](http://www.zhihu.com/question/26103352/answer/53690075) on Zhihu, by the time I uploaded this post, there are more than 950 likes and is recommended by the editors to the Explore section.

As a naive data scientist (so I call myself to be one), a good thing will be to take a look at how long it takes for a post to become popular. My friend actually [posted](http://www.zhihu.com/question/20694193/answer/48296581) something before that eventually received over 1000 posts and got it all the way to 知乎日报. At the time she got around 200 upvotes, I decided to write a simple Python script to keep track of the total upvotes that she received. Here you go:


```python

import urllib2
import re, os
import datetime, time
pat = re.compile('<span class="zm-profile-header-icon"></span><strong>[0-9]+</strong>')
filepath = './time_series.csv'
while 1 == 1:
	req = urllib2.Request('http://www.zhihu.com/people/aiwei-wu')
	req.add_header('Cache-Control', 'max-age=0')
	res = urllib2.urlopen(req).read()
	match = pat.search(res)

	if match:
		string = match.group()
		number = re.search('[0-9]+', string).group()
		print time.ctime(), ',' , number
		mode = 'a' if os.path.exists(filepath) else 'w'
		with open(filepath,mode) as f:
			output = time.ctime() + ',' + number +'\n'
			f.write(output)
	time.sleep(600)

```

Without introducing anything (aka the use of a simple `time.sleep()` on the last line) asynchronous, it basically keeps track of the number of likes on her profile pages. I used simple regular expressions to retrieve the number of upvotes from the profile page. Of course I made some assumptions here: I assumed that the number of upvotes on the profile page reflects the upvotes on her very specific post. Given the immense popularity of her one particular post and the "mediocre performance" of her other answers. This should be a reasonable  assumption in order to achieve fast prototyping. The script will save the times series of the upvotes to a csv so you can do some plotting with it.
