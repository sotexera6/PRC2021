<template>
  <ListaPubs mensagem="Teste" get='pubs/author/' :idGet='$route.params.id'/>
</template>

<script>
import ListaPubs from "@/components/ListaPubs.vue";

export default {
  components: {
    ListaPubs
  },

};
</script>
