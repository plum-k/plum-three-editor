<script lang="ts" setup>
import {ElFormItem} from "element-plus";
import InputNumberItem from "./InputNumberItem.vue";

interface Props {
  /**
   * 属性名
   */
  name: string;
  /**
   * 显示名
   */
  label: string;
  isRotation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isRotation: false
})
const {name, label} = props
</script>

<template>
  <el-form-item :label="label" size="small">
    <div class="flex  gap-1.5">
      <div>
        x:
      </div>
      <input-number-item :isRotation="isRotation" :name="[name,'x']" label=""/>
    </div>
    <div class="flex  gap-1.5 mt-1">
      <div>
        y:
      </div>
      <input-number-item :isRotation="isRotation" :name="[name,'y']" label=""/>
    </div>
  </el-form-item>
</template>

<style scoped>

</style>