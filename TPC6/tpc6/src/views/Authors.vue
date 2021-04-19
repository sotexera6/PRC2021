<template>
  <div class="w3-container">
    <h3 class="w3-header w3-blue">Autores</h3>
    <table class="w3-table-all">
        <tr>
            <th>ID</th><th>Nome</th><th>Nr Publicações</th>
        </tr>
        <tr v-for="(d, i) in dados" :key="i">
            <td>{{d.id}}</td><td>{{d.name}}</td><td @click="goPubs(d.id)">{{d.pubs}}</td>
        </tr>
    </table>
  </div> 
</template>
<script>
import axios from 'axios';

  export default {
    name: 'Authors',

    data() {
      return {
            dados: null
        };
    },

    created: function() {
      axios
        .get('http://localhost:8080/site/authors')
        .then(res => this.dados = res.data)
        .catch(e => this.error = 'error' + e)
    },

    methods: {
        goPubs: function(id){
            this.$router.push('/pubs/author/' + id);
        }
    }
  }
</script>
<style>
  h3 {
    margin-bottom: 5%;
  }
</style>