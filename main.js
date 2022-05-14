const
    fs = require("fs"),
    path = require("path"),
    EventEmitter = require("events"),
    Content = require("./src/Content"),
    Template = require("./src/Template");


/* change this later to load from a file... */
const Config  = {
    site: {
        name: "Documentation"
    },
    page: {
        template: "default"
    }
};




!async function main() {
    var files = fs.readdirSync(path.join(__dirname, 'content'));

    Config.TOC = [];

    for(var i = 0; i < files.length; i++) {
        
        // need to process 'index' last...
        if(files[i].replace(path.extname(files[i]),'') == "index" && i < files.length - 1) {
            files.push(files.splice(i,1)[0]);
        }
        
        var st = fs.statSync(path.join(__dirname, 'content', files[i]));
        
        if(st.isDirectory()) continue; // do not recurse for now
        
        var c = new Content(path.join(__dirname, 'content', files[i]), st);
        var data = await c.process(Config);

        var out = Template.process(data);

        for(var j = 0; j < data.toc.length; j++) data.toc[j].file = files[i].replace(path.extname(files[i]),'')+'.html';
        
        Config.TOC.push({
            title: data.page.title,
            file: files[i].replace(path.extname(files[i]),'')+'.html',
            toc: data.toc
        });

        fs.writeFileSync(path.join(__dirname, 'dist', files[i].replace(path.extname(files[i]),'')+'.html'), out);
    }
}();
