<template>
  <div class="w3-container">
    <h3 class="w3-header w3-blue">Publicações{{titulo}}</h3>
    <table class="w3-table-all">
        <tr>
            <th>ID</th><th>Tipo</th><th>Ano</th><th>Título</th>
        </tr>
        <tr v-for="(d, i) in dados" :key="i">
            <td @click="goPub(d.id)">{{d.id}}</td><td>{{d.type}}</td><td>{{d.year}}</td><td>{{d.title}}</td>
        </tr>
    </table>
  </div> 
</template>
<script>
import axios from 'axios';

  export default {
    name: 'ListaPubs',

    props: ["mensagem", "get", "idGet"],

    data() {
      return {
            dados: null,
            titulo: null
        };
    },

    created: function() {
      axios
        .get('http://localhost:8080/site/' + this.get + this.idGet)
        .then(res =>{ 
          this.dados = res.data
          if (this.idGet != ""){ 
            this.titulo = " do autor "
            this.titulo += this.idGet
          }
        })
        .catch(e => this.error = 'error' + e)
    },

    methods: {
        goPub: function(id){
            this.$router.push('/pubs/' + id);
        }
    }
  }
</script>
<style>
  h3 {
    margin-bottom: 5%;
  }
</style>