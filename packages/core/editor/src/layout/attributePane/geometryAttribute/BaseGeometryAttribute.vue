<script setup lang="ts">
import {ElButton, ElFormItem,ElRow,ElCol} from "element-plus";
import {inject, ref, type ShallowRef, watch} from "vue";
import {useBus} from "../../../hooks";
import UserDataItem from "../../../common-ui/attributeItem/UserDataItem.vue";
import {isBufferGeometry} from "three-is";
import {BufferGeometry} from "three";

interface IList {
  label: string
  count: number,
  itemSize: number,
}

const updateTrigger = inject<ShallowRef<boolean>>("updateTrigger")!;

const isBufferShow = ref(false);

watch(updateTrigger, () => {
  if (!bus.selectGeometry) return;
  getGeometry(bus.selectGeometry);
  isBufferShow.value = isBufferGeometry(bus.selectGeometry)
})

const bus = useBus();
const list = ref<IList[]>([])
const attributesObject = {
  "position": "位置",
  "normal": "法线",
  "uv": "uv",
  "skinIndex": "骨骼索引",
  "skinWeight": "骨骼权重",
}

const getGeometry = (geometry: BufferGeometry) => {
  list.value = []
  if (geometry.index !== null) {
    list.value.push({
      label: '索引',
      count: geometry.index.count,
      itemSize: 0,
    })
  }
  const attributes = geometry.attributes;
  for (const name in attributes) {
    const attribute = attributes[name];
    let {count, itemSize} = attribute
    list.value.push({
      label: Reflect.get(attributesObject, name),
      count: count,
      itemSize: itemSize,
    })
  }
  console.log(list)
}
const computeVertexNormals = () => {
  const geometry = bus.selectGeometry;
  if (geometry) {
    geometry.computeVertexNormals();
  }
}
const computeVertexTangents = () => {
  // if (geometry) {
  //   geometry.computeVertexTangents();
  // }
}
const showVertexNormals = () => {
  const editor = bus.editor;
  const selectObject = bus.selectObject;
  if (editor && selectObject) {
    editor?.showNormals(selectObject);
  }
}

</script>

<template>
  <user-data-item/>
  <el-form-item label="属性" size="small">
    <div class="flex flex-col gap-1 w-full">
      <el-row v-for="item in list" :key="item.label">
        <el-col :span="12">
          {{ item.label }}
        </el-col>
        <el-col :span="12">
          {{ item.count }} {{ item.itemSize !== 0 ? `(${item.itemSize})` : "" }}
        </el-col>
      </el-row>
    </div>
  </el-form-item>
  <el-form-item label="操作" size="small">
    <div class="flex flex-col gap-1">
      <div v-if="isBufferShow">
        <el-button @click="computeVertexNormals">
          计算顶点法线
        </el-button>
      </div>
      <div v-if="isBufferShow">
        <el-button @click="computeVertexTangents">
          计算切线
        </el-button>
      </div>
      <div >
        <el-button @click="showVertexNormals">
          显示顶点法线
        </el-button>
      </div>
    </div>
  </el-form-item>
</template>

<style scoped>

</style>