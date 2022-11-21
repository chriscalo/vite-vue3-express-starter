<!------------------------------------------------------------------------------
Main app component.
Author: chris.calo@gmail.com (Chris Calo)
------------------------------------------------------------------------------->
<template>
  <div>
    {{ response?.message ?? "Loading…" }}
  </div>
</template>

<script>
  import { ref } from "vue";
  import api from "@/util/api.js";
  
  export default {
    name: "App",
    setup() {
      const response = ref(null);
      
      (async function () {
        response.value = await api.get();
      })();
      
      return {
        response,
      };
    },
  };
</script>
