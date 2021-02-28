import json

with open("uni.json") as jsonfile:
    data = json.loads(jsonfile.read())

f = open("uni.ttl", "w")

f.write(''':ensina rdf:type owl:ObjectProperty ;
        owl:inverseOf :ensinadaPor ;
        rdfs:domain :Docente ;
        rdfs:range :UnidadeCurricular .\n''')

f.write(''':frequenta rdf:type owl:ObjectProperty ;
           owl:inverseOf :frequentadaPor ;
           rdfs:domain :Aluno ;
           rdfs:range :UnidadeCurricular .\n''')

f.write(''':alunoDe rdf:type owl:ObjectProperty ;
          owl:inverseOf :professorDe .\n''')

f.write(''':ensinadaPor rdf:type owl:ObjectProperty .\n''')
f.write(''':frequentadaPor rdf:type owl:ObjectProperty .\n''')
f.write(''':professorDe rdf:type owl:ObjectProperty ;
              owl:propertyChainAxiom ( :ensina :frequentadaPor ) .\n''')

f.write('\n')

f.write(''':nome rdf:type owl:DatatypeProperty .\n''')
f.write(''':idade rdf:type owl:DatatypeProperty .\n''')

f.write('\n')

f.write(''':Aluno rdf:type owl:Class ;
       rdfs:subClassOf [ rdf:type owl:Restriction ;
                         owl:onProperty :frequenta ;
                         owl:someValuesFrom :UnidadeCurricular
                       ] .\n''')
f.write(''':Docente rdf:type owl:Class .\n''')
f.write(''':UnidadeCurricular rdf:type owl:Class ;
           rdfs:subClassOf [ rdf:type owl:Restriction ;
                             owl:onProperty :ensinadaPor ;
                             owl:someValuesFrom :Docente
                           ] .\n''')

f.write('\n')

ucs = data[0]['ucs']
for u in ucs:
    str = ':' + u['codigo'] + ' rdf:type owl:NamedIndividual , :UnidadeCurricular ; :nome "' + u['nome'] + '" ; :ensinadaPor :' + u['docente'] +' .\n'
    f.write(str)

f.write('\n')

docentes = data[1]['docentes']
for d in docentes:
    str = ':' + d['nrDocente'] + ' rdf:type owl:NamedIndividual , :Docente ; :nome "' + d['nome'] + '" .\n'
    f.write(str)

f.write('\n')

alunos = data[2]['alunos']
for a in alunos:
    idade = a['idade']
    str = ':' + a['nrAluno'] + ' rdf:type owl:NamedIndividual , :Aluno ; :nome "' + a['nome'] + f'" ; :idade "{idade}" ; :frequenta'
    for uc in a['ucs']:
        str += f' :{uc}'
    str += ' .\n'
    f.write(str)

f.close()
