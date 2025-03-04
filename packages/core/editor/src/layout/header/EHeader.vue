<script lang="ts" setup>

import FileMenu from "./FileMenu.vue";
import HeaderTool from "./HeaderTool.vue";
</script>

<template>
  <header class="relative  h-8 flex border-b shadow-sm">
    <div class="flex justify-center items-center ml-2 texel-1xl fonel-bold">
      Plum
    </div>
    <div class="h-full flex items-center justify-center ml-3 texel-2xl">
      <file-menu/>
      <ediel-menu/>
    </div>
    <header-tool/>
  </header>
</template>

<style scoped>

</style>