/**
 *  A really simple Markdown processor.
**/

const TOC = [];

const RULES = [
    /* block expressions first */
    { /* H4 - adds to TOC */
        regex: /^(####)[ \t]*(.*)[ \t]*\1?$/mg,
        repl: (m,g,t,p) => {TOC.push({p:p,l:4,t:t,n:t.replace(/\s+/g,'-').toLowerCase()}); return '<a name="'+t.replace(/\s+/g,'-').toLowerCase()+'"></a><h4>'+t+'</h4>';}
    },{ /* H3 - adds to TOC */
        regex: /^(###)[ \t]*(.*)[ \t]*\1?$/mg,
        repl: (m,g,t,p) => {TOC.push({p:p,l:3,t:t,n:t.replace(/\s+/g,'-').toLowerCase()}); return '<a name="'+t.replace(/\s+/g,'-').toLowerCase()+'"></a><h3>'+t+'</h3>';}
    },{ /* H2 - adds to TOC */
        regex: /^(##)[ \t]*(.*)[ \t]*\1?$/mg,
        repl: (m,g,t,p) => {TOC.push({p:p,l:2,t:t,n:t.replace(/\s+/g,'-').toLowerCase()}); return '<a name="'+t.replace(/\s+/g,'-').toLowerCase()+'"></a><h2>'+t+'</h2>';}
    },{ /* H1 - adds to TOC */
        regex: /^(#)[ \t]*(.*)[ \t]*\1?$/mg,
        repl: (m,g,t,p) => {TOC.push({p:p,l:1,t:t,n:t.replace(/\s+/g,'-').toLowerCase()}); return '<a name="'+t.replace(/\s+/g,'-').toLowerCase()+'"></a><h1>'+t+'</h1>';}
    },{ /* PRE */
        regex: /^(```)(.*?)\1$/smg,
        repl: '<pre>$2</pre>'
    },
    
    /* line breaks and paragraph expressions */
    { /* normalize line breaks */
        regex: /\r\n|\r/g,
        repl: '\n'
    },{ /* convert tabs to spaces */
        regex: /\t/g,
        repl: '    '
    },{ /* trim extra line breaks */
        rexex: /^[\w\<][^\n]*\n+/mg,
        repl: (m) => /\n{2}/.test(m) ? m : m.replace(/\s+$/,'')+' \n'
    },{ /* blockquote */
        regex: /^\n{2,}\> (.*?)\n{2}$/gms,
        repl: (m) => '<blockquote>' + m.replace(/\n\>/g,'\n') + '</blockquote>'
      },{ /* paragraphs (text blocks not already in tags) */
      regex: /^\n([^\<])([^\<]*?)([^\>])\n{2}$/gms,
      repl: '\n<p>$1$2$3</p>\n\n'
    },{ /* BR - double line feeds not bordered by tags */
        regex: /([^\>])\n{2}([^\<])/mg,
        repl: '$1\n<br>\n$2'
    },

    /* inline typographics */
    { /* bold */
        regex: /(\*{2,})(.+?)\1/g,
        repl: '<strong>$2</strong>'
    },{ /* italic */
        regex: /(_{2,})(.+?)\1/g,
        repl: '<em>$2</em>'
    },{ /* code */
        regex: /(`)(.+?)\1/g,
        repl: '<code>$2</code>'
    },{ /* links */
        regex: /\[(.*)\]\((.*)\)/g,
        repl: '<a href="$1">$2</a>'
    }
];

/* keep it simple. */
/* execute all replacements and return content with sorted toc */
module.exports = {
    exec: function(str) {
        TOC.length = 0;
        RULES.forEach((rule) => str = str.replace(rule.regex, rule.repl));
        return {content:str,toc:Array.from(TOC).sort((a,b)=>a.p<b.p?-1:1)};
    }
};