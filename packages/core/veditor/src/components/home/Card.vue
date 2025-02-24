<script setup lang="ts">
import {computed, ref} from "vue";
import {EAppType, type IApplication} from "../../interface";
import dayjs from "dayjs";

interface Props {
  item: IApplication;
  // handleDir: (item: IApplication) => void;
  // handleEdit: (item: IApplication) => void;
  // reset: () => void;
}

const { item } = defineProps<Props>()
const {name, appType, createTime} = item;

const skip = () => {
  if (isDir) {
    handleDir(item)
  } else {
    const url = `${window.location.origin}/#/editor/${item.id}`
    window.open(url, '_blank');
  }
}
const formatTime = (time: Date) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}
const isDir = computed(() => {
  return appType === EAppType.DIR;
});
</script>

<template>
  <div class="rounded-xl border shadow space-y-2 overflow-hidden h-[200px]">
    <div class="h-[60%] border-b cursor-pointer" @cick="skip">
      <div v-if="isDir"   class="flex justify-center items-center h-full">
      </div>
      <div v-else-if="item.thumbnailBase64">
        
        
      </div>
      <img v-else @click={skip} class="w-full h-full object-cover cursor-pointer" :src="item.thumbnailBase64"
           alt="图片"/>
    </div>
    <div class="h-[40%] p-2">
      <div class="">
        {{name}}
      </div>
      <div class="flex justify-between items-center mb-4">
        <div class="text-xs">
          {formatTime(createTime)}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>