var fs = require('fs')

var toWrite = ''
var i;
fs.readFile('./emd.json', 'utf8', (err, file) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    
    var fparsed = JSON.parse(file);

    for (i = 0; i < fparsed.length; i++){
        var e = fparsed[i]
        var info = '###  http://www.di.uminho.pt/PRC2021/emd#' + e._id + '\n'
                + ':' + e._id + ' rdf:type owl:NamedIndividual , :EMD ;\n'
                + ':relativoAmodalidade :' + e.modalidade +';\n'
                + ':data "' + e.dataEMD + '" ;\n'
                + ':resultado ' + e.resultado + ' .\n'

        info += '\n###  http://www.di.uminho.pt/PRC2021/emd#' + e.nome.primeiro + '_' + e.nome.último + '\n'
                + ':' + e.nome.primeiro + '_' + e.nome.último + ' rdf:type owl:NamedIndividual , :Atleta ;\n'
                + ':praticaModalidade :' + e.modalidade + ' ;\n'
                + ':pertenceAoClube :' + e.clube.split(' ').join('_') + ' ;\n'
                + ':realizouEMD :' + e._id + ' ;\n'
                + ':idade ' + e.idade + ' ;\n'
                + ':genero "' + e.género + '" ;\n'
                + ':morada "' + e.morada + '" ;\n'
                + ':federado "' + e.federado + '"^^xsd:boolean ;\n'
                + ':email "' + e.email + '" .\n'

        info += '\n###  http://www.di.uminho.pt/PRC2021/emd#' + e.clube.split(' ').join('_') + '\n'
                + ':' + e.clube.split(' ').join('_') + ' rdf:type owl:NamedIndividual , :Clube ;\n'
                + ':temModalidade :' + e.modalidade + ' .\n'
        
        info += '\n###  http://www.di.uminho.pt/PRC2021/emd#' + e.modalidade + '\n'
                + ':' + e.modalidade + ' rdf:type owl:NamedIndividual , :Modalidade .\n'

        toWrite += info + '\n'
    }

    fs.writeFile('emd_individuos.txt', toWrite, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
})
