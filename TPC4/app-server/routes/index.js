var express = require('express');
var router = express.Router();

var axios = require('axios')

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX : <http://www.daml.org/2003/01/periodictable/PeriodicTable#>
`
var getLink = "http://www.localhost:7200/repositories/tabelaPeriodica?query=" 


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('inicio')
});

router.get('/groups', function(req, res, next) {
  var query = `SELECT * WHERE { ?g a :Group . OPTIONAL {?g :name ?name .} OPTIONAL {?g :number ?number .} } ORDER BY ASC (?number)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(gs => {
      var grupos = []
      gs.data.results.bindings.map(bind =>{
        var name = "", number = ""
        if (bind.name) name = bind.name.value
        if (bind.number) number = bind.number.value
        grupos.push([bind.g.value.split('#')[1], name, number])}
      )
      res.render('listaGrupos', {grupos:grupos})
    })
    .catch(erro => console.log(erro))
})

router.get('/groups/:g', function(req, res, next) {
  var query = `SELECT * WHERE { 
    OPTIONAL{:${req.params.g} :name ?name .}
    OPTIONAL{:${req.params.g} :number ?number .}
    :${req.params.g} :element ?e .
  } ORDER BY ASC (?e)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(g => {
      res.render('grupo', {id:req.params.g, grupo:g.data.results.bindings})
    })
    .catch(erro => console.log(erro))
})

router.get('/elements', function(req, res, next) {
  var query = `SELECT * WHERE { ?e a :Element .
    OPTIONAL {?e :name ?name .} 
    OPTIONAL {?e :group ?group .} 
    OPTIONAL {?e :period ?period .}  }  ORDER BY ASC (?e)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(es => {
      var elementos = []
      es.data.results.bindings.map(bind =>{
        var name = "", group = "", period = ""
        if (bind.name) name = bind.name.value
        if (bind.group) group = bind.group.value.split('#')[1]
        if (bind.period) period = bind.period.value.split('#')[1]
        elementos.push([bind.e.value.split('#')[1], name, group, period ])}
      )
      res.render('listaElementos', {elementos:elementos})
    })
    .catch(erro => console.log(erro))
})

router.get('/elements/:e', function(req, res, next) {
  var query = `SELECT * WHERE {
  OPTIONAL {:${req.params.e} :name ?name .} 
  OPTIONAL {:${req.params.e} :group ?group .} 
  OPTIONAL {:${req.params.e} :period ?period .} 
  OPTIONAL {:${req.params.e} :atomicNumber ?atomicNumber .}
  OPTIONAL {:${req.params.e} :atomicWeight ?atomicWeight .} 
  OPTIONAL {:${req.params.e} :classification ?classification .} 
  OPTIONAL {:${req.params.e} :color ?color .} 
  OPTIONAL {:${req.params.e} :standardState ?standardState .}
}`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(e =>{
      var elemento = []
      e.data.results.bindings.map(bind =>{
        var name = "", group = "", period = "", atomicNumber = "", atomicWeight = "", classification = "", color = "", standardState = ""
        if (bind.name){ name = bind.name.value
        elemento.push(["nome", name])}
        if (bind.group){ group = bind.group.value.split('#')[1]
        elemento.push(["grupo", group])}
        if (bind.period){ period = bind.period.value.split('#')[1]
        elemento.push(["periodo", period])}
        if (bind.atomicNumber){ atomicNumber = bind.atomicNumber.value
        elemento.push(["número atómico", atomicNumber])}
        if (bind.atomicWeight){ atomicWeight = bind.atomicWeight.value
        elemento.push(["peso atómico", atomicWeight])}
        if (bind.classification){ classification = bind.classification.value.split('#')[1]
        elemento.push(["classificação", classification])}
        if (bind.color){ color = bind.color.value
        elemento.push(["cor", color])}
        if (bind.standardState){} standardState = bind.standardState.value.split('#')[1]
        elemento.push(["estado normal", standardState])
      })
      res.render('elemento', {id:req.params.e, elemento:elemento})
    })
    .catch(erro => console.log(erro))
})

router.get('/periods', function(req, res, next) {
  var query = `SELECT * WHERE { ?p a :Period .
    OPTIONAL{ ?p :number ?number .} } ORDER BY ASC (?number)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(ps => {
      var periodos = []
      ps.data.results.bindings.map(bind =>{
        var number = ""
        if (bind.number) number = bind.number.value
        periodos.push([bind.p.value.split('#')[1], number ])}
      )
      res.render('listaPeriodos', {periodos:periodos})
    })
    .catch(erro => console.log(erro))
})

router.get('/periods/:p', function(req, res, next) {
  var query = `SELECT * WHERE { 
    OPTIONAL{:${req.params.p} :number ?number .}
    :${req.params.p} :element ?e .
  } ORDER BY ASC (?e)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(p => {
      res.render('periodo', {id:req.params.p, periodo:p.data.results.bindings})
    })
    .catch(erro => console.log(erro))
})




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
