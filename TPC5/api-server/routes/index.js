var express = require('express');
var router = express.Router();

var axios = require('axios')

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xml: <http://www.w3.org/XML/1998/namespace>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX : <http://www.di.uminho.pt/prc2021/pubs#>
`
var selectLink = 'http://epl.di.uminho.pt:8738/api/rdf4j/query/select/A80624-TPC5?query=' 
var postLink = 'http://epl.di.uminho.pt:8738/api/rdf4j/query/A80624-TPC5?query=' 


/* GET home page. */

router.get('/pubs', function(req, res, next) {
  var query = `SELECT * WHERE { ?p a :Pubs . `
  if(req.query.type) query += '?p a :' + req.query.type + ' .' 
  query += `?p :title ?title . } ORDER BY ASC (?title)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(selectLink + encoded)
    .then(dados => {
      final = dados.data.results.bindings.map(d =>{
        return({
            id: d.p.value.split('#')[1],
            title: d.title.value
        })
      })
      console.dir(final)
    })
    .catch(erro => console.log(erro))
})


router.get('/pubs/:id', function(req, res, next) {
  var query = `select ?p (GROUP_CONCAT(DISTINCT(?o); SEPARATOR=", ") AS ?o)  where {
    :${req.params.id} ?p ?o . }
  GROUP BY (?p)
  ORDER BY (?p)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(selectLink + encoded)
  .then(dados => {
    var jsonVariable = {id: req.params.id};
    dados.data.results.bindings.map(d =>{

      if(d.p.value.split('#')[1] === "type"){
        jsonVariable[`${d.p.value.split('#')[1]}`] = d.o.value.split(', ').filter(function(item){
          v = item.split('#')[1]
          return ( (v != "Pubs") && (v != "NamedIndividual") )  
        }).map(v =>{ return( v.split('#')[1])})
      }

      else if((d.p.value.split('#')[1] === "hasAuthor") || (d.p.value.split('#')[1] === "hasAuthorRef")){
        jsonVariable[`${d.p.value.split('#')[1]}`] = d.o.value.split(', ').map(v =>{
          return(v.split('#')[1])
        })
      }

      else{
        var pp = d.p.value, oo = d.o.value
        if(d.p.type === 'uri') pp = d.p.value.split('#')[1]
        if(d.o.type === 'uri') oo = d.o.value.split('#')[1]

        jsonVariable[`${pp}`] = oo
      }
    })
    console.dir(jsonVariable)
  })
  .catch(erro => console.log(erro))
})


router.get('/authors', function(req, res, next) {
  var query = `SELECT * WHERE { ?a a :Author . OPTIONAL {?a :name ?name .}} ORDER BY ASC (?name)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(selectLink + encoded)
    .then(dados => {
      final = dados.data.results.bindings.map(d =>{
        return({
            id: d.a.value.split('#')[1],
            name: d.name.value
        })
      })
      console.dir(final)
    })
    .catch(erro => console.log(erro))
})


router.get('/authors/:id', function(req, res, next) {
  var query = `SELECT ?name (GROUP_CONCAT(DISTINCT(?pub1); SEPARATOR=", ") AS ?pub1) (GROUP_CONCAT(DISTINCT(?pub2); SEPARATOR=", ") AS ?pub2) WHERE { 
    :${req.params.id} :name ?name .
    OPTIONAL {:${req.params.id} :authorOf ?pub1 .}
    OPTIONAL {:${req.params.id} :isRefAuthorIn ?pub2 .}
    }
    GROUP BY ?name`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(selectLink + encoded)
    .then(dados => {
      final = dados.data.results.bindings.map(d =>{
        return({
            id: req.params.id,
            name: d.name.value,
            isAuthorOf: d.pub1.value.split(', ').map(v =>{
              return(v.split('#')[1])
            }),
            isRefAuthorOf: d.pub2.value.split(', ').map(v =>{
              return(v.split('#')[1])
            })
        })
      })
      console.dir(final)
    })
    .catch(erro => console.log(erro))
})




module.exports = router;
