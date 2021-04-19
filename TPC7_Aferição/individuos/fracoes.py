fracoes = '''Loja,A,50,6.06
1º Dto,F,24,36.45
1º Esq,G,34,51.63
2º Dto,H,24,36.45
3º Dto,I,24,36.45
3º Esq,J,34,51.63
4º Dto,L,24,36.45
5º Dto,M,24,36.45
5º Esq,N,34,51.63
6º Dto,O,24,36.45
7º Dto,P,24,36.45
7º Esq,Q,34,51.63
8º Dto,R,24,36.45'''

fracao = fracoes.split('\n')

for f in fracao:
    info = f.split(',')
    print(':Frac' + info[0].replace(" ", "").replace("º", "") + ''' rdf:type owl:NamedIndividual ,
                        :Fracao ;
                :descricao "''' + info[1] + '''" ;
                :permilagem "''' + info[2] + '''" ;
                :mensalidade "''' + info[3] + '''" .''')