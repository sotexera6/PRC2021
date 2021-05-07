mapa = '''1Dto,1,1,1,1,,,,,,,,
2Dto,,,,,,,,,,,,
3Dto,1,1,1,1,1,1,1,1,1,1,1,1
4Dto,1,1,1,1,1,1,1,1,1,1,1,1
5Dto,1,1,1,1,1,1,,,,,,
6Dto,1,1,1,1,1,1,1,1,,,,
7Dto,1,1,1,1,,,,,,,,
8Dto,,,,,,,,,,,,
1Esq,1,1,1,,,,,,,,,
3Esq,1,1,1,,,,,,,,,
5Esq,1,1,1,1,,,,,,,,
7Esq,1,1,1,1,,,,,,,,
Loja,,,,,,,,,,,,'''

pagamentos = mapa.split('\n')

for i, p in enumerate(pagamentos):
    info = p.split(',')
    print(':Pag' + str(i) + ''' rdf:type owl:NamedIndividual ,
               :Pagamento ;
      :pertenceAoMapa :MapaPag ;
      :pagamentosDe :Frac''' + info[0] +' ;')
    if info[1]:
      print(':jan 1 ;')
    if info[2]:
      print(':fev 1 ;')
    if info[3]:
      print(':mar 1 ;')
    if info[4]:
      print(':abr 1 ;')
    if info[5]:
      print(':mai 1 ;')
    if info[6]:
      print(':jun 1 ;')
    if info[7]:
      print(':jul 1 ;')
    if info[8]:
      print(':ago 1 ;')
    if info[9]:
      print(':set 1 ;')
    if info[10]:
      print(':out 1 ;')
    if info[11]:
      print(':nov 1 ;')
    if info[12]:
      print(':dez 1 ;')
    print(' . ')

