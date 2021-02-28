import json

with open("uni.json") as jsonfile:
    data = json.loads(jsonfile.read())

ucs = data[0]['ucs']
for u in ucs:
    str = ':' + u['codigo'] + ' rdf:type owl:NamedIndividual , :UnidadeCurricular ; :nome "' + u['nome'] + '"; :éEnsinadaPor :' + u['docente'] +' .'
    print(str)

docentes = data[1]['docentes']
for d in docentes:
    str = ':' + d['nrDocente'] + ' rdf:type owl:NamedIndividual , :Docente ; :nome "' + d['nome'] + '" .'
    print(str)

alunos = data[2]['alunos']
for a in alunos:
    idade = a['idade']
    str = ':' + a['nrAluno'] + ' rdf:type owl:NamedIndividual , :Aluno ; :nome "' + a['nome'] + f'" ; :idade "{idade}" ; :frequenta'
    for uc in a['ucs']:
        str += f' :{uc}'
    str += ' .'
    print(str)
