var filee = require('./mapavirtual.json')
var fs = require('fs')

var toWrite = ''
fs.readFile('./mapavirtual.json', 'utf8', (err, file) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    
    var fparsed = JSON.parse(file);

    for (i = 0; i < fparsed.cidades.length; i++){
        var c = fparsed.cidades[i]
        var cidade = ':' + c.id + ' rdf:type owl:NamedIndividual , :Cidade ;\n'
                + ':descricao "' + c.descrição + '" ;\n'
                + ':distrito "' + c.distrito + '" ;\n'
                + ':nome "' + c.nome + '" ;\n'
                + ':populacao ' + c.população + ' .\n'
        toWrite += cidade + '\n'
    }
    for (i = 0; i < fparsed.ligações.length; i++){
        var l = fparsed.ligações[i]
        var ligacao = ':' + l.id + ' rdf:type owl:NamedIndividual , :Ligacao ;\n'
                + ':origem :' + l.origem + ' ;\n'
                + ':destino :' + l.destino + ' ;\n'
                + ':distancia ' + l.distância + ' .\n'
        toWrite += ligacao + '\n'
    }

    fs.writeFile('mapa_individuos.txt', toWrite, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
})
