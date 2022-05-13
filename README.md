## Update 2022

It's been two years and it's time to amp this up with some new features in preparation for a different project I am working on.

* Eliminated need for curly braces in front matter - except for nesting. This was a TODO in the original version.
* Grossly expanded Markdown capabilities using Markdeeper, a project I've been using for offline MD processing that is based on Markdeep.


## A simplified static site builder written in NodeJS.


This was originally created as a quick and dirty solution for turning some text files containting notes and documentation into a fully-indexed static nanosite.
It's sort of like a really stripped-down Jekyll I hacked together rather quickly.


"Frontmatter" in this still has the starting and ending triple dash, but also has the curly braces since it is to be parsed as JSON. It is not standards-compliant JSON however, since it will allow for unquoted keys, which makes it easier to type. A future version of this will eliminate the need for the curly braces.


The Markdown is very simplified, but all heading tags are thrown into a toc array for output later. The entire collection of documents will have their contents thrown into a single TOC for output in the index. Cross referencing opportunities!


I am not including any stylesheets right now.

