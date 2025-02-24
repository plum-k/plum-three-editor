<script setup lang="ts">

import FileMenu from "./FileMenu.vue";
import EditMenu from "./EditMenu.vue";
import HeaderTool from "./HeaderTool.vue";
</script>

<template>
  <header class="relative  h-8 flex border-b shadow-sm">
    <div class="flex justify-center items-center ml-2 text-1xl font-bold">
      Plum
    </div>
    <div class="h-full flex items-center justify-center ml-3 text-2xl">
      <FileMenu/>
      <EditMenu/>
    </div>
    <HeaderTool/>
  </header>
</template>

<style scoped>

</style>