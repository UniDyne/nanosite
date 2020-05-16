
## A simplified static site builder written in NodeJS.


This was originally created as a quick and dirty solution for turning some text files containting notes and documentation into a fully-indexed static nanosite.
It's sort of like a really stripped-down Jekyll I hacked together rather quickly.


"Frontmatter" in this still has the starting and ending triple dash, but also has the curly braces since it is to be parsed as JSON. It is not standards-compliant JSON however, since it will allow for unquoted keys, which makes it easier to type. A future version of this will eliminate the need for the curly braces.


The Markdown is very simplified, but all heading tags are thrown into a toc array for output later. The entire collection of documents will have their contents thrown into a single TOC for output in the index. Cross referencing opportunities!


I am not including any stylesheets right now.


## Future Work

* Elimintate need for curly braces in front matter - except for nesting.
* Expand Markdown compatibility - namely, support for tables.
