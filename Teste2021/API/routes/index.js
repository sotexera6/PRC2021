var axios = require('axios');
var express = require('express');
var router = express.Router();
var gdb = require('../utils/graphdb')

/* GET home page. */
router.get('/emd', async function(req, res) {
  var r = "?resultado"
  if (req.query.res && req.query.res == "OK") r = "true";
  var myquery = `SELECT * WHERE {
    ?id a :EMD .
    ?nome :realizouEMD ?id .
    ?id :data ?data.
    ?id :resultado ${r} .
  }
  ORDER BY ?id`
  var result = await gdb.execQuery(myquery);
  var dados = result.results.bindings.map(b =>{
    if (req.query.res && req.query.res == "OK")
    return {
      id: b.id.value.split('#')[1],
      nome: b.nome.value.split('#')[1],
      data: b.data.value
    }
    else 
    return {
      id: b.id.value.split('#')[1],
      nome: b.nome.value.split('#')[1],
      data: b.data.value,
      resultado: b.resultado.value
    }
  })
  res.jsonp(dados)
});

router.get('/emd/:id', async function(req, res) {
  var myquery = `SELECT * WHERE {
    ?nome :realizouEMD :${req.params.id} ;
          :pertenceAoClube ?clube ;
          :federado ?federado ;
          :idade ?idade ;
          :morada ?morada ;
          :email ?email ;
          :genero ?genero .
   :${req.params.id} :data ?data ;
    	:resultado ?resultado ;
     	:relativoAmodalidade ?modalidade .
  }`
  var result = await gdb.execQuery(myquery);

  var dados = result.results.bindings.map(b =>{
    return {
      id: req.params.id,
      data: b.data.value,
      resultado: b.resultado.value,
      nome: b.nome.value.split('#')[1],
      idade: b.idade.value,
      morada: b.morada.value,
      genero: b.genero.value,
      email: b.email.value,
      federado: b.federado.value,
      modalidade: b.modalidade.value.split('#')[1],
      clube: b.clube.value.split('#')[1]
    }
  })
  res.jsonp(dados)
});

router.get('/modalidades', async function(req, res) {
  var myquery = `SELECT DISTINCT ?m WHERE {
    ?m a :Modalidade .
  }
  ORDER BY ?m`
  var modalidades = [];
  var result = await gdb.execQuery(myquery);
  result.results.bindings.map(b =>{
      modalidades.push(b.m.value.split('#')[1])
  })
  res.jsonp(modalidades)
});

router.get('/modalidades/:id', async function(req, res) {
  var myquery = `SELECT DISTINCT ?e WHERE {
    ?e a ?EMD .
    ?e :relativoAmodalidade :${req.params.id} .
  }
  ORDER BY ?e`
  var emd = [];
  var result = await gdb.execQuery(myquery);
  result.results.bindings.map(b =>{
    emd.push(b.e.value.split('#')[1])
  })
  res.jsonp(emd)
});

router.get('/atletas', async function(req, res) {
  if (req.query.gen && req.query.gen == "F") {
    var myquery = `SELECT * WHERE {
      ?nome a :Atleta .
      ?nome :genero "F" .
    }
    ORDER BY ?nome`
  }
  if (req.query.clube) {
    var myquery = `SELECT * WHERE {
      ?nome a :Atleta .
      ?nome :pertenceAoClube :${req.query.clube} .
    }
    ORDER BY ?nome`
  }
  var dados = [];
  var result = await gdb.execQuery(myquery);
  result.results.bindings.map(b =>{
    dados.push(b.nome.value.split('#')[1])
  })
 
  res.jsonp(dados)
});


module.exports = router;
