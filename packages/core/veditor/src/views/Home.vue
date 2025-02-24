<script setup lang="ts">

import {ref} from "vue";
import Card from "../components/home/Card.vue";
import type {IApplication} from "../interface";
import {ApplicationApi} from "../api";

const folders = ref<IApplication[]>([]);
const getFolders = (appInfo: null | IApplication) => {
  ApplicationApi.getAll(appInfo?.id).then(res => {
    if (res.code === 1) {
      folders.value = res.data;
    }
  })
}
</script>

<template>
  <div class="bg-black/80 w-screen h-screen">
    <div
        class="bg-white w-3/5 h-3/5 top-0 left-0 bottom-0 right-0 m-auto fixed  border rounded-[0.5rem] shadow flex flex-col">
      <div class="border-b p-2">

      </div>
      <div class="p-4 overflow-hidden">
        <Card v-for="(item,index) in folders" :key="index" :item="item" class="flex flex-col">

        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>