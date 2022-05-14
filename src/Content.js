/**
 * Content template engine. Markdown, variables, and frontmatter.
 */

const
    fs = require("fs"),
    path = require("path"),
    //Markdown = require("./Markdown");
    Markdeeper = require("markdeeper");

function loadData(filename, meta) {
    var data = {
        frontmatter: {},
        tmpl: '',
        meta: meta
    };
    var raw = fs.readFileSync(filename, 'utf8');

    // fontmatter
    var found = raw.match(/^---\{?([\s\S]*?)\}?---$/m);
    if(found) try {
        var jdat = found[0].replace(/^---\{?/,'{').replace(/\}?---$/,'}'); // strip start and end
        jdat = jdat.replace(/(['"])?([a-zA-Z0-9_$]+)(['"])?:/g, '"$2": '); // fix quotes
        data.frontmatter = JSON.parse(jdat); // parse json
        data.tmpl = raw.replace(found[0], ''); // remove frontmatter
    } catch(e) {}
    else data.tmpl = raw;

    return data;
}


module.exports = class Content {
    constructor(filename, meta) {
        this.data = loadData(filename, meta);
    }

    async process(data) {

        // merge default data with frontmatter
        Object.assign(data.page, this.data.frontmatter);
        data.file = this.data.meta;
        
        /* replace variables */
        var partial = this.data.tmpl.replace(/\{\{([A-Za-z0-9_\.]*)\}\}/g, (w,g) => (g.replace(/^\s+|\s+$/g,'').split('.').reduce((o,i)=>o[i],data) || w));
        
        // process markdown
        //var md = Markdown.exec(partial);
        var md = await Markdeeper.processSection(partial);
        data.content = md.content;
        data.toc = md.toc;
        
        return data;
    }
}
