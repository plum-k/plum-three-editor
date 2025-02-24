<script setup lang="ts">
import {computed} from "vue";
import {EAppType, type IApplication} from "../../interface";
import dayjs from "dayjs";
import {Document, Folder} from "@element-plus/icons-vue";
import {ElIcon} from "element-plus";

interface Props {
  item: IApplication;
  // handleDir: (item: IApplication) => void;
  // handleEdit: (item: IApplication) => void;
  // reset: () => void;
}

const {item} = defineProps<Props>()
const {name, appType, createTime} = item;
const emit = defineEmits<{
  handleDir: [value: IApplication]
}>()
const isDir = computed(() => {
  return appType === EAppType.DIR;
});

const skip = () => {
  if (isDir.value) {
    emit("handleDir", item)
  } else {
    debugger
    const url = `${window.location.origin}/#/editor/${item.id}`
    window.open(url, '_blank');
  }
}
const formatTime = (time: Date) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}

</script>

<template>
  <div class="rounded-xl border shadow space-y-2 overflow-hidden h-[200px]">
    <div class="h-[60%] border-b cursor-pointer" @cick="skip">
      <div v-if="isDir" class="flex justify-center items-center h-full">
        <el-icon>
          <Folder/>
        </el-icon>
      </div>
      <img v-else-if="item.thumbnailBase64" @click="skip" class="w-full h-full object-cover cursor-pointer"
           :src="item.thumbnailBase64"
           alt="图片"/>
      <div  v-else class="flex justify-center items-center h-full">
        <el-icon >
          <Document/>
        </el-icon>
      </div>
    </div>
    <div class="h-[40%] p-2">
      <div class="">
        {{ name }}
      </div>
      <div class="flex justify-between items-center mb-4">
        <div class="text-xs">
          {{formatTime(createTime)}}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>