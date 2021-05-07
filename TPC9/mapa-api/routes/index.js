var axios = require('axios');
var express = require('express');
var router = express.Router();
var gdb = require('../utils/graphdb')

/* GET home page. */
router.get('/cidades', async function(req, res) {
  var myquery = `select ?s ?n ?d where { 
    ?s a :Cidade ;
         :nome ?n ;
         :distrito ?d .
  }
  ORDER BY ?n`
  var result = await gdb.execQuery(myquery);
  var dados = result.results.bindings.map(c =>{
    return {
      id: c.s.value.split('#')[1],
      nome: c.n.value,
      distrito: c.d.value
    }
  })
  res.jsonp(dados)
});


router.get('/cidades/:id', async function(req, res) {
  var myquery = `select ?n ?d ?p ?desc where { 
    :${req.params.id} a :Cidade ;
         :nome ?n ;
         :distrito ?d ;
         :população ?p ;
         :descrição ?desc .
  }`
  var result = await gdb.execQuery(myquery);
  var secondquery = `select ?c ?n ?dist where { 
    ?l a :Ligação ;
        :origem ?${req.params.id} ;
        :destino ?c ;
        :distância ?dist .
    ?c :nome ?n .
  }
  ORDER BY ?n`
  var ligações = await gdb.execQuery(secondquery)
  var ligLimpa = ligações.results.bindings.map(l => {
    return {
      id: l.c.value.split('#')[1],
      nome: l.n.value,
      distância: l.dist.value
    }
  })
  
  var dados = {
    id: req.params.id,
    nome: result.results.bindings[0].n.value,
    distrito: result.results.bindings[0].d.value,
    população: result.results.bindings[0].p.value,
    descrição: result.results.bindings[0].desc.value,
    ligações: ligLimpa
  }
  res.jsonp(dados)
});

router.post('/cidades', async function(req, res) {
  var myquery = `INSERT DATA {
    :${req.body.id} rdf:type owl:NamedIndividual , :Cidade ;
    :nome "${req.body.nome}" ;
    :distrito "${req.body.distrito}" ;
    :descrição "${req.body.descrição}" ;
    :população ${req.body.população} .
}`
  var result = await gdb.execTransaction(myquery);
  res.jsonp("Triplos inseridos: " + myquery)
});

router.delete('/cidades/:id', async function(req, res) {
  var cidade = await axios.get('http://localhost:13000/cidades/' + req.params.id)
  var myquery = `DELETE DATA {
    :${cidade.data.id} 
      :nome "${cidade.data.nome}" ;
      :distrito "${cidade.data.distrito}" ;
      :descrição "${cidade.data.descrição}" ;
      :população ${cidade.data.população} .
  }`
  var result = await gdb.execTransaction(myquery);
  res.jsonp("Dados apagados.")
});

// ----------------- Ligações -----------------
router.get('/ligacoes', async function(req, res) {
  var myquery = `CONSTRUCT {
    ?c1 :temLigação ?c2.
  } WHERE {
    ?l :origem ?c1 .
    ?l :destino ?c2 .
  }`
  var result = await gdb.execQuery(myquery);
  var dados = result.split('.\n').slice(0,-1).map(c => {
    c1 = c.split('> ')[0]
    c2 = c.split('> ')[2]
    return {
      c1: c1.split('#')[1],
      c2: c2.split('#')[1],
    }
  })

  for (d in dados){
    var myquery = `INSERT DATA {
      :${dados[d].c1} :temLigação :${dados[d].c2} .
    }`
    var result = await gdb.execTransaction(myquery);
  }
  
  res.jsonp(dados)
});

router.delete('/ligacoes', async function(req, res) {
  var myquery = `CONSTRUCT {
    ?c1 :temLigação ?c2.
  } WHERE {
    ?l :origem ?c1 .
    ?l :destino ?c2 .
  }`
  var result = await gdb.execQuery(myquery);
  var dados = result.split('.\n').slice(0,-1).map(c => {
    c1 = c.split('> ')[0]
    c2 = c.split('> ')[2]
    return {
      c1: c1.split('#')[1],
      c2: c2.split('#')[1],
    }
  })

  for (d in dados){
    var myquery = `DELETE DATA {
      :${dados[d].c1} :temLigação :${dados[d].c2} .
    }`
    var result = await gdb.execTransaction(myquery);
  }
  
  res.jsonp(dados)
});


module.exports = router;
