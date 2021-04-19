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

/* GET home page. */

router.get('/pubs', function(req, res, next) {
  var query = `SELECT ?p ?type ?title ?year WHERE { 
    ?p a :Pubs .
    ?p rdf:type ?type .
    ?p :title ?title.
    FILTER(?type != owl:NamedIndividual) .
    FILTER(?type != :Pubs) .
    OPTIONAL {?p :year ?year .}
    }
    ORDER BY DESC (?year) (?p)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(selectLink + encoded)
    .then(dados => {
      final = dados.data.results.bindings.map(d =>{
        y = ""
        if (d.year) y = d.year.value
        return({
            id: d.p.value.split('#')[1],
            title: d.title.value,
            type: d.type.value.split('#')[1],
            year: y
        })
      })
      res.send(final)
    })
    .catch(erro => console.log(erro))
})

router.get('/pubs/author/:id', function(req, res, next) {
  var query = `SELECT ?p ?type ?title ?year WHERE { 
    ?p a :Pubs .
    ?p rdf:type ?type .
    ?p :title ?title.
    FILTER(?type != owl:NamedIndividual) .
    FILTER(?type != :Pubs) .
    OPTIONAL {?p :year ?year .}
    { ?p :hasAuthor :${req.params.id} . }
    UNION
    { ?p :hasAuthorRef :${req.params.id} . }
    }
    ORDER BY DESC (?year) (?p)`
  var encoded = encodeURIComponent(prefixes + query)
  
  axios.get(selectLink + encoded)
    .then(dados => {
      final = dados.data.results.bindings.map(d =>{
        y = ""
        if (d.year) y = d.year.value
        return({
            id: d.p.value.split('#')[1],
            title: d.title.value,
            type: d.type.value.split('#')[1],
            year: y
        })
      })
      res.send(final)
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
        }).map(v =>{ return( v.split('#')[1])}).join(' ; ')
      }

      else if((d.p.value.split('#')[1] === "hasAuthor") || (d.p.value.split('#')[1] === "hasAuthorRef")){
        jsonVariable[`${d.p.value.split('#')[1]}`] = d.o.value.split(', ').map(v =>{
          return(v.split('#')[1])
        }).join(' ; ')
      }

      else{
        var pp = d.p.value, oo = d.o.value
        if(d.p.type === 'uri') pp = d.p.value.split('#')[1]
        if(d.o.type === 'uri') oo = d.o.value.split('#')[1]

        jsonVariable[`${pp}`] = oo
      }
    })
    res.send(jsonVariable)
  })
  .catch(erro => console.log(erro))
})


router.get('/authors', function(req, res, next) {
  var query = `SELECT ?s ?name (COUNT(?pubs) as ?nrPubs) WHERE { 
    ?s a :Author .
    ?s :name ?name .
    {?s :isRefAuthorIn ?pubs .}
    UNION
    {?s :authorOf ?pubs .}
    }
   GROUP BY ?s ?name
   ORDER BY (?s)`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(selectLink + encoded)
    .then(dados => {
      final = dados.data.results.bindings.map(d =>{
        return({
            id: d.s.value.split('#')[1],
            name: d.name.value,
            pubs: d.nrPubs.value
        })
      })
      res.send(final)
    })
    .catch(erro => console.log(erro))
})




module.exports = router;
