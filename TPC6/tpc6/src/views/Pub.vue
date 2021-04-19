<template>
  <div class="w3-container">
    <h3 class="w3-header w3-blue">Publicação {{$route.params.id}}</h3>

    <p v-for="(d, i) in Object.entries(dados)" :key="i">
      <b class="w3-left">{{d[0]}}:</b>
      <span class="w3-left">{{d[1]}}</span>
      <br/>
    </p>
  </div> 
</template>
<script>
import axios from 'axios';

  export default {
    name: 'Pub',

    data() {
      return {
            dados: null
        };
    },

    created: function() {
      axios
        .get('http://localhost:8080/site/pubs/' + this.$route.params.id)
        .then(res => {
          this.dados = res.data
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