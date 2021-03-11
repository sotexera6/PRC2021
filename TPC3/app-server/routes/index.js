var express = require('express');
var router = express.Router();

var axios = require('axios')

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX : <http://www.di.uminho.pt/prc2021/Charada#>
`
var getLink = "http://www.localhost:7200/repositories/prc2021" + "?query=" 

var query = `SELECT * WHERE { ?s a owl:Class }`

var encoded = encodeURIComponent(prefixes + query)




/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get("http://localhost:7200/rest/repositories")
    .then(dados => res.render('index', {repos:dados.data}))
    .catch(erro => console.log(erro))
});

router.get('/repos/:r', function(req, res, next) {
  var getLink = "http://www.localhost:7200/repositories/" + req.params.r + "?query=" 
  var query = `SELECT * WHERE { ?s a owl:Class .}`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(cs => {
      var classes = []
      cs.data.results.bindings.map(bind =>
        classes.push(bind.s.value.split('#')[1])
      )
      res.render('repositorio', {repos:req.params.r, classes:classes})})

    .catch(erro => console.log(erro))
});

router.get('/repos/:r/classe/:c', function(req, res, next) {
  var getLink = "http://www.localhost:7200/repositories/" + req.params.r + "?query=" 
  var query = `SELECT * WHERE { ?s rdf:type :${req.params.c} .}`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(inds => {
      var individuos = []
      inds.data.results.bindings.map(bind =>
        individuos.push(bind.s.value.split('#')[1])
      )
      res.render('classe', {repos:req.params.r, classe:req.params.c, individuos:individuos})})

    .catch(erro => console.log(erro))
});

router.get('/repos/:r/individuo/:i', function(req, res, next) {
  var getLink = "http://www.localhost:7200/repositories/" + req.params.r + "?query=" 
  var query = `SELECT * WHERE {:${req.params.i} ?p ?o .}`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(ind => {
      var individuo = []
      ind.data.results.bindings.map(bind =>{
        if(bind.p.value.includes('Charada#')){
          var second
          if (bind.o.type === "literal") second = bind.o.value
          else second = bind.o.value.split('#')[1]

          individuo.push(
            [bind.p.value.split('#')[1], second]
          )}
        else if(bind.o.value.includes('Charada#')){
          var first
          if (bind.p.type === "literal") first = bind.p.value
          else first = bind.p.value.split('#')[1]

          individuo.push(
            [first, bind.o.value.split('#')[1]]
          )}
      })
      res.render('individuo', {repos:req.params.r, caracteristicas:individuo, individuo:req.params.i})})

    .catch(erro => console.log(erro))
});

module.exports = router;
