const fs = require('fs');

module.exports = {

    async index(req, res){
        let respo;
        //fs.readFile('./index.html', (err, html) => res.end(html));
        await fs.readdir("./movies", (err, respo) => {
            var data = [];
            for(name in respo){
                if(respo[name].indexOf('.mp4') !== -1) data.push(respo[name]);
            }
            return res.json(data);
        });
        //return res.json({resp});
    },

    show(req, res){
        const { name } = req.params;
        console.log(name);
        const movieFile = `./movies/${name}`;
        fs.stat(movieFile, (err, stats) => {
        if (err) {
            console.log(err);
            return res.status(404).end('<h1>Movie Not found</h1>');
        }
        // Variáveis necessárias para montar o chunk header corretamente
        const { range } = req.headers;
        const { size } = stats;
        //console.log(range)
        const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
        const end = size - 1;
        const chunkSize = (end - start) + 1;
        // Definindo headers de chunk
        res.set({
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        });
        // É importante usar status 206 - Partial Content para o streaming funcionar
        res.status(206);
        // Utilizando ReadStream do Node.js
        // Ele vai ler um arquivo e enviá-lo em partes via stream.pipe()
        const stream = fs.createReadStream(movieFile, { start, end });
        stream.on('open', () => stream.pipe(res));
        stream.on('error', (streamErr) => res.end(streamErr));
        });
    }

}