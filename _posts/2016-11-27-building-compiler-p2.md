---
layout: post
title: Building a Compiler in ML - Part 2
lang: en
---

Two weeks ago, we talked about writing the front-end of our WACC compiler. Now we will discuss the backend.

## Lessons learned from the front-end.

In the front-end we mentioned that we would like to simplify the structure of our AST. We did so by merging the expression `expr` datatype with `stmt` datatype. We argue that this will simplify the semantic analysis phase. However, by the end of this week I have reverted all the simplification and made explicit distinction between the statements and expressions. Why?

It turns out that such simplication brings tremendous complication to the code generator. The WACC language specification makes the difference between statements and expressions distinct: an statement if something that may involve side-effect. While expression almost guarantees to be side-effect free.

Consider the cases below:

```
int[] arr = [1,2,3];
# The left-hand-side only involves accessing the array, not    mutating it.
int i = arr[0] + arr[1]; 
arr[2] = 0;  # Mutation of the third element of array in an statement
```

This would affect the way we generate IR. I will discuss this in much greater details below. However, to put it in one sentence: we would generally manipulate memory allocation when dealing with a statement while we usually do memory access on the right-hand-side. Separating the two allows us to focus on their separate goals.

## This week

Instead of following the specification to write our own code generator. We chose to write with the help of the LLVM IR. The WACC specification never requires that we implement the IR middle end. However, if we want to do serious optimizations on the backend. Having the IR will be immensely useful.

Before we dive into the LLVM IR, there are concepts that we need to understand about LLVM's IR representation. In particular, it uses a form called [Single Static Assignment](https://realworldocaml.org/v1/en/html/variants.html) (SSA) to represent the abstract instructions in the IR.

Note that if you are working only with getting the compiler to work, generating the IR may not be simpler than writing your own code generator. We find using LLVM challenging given that problems during the codegen phase becomes to harder to be identified.

So what is SSA exactly? A simply explanation would be that that rather than keeping one copy of the reference to and variable (so instead of having variable %v only we would have %v, %v1, %v2). It keeps multiple copies and does version control on them. The [Kaleidoscope tutorial](http://llvm.org/docs/tutorial/OCamlLangImpl1.html) is a really good resource. Another good resource I found comes from the CMU's [15-411 Compiler Design](https://www.cs.cmu.edu/~fp/courses/15411-f13/lectures/06-ssa.pdf). It discussed the algorithms for generating the SSA for various control flow structures.

We can generate SSA as found on the Kaleidoscope tutorial. However, we can still generate the IR by normal allocation and load instructions. In fact, this is what I did given that SSA generation involving control flows such as while loops are not so straightforward. LLVM also features effective optimizations to convert the alloca/load form of to its SSA counterpart.

## Goals and objectives

We continue to design our compiler such that the complexity of the piece of software if minimized. There are two things we watch out for:

1. We want separate phases of the compilation to be as independent as possible. 
2. We want to keep our datatypes to be as simple and as expressive as possible.

Point 1 is where ML really shines. We can enforce strong modular independence by managing our module interface and making our types involved abstract. In this way, other modules would have no way of by-pasing the interface and hack on the implementation. Also, it would also mean that we can limit the information we want to pass forward to the next phase of our compilation. For example, in the semantic analysis we generate a symbol tables for the type information. However, we do not need this piece of information for codegen (at least not for WACC): we can just use the LLVM primitives (i8_type, i32\_type etc.).  Also, given we have passed the semantic analysis phase of our compiler, we can safely assume we can discard and exception handling for type mismatch in our CodeGen module.

Point 2 is where I think I have devoted the most time to. There are really two concerns to this objective. We mentioned one in the previous section. We do not want our datatypes to be too simple such that it hinders our differentiation of potentially different constructs.

However, we also do not want to have two many distinct datatypes. First, the arity of our ADTs increase tremendously, which proves to be disastrous when it comes of pattern matching. An ADT with an arity of 2 may have 4 different cases to match against. However, once we increase the arity to 3 we would suffer exponential growth of the number of patterns we may want to handle.

Having datatypes with many variants may also be dangerous too. Some of our functions may only operate on a subset of the variants. Having many variants simply means that we discard more cases (or add more cases of exception handling) for a particular function. We can discard handling those cases all together by putting them all into a `_` pattern. However, we normally would want to avoid that since it is not using the type system properly to check errors during refactoring.

A concrete example is given below. Consider the case we have the following ADTs:

```ocaml
and exp =
  | IdentExp    of string * pos
  | ArrayIndexExp of string * exp list * pos
  | LiteralExp  of literal * pos
  | BinOpExp    of exp * binop * exp * pos
  | UnOpExp     of unop * exp * pos
  | NullExp     of pos
  | NewPairExp  of exp * exp * pos
  | CallExp     of string * (exp list) * pos
  | FstExp      of exp * pos
  | SndExp      of exp * pos
and stmt =
  | SkipStmt of pos
  | VarDeclStmt of ty * string * exp * pos
  | AssignStmt of exp * exp * pos
  | ReadStmt of exp * pos
  | FreeStmt of exp * pos
  | ExitStmt of exp * pos
  | PrintStmt of exp * pos
  | PrintLnStmt of exp * pos
  | IfStmt of exp * stmt * stmt * pos
  | WhileStmt of exp * stmt * pos
  | BlockStmt of stmt * pos
  | RetStmt of exp * pos
  | SeqStmt of stmt list
```

There is a constant tradeoff between having more ADTs and fewer ADTs and more small functions to handle the ADTs separately.

We can, for example, collect `IdentExp`, `ArrayIndexExp` into an ADT we call `var`. Then they will be be represented in `exp` as something like:

```ocaml
VarExpr of var * pos
```

This would give us the opportunity to put the code for handing codegen in a separate function. However, notice how the arity of the `VarExpr` actually increases. Also, we can merge `stmt` and `exp` all together into `exp`. But that would mean we would clutter up the whole definition of some function such as `codegen_expr`.

Actually, OCaml provides a powerful construct called [Polymorphic Variant](https://realworldocaml.org/v1/en/html/variants.html) to give us more freedom in dealing with subsets of datatypes. But given that the OCaml binding of LLVM does not utilize this feature, introducing them into our codebase merely brings about discontinuity in code style.

### Note on the LLVM binding

It seems that the OCaml binding in llvm3.9 (installed from Homebrew) does not work with the OCaml 4.02.3 compiler. I used the the 3.8 version of llvm and its respective binding (`opam install llvm3.8`) from OPAM in order to get them working on OS X Sierra.

Also, working with the LLVM bindings break the safety assurance (no segmentation fault) that ML brings about. Be prepared to include lots of debug information in your codebase to debug those problems :D Working with mutable data structures in a functional programming language is not fun.









