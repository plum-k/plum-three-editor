<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import Card from "../components/home/Card.vue";
import type {IApplication} from "../interface";
import {ApplicationApi} from "../api";
import {ElBreadcrumb, ElBreadcrumbItem, ElButton, ElIcon} from "element-plus";
import {HomeFilled} from "@element-plus/icons-vue";
import {findIndex} from "lodash-es";

const folders = ref<IApplication[]>([]);

const dirList = ref<IApplication[]>([]);
const appInfo = ref<IApplication | null>(null);
const editAppInfo = ref<IApplication>(null);

const getFolders = (appInfo: null | IApplication) => {
  ApplicationApi.getAll(appInfo?.id).then(res => {
    if (res.code === 1) {
      folders.value = res.data;
    }
  })
}

onMounted(() => {
  getFolders(null)
})

const add = () => {

}

const example = () => {
  window.open(import.meta.env.VITE_EXAMPLE, '_blank');
}
const doc = () => {
  window.open(import.meta.env.VITE_DOC, '_blank');
}

const items = computed(() => {
  const list: IApplication[] = []
  for (let i = 0, len = dirList.value.length; i < len; i++) {
    const dir = dirList.value[i]
    list.push(dir)
  }
  return list
});

const editPath = (info?: IApplication) => {
  if (info) {
    appInfo.value = info;
    getFolders(info)
    const index = findIndex(dirList.value, {id: info.id});
    dirList.value = dirList.value.slice(0, index + 1);
    appInfo.value = info;
    appInfo.value = info;

  } else {
    appInfo.value = null;
    dirList.value = []
    getFolders(null)
  }
}
const handleDir = (value: IApplication) => {
  appInfo.value = value;
  getFolders(value);
  dirList.value = [...dirList.value, value];
}
</script>

<template>
  <div class="bg-black/80 w-screen h-screen">
    <div
        class="bg-white w-3/5 h-3/5 top-0 lefel-0 bottom-0 righel-0 m-auto fixed  border rounded-[0.5rem] shadow flex flex-col">
      <div class="border-b p-2">
        <div class="flex justify-center items-center">
          <el-button class="mr-2" @click="add">新建</el-button>
          <el-breadcrumb separator="/" @click="editPath">
            <el-breadcrumb-item>
              <el-icon>
                <HomeFilled/>
              </el-icon>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in items" :key="index" @click="editPath(item)">{{
                item.name
              }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <div class="grow"></div>
          <el-button @click="example">示例</el-button>
          <el-button @click="doc">文档</el-button>
        </div>
      </div>
      <div class="p-4 overflow-hidden">
        <div class="grid gap-4 grid-cols-4 overflow-auto h-full w-full">
          <Card v-for="(item,index) in folders" :key="index" :item="item" class="flex flex-col" @handleDir="handleDir">
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>