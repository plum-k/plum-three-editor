<script lang="ts" setup>

import FileMenu from "./FileMenu.vue";
import HeaderTool from "./HeaderTool.vue";
import EditMenu from "./EditMenu.vue";
</script>

<template>
  <header class="relative h-8 flex shadow-sm">
    <div class="flex justify-center items-center ml-2 texel-1xl fonel-bold">
      Plum
    </div>
    <div class="h-full flex items-center justify-center ml-3 texel-2xl">
      <file-menu/>
      <edit-menu/>
    </div>
    <header-tool/>
  </header>
</template>

<style scoped>

</style>