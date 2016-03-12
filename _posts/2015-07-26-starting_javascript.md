---
layout: post
title: Javascript - kickstart front-end development
lang: en
---

This post discussed some of the things I have learned in my recent exploration on Javascript.

A good resource for learning the language is [Eloquent Javascript](http://eloquentjavascript.net/)

Javascript has become more popular for the past few years, possibly due to the popularity introduced by Node.

Just like Python, Javascript is also dynamically typed. While it is easier for scripting, it also introduces difficulties in type checking in engineering large front-end projects.[^1]

##Modules in Javascript

One of the paradigm to declare modules is referred as **Immediately-invoked Function Expression**, or IIFE, is the terminology coined by Ben Alman [^2] (**really worth reading**). Some of the syntax used here is just tell the interpreter that this is a function expression instead of a declaration.
You must notice, though, that how you can add this module to the global scope.

An example from *Eloquent Javascript*:

```javascript
(function(exports) {
	var names = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];
	exports.name = function(number) {
    	return names[number];
	};
	exports.number = function(name) {
    	return names.indexOf(name);
	};
})(this.weekDay = {}); // This declares the weekDay in global and pass as a argument. Try change it to this.weekDay only?
```

The below example further compounds the example above: it imports two modules: jQuery and Underscore from the global scope and the export to `mod`. This ensures that the dependencies are correctly introduced to the module so as to avoid any uncertainty in javascript's global scope.

```javascript
	(function (mod, $, _) {
		mod.add = ***;
		mod.sub = ***;
	}((window.mod = window.mod || {}), jQuery, Underscore)); //window is basically this in the global context.
```

##Footnotes:
[^1]: [Immediately-Invoked Function Expression (IIFE)](http://benalman.com/news/2010/11/immediately-invoked-function-expression/#iife)

[^2]: [阮一峰: Javascript模块化编程：模块的写法](http://www.ruanyifeng.com/blog/2012/10/javascript_module.html)
