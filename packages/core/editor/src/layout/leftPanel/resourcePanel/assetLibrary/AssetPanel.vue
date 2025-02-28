<script lang="ts" setup>

import {EFolder, type IFileInfo} from "../../../../interface";
import {ref} from "vue";
import {useBus} from "../../../../hooks";
import type {ListObjectResult} from "ali-oss";

interface Props {
  baseName: string;
  activeKey: string;
}

const props = defineProps<Props>();
const {baseName, activeKey} = props;

// oss 数据整理
function getInfo(basePath: string, res: ListObjectResult) {
  let mergedArray: IFileInfo[] = []
  res.prefixes?.forEach(prefix => {
    mergedArray.push({
      name: prefix.replace(basePath, ''), type: EFolder.FOLDER, rawName: prefix,
      parent: basePath,
    });
  });
  res.objects
      .filter(object => !object.name.endsWith('/')) // 只保留文件
      .forEach(object => {
        mergedArray.push({
          ...object, name: object.name.replace(basePath, ''),
          type: EFolder.FILE,
          parent: "",
          rawName: object.name
        });
      });
  return mergedArray;
}


const bus = useBus();
const dirList = ref<IFileInfo[]>([]);

const folders = ref<IFileInfo[]>([]);
const fileInfo = ref<IFileInfo>({
  rawName: baseName
} as IFileInfo);
const dragstart = (e, item) => {
  e.dataTransfer!.setData("data", JSON.stringify({...item, type: "model"}))
}
const handleDir = (item: IFileInfo) => {
  fileInfo.value = item;

  dirList.value = [...dirList.value, item];
  getFolder(item)
}
const getFolder = (info: IFileInfo = fileInfo.value) => {
  console.log("请求1111111111111")
  const viewer = bus.viewer;
  if (!viewer) return
  const oss = viewer!.ossApi!;
  const {rawName} = info;
  console.log("请求 path", rawName);
  oss.list(rawName, "/").then((res) => {
    const info = getInfo(rawName, res)
    console.log(res)
    console.log(info)
    folders.value = info
  })
}
</script>

<template>
  <div class="w-full h-full p-[10px]">
    <div class="flex gap-2 flex-wrap">
      <div v-for="(item,index) in folders" :key="index" class="w-[80px] h-[80px] text-center">
        <div v-if="item.type===EFolder.FOLDER" class="folder-icon text-[2em] mt-[10px]" @click="handleDir(item)">
          <!--          <div class="folder-icon text-[2em] mt-[10px]">-->
          <!--            <FolderFilled/>-->
          <!--          </div>-->
          <div class="mt-[5px] text-[1em] truncate overflow-hidden whitespace-nowrap">{{ item.name }}</div>
        </div>

        <template v-else>
          <div class="w-[80px] h-[80px] text-center cursor-pointer" draggable="true"
               @dragstart="(e)=>dragstart(e,item)">
            <div class="folder-icon text-[2em] mt-[10px]">
              <!--              <FileFilled/>-->
            </div>
            <div class="mt-[5px] text-[1em] truncate overflow-hidden whitespace-nowrap">{item.name}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>