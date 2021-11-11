<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",
  components: {},

  setup() {
    return {};
  },
});
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&display=swap");
</style>
