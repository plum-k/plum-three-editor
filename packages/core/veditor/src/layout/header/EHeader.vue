<script lang="ts" setup>

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
      <file-menu/>
      <edit-menu/>
    </div>
    <header-tool/>
  </header>
</template>

<style scoped>

</style>