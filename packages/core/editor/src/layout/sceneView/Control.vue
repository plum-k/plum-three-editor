<script lang="ts" setup>
import {ElSegmented} from 'element-plus'
import {ref} from 'vue'
import {useBus} from "../../hooks";
import Icon from "../../components/Icon.vue";

const value = ref('translate')
const options = [
  {
    value: "translate",
    icon: "icon-move",
  },
  {
    value: "rotate",
    icon: "icon-xuanzhuan",
  },
  {
    value: "scale",
    icon: 'icon-suofang',
  },
]
const bus = useBus();

const change = (val: string) => {

  const viewer = bus.viewer;
  if (viewer) {
    viewer.editor.transformControlsWarp.transformControls.setMode(val);
  }
}

</script>

<template>
  <div class="absolute top-[50px] left-[10px] z-999">
    <el-segmented v-model="value" :options="options" direction="vertical" size="small" @change="change">
      <template #default="scope">
        <icon :icon-name="scope.item.icon"/>
      </template>
    </el-segmented>
  </div>
</template>

<style scoped>

</style>