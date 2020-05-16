/**
 * Template engine with variables and includes.
 */

const
    fs = require("fs"),
    path = require("path");


const TmplCache = {};


function processSegment(tmpl, scope) {
    var output = tmpl;

    // iterators
    function iter(w, g, t) {
        var out = "";
        var x = g.split('.').reduce((o,i) => o[i], scope);
        
        if(x.length) {
            for(var i = 0; i < x.length; i++) {
                out += processSegment(t, x[i]);
            }
        } else {
            for(var i in x)
                out += processSegment(t, i);
        }
        return out;
    }
    output = output.replace(/\{%EACH ([A-Za-z0-9_\.]*)\}(.*)\{%ENDEACH\}/smg, iter);

    // conditional
    function ifblock(w,g,t) {
        var out = "";
        var x = g.split('.').reduce((o,i) => o[i], scope);
        
        if(x) out += processSegment(t, scope);

        return out;
    }
    output = output.replace(/\{%IF ([A-Za-z0-9_\.]*)\}(.*)\{%ENDIF\}/smg, ifblock);
    
    

    // variables
    output = output.replace(/\{\{([A-Za-z0-9_\.]*)\}\}/g, (w,g) => (g.replace(/^\s+|\s+$/g,'').split('.').reduce((o,i)=>o[i],scope) || w));

    return output;
}



class Template {
    constructor(filename) {

        this.filename = filename + '.jht';
        this.tmpl = fs.readFileSync(this.filename, 'utf8');

        // register self
        if(!TmplCache.hasOwnProperty(filename)) TmplCache[filename] = this;
    }

    process( scope ) {
        
        var tmplDir = path.dirname(this.filename);

        // first process all includes...
        function incl(w,g) {
            var filename = path.join(tmplDir, g.replace(/^\s+|\s+$/g,''));
            var tmpl = TmplCache.hasOwnProperty(filename) ? TmplCache[filename] : new Template(filename);
            return tmpl.process(scope);
        }
        var output = this.tmpl.replace(/\{%([A-Za-z0-9_\.]*)%\}/g, incl);


        output = processSegment(output, scope);
        

        return output;
    }
};



module.exports = {
    process: function( scope ) {
        var filename = scope.page.template || "default";
        // join with our base path...
        filename = path.join(__dirname, '../tmpl', filename);
        var tmpl = TmplCache.hasOwnProperty(filename) ? TmplCache[filename] : new Template(filename);
        return tmpl.process(scope);
    }
};