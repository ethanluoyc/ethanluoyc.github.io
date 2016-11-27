---
layout: post
title: Building a Compiler in ML - Part 1
lang: en
---

People who know me at school will know that I am busy with taking the Introductory Compiler course over the past few weeks. Specifically, the course covers the fundamental concepts in engineering a toy compiler (known as the wacc compiler) as the accompanying exercise.

This post records my experience in implementing the frontend of our compiler. In the following two weeks, I will be finishing the backend of the compiler, followed by two more weeks to complete some form of extension beyond what is required in WACC's minimal specification. (Special thanks to Michelle who lent me her group's completed spec :D)

Now let's dive in.

## Why ML (OCaml) ?

You may wonder why on earth I would write my compiler in ML? I program in Python most of the time. Also , some of you may know that Imperial teaches Haskell in first year. Plus, the lab support uses Java with ANTLR. There is not a single reason you should be using ML. The reasons are simply the following:

1. The first functional programming language is Standard ML. Therefore, I am more or less farmiliar with The OCaml syntax.
2. the ML family has a strong emphasis on safety and modularity which are all very important for compiler writers.
3. While I have thought about writing it in Haskell, I am not really a fan of this lazyness and pure concept. They are great and powerful features, but not really so useful in writing a compiler when having the concept of a "state" is essential.
4. Java requires too much boilerplate. My current frontend implementation is around ~700 lines of OCaml code. I doubt I could do it in Java with less than 1000. Also, it lacks useful features (such as pattern matching which I believe is one of the most useful features a programming language can provide for writing compilers). I personally would choose Scala if not OCaml, but Scala has really powerful and complex features that I could easily abuse instead of using them. OCaml, on the other hand, has fewer language constructs which would enforce discipline in my writing. Also, it just does not feel so right when you have to boot up a JVM to compile some non-JVM language...
5. You master a language by writing a compiler in that language. I think OCaml is a good add-on to my tool kit so I can take this opportunity to learn more about the language.
6. LLVM has OCaml bindings. I might play around with LLVM during the second part of this course so it makes much sense. (Some credits to Jimmy from UIUC who has been propagating the LLVM concepts over the course of the last three years...)
7. OCaml is more cute than Haskell...
8. The list just goes on and on...

## Lexing and parsing

Lexing can be thought of breaking up a long stream of strings into tokens. Parsing is to construct a tree from the list of  tokens to derive useful structures for later stages of our compilation process. I found Appel's book to be very useful for introducing these concepts.

I implemented the lexing and parsing with ocamllex and menhir (a drop-in replacement for the legacy ocamlyacc). 

Menhir includes functionalities to export code to the proof assistant Coq, which would enable use to pursue some form of formal verification for our parser. I hope to read more on this later.

## Semantic Analysis

The parser generates a parse tree. But it contains so many details that would not be very helpful for later statges. I would highlight a few design decisions I made that I feel are worth mentioning:

1. The EBNF definition of the WACC language distingushes statements from expressions. While the parser distinguishes statements from expressions during parsing. This is hardly a useful piece of distinction after the parsing phase: when we are doing type checking. Having the distinction means that we must implement type checking phases for statements and expressions separately, which we don't desire.
2. The symbol table is implemented with a functional binary search tree. Trust me that I know the difference between O(log N) and O(1), but since we choose to use a functional programming language using a mutable hashtable is really less desirable.
3. The WACC language also contains built-in functions such as `read`, `print` and `printf`, There is actually no need to keep these built-in keywords as particular type constructors in our AST. Keeping them as special type constructors means we have to perform type checking of these expressions by exhaustive pattern matching, which is not desirable at all when we could simply encode the types of these build-in functions succintly in a pre-defined symbol table. To the extreme we can abandon all of the operator constructors in our AST and use an `Apply` node to abstract all expressions as some form of function application. (further unifying our type-checking logic and improving modularity). This seems to be true for the Scala compiler. In reality I do not pursue these design decisions (at least not at the point of wrting this post.)

## Pitfalls

Some lessons learned from the two weeks so far:

1. Think about interfaces first! ML is really a very safe language provided that you have a clean interface and clean separation of responsibilities among modules. Also, it might be a great idea to clearly design the interfaces first. Given I did this as an individual project, the freedom really encouraged me to forgo lots of the good practice developed from my previous software engineering courses...
2. Design your interfaces well and implement functions bottom up instead of top down. I find myself not DRY just because I do not implement some of the mostly used helper functions.


## Conclusion

Currently I have no idea what my extension will be considering the fact I have little clue about how the WACC runtime will be organized… I am interested in the parallel execution of instructions as an optimizing strategy or the Hindley Milner type inference system. Both of which would pose significant challenges mentally and physically (after all, you sit down in front of your laptop to write those, don't you)  I will revaluate these options in two weeks' time. See you soon.
