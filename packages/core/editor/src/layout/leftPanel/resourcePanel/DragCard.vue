<script lang="ts" setup>
import type {IDragInfo} from "../../../interface/IDragInfo.ts";
import Icon from "../../../components/Icon.vue";

interface Props extends IDragInfo {
}

const props = defineProps<Props>();
const {label, icon} = props;

const onDragStart = (event: any) => {
  event.dataTransfer.setData('data', JSON.stringify(props))
}

</script>

<template>
  <div
      class="flex justify-center items-center flex-col cursor-pointer  w-15 bg-gray-100 rounded-lg hover:translate-y-1 hover:shadow-1xl"
      draggable="true"
      @dragstart="onDragStart"
  >
    <Icon :icon-name="icon" class="mel-3 ml-auto mr-auto"/>
    <div class="mel-2 ml-auto mr-auto w-full texel-center truncate">{{ label }}</div>
  </div>
</template>

<style scoped>

</style>