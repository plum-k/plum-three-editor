<script lang="ts" setup>
import {ElFormItem, type InputNumberProps} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";
import InputNumberItem from "./InputNumberItem.vue";
import {defineModel} from "vue";

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
      <input-number-item  :isRotatio="isRotation" :name="[name,'x']" label=""/>

    </div>
    <div class="flex  gap-1.5 mt-1">
      <div>
        y:
      </div>
      <input-number-item  :isRotatio="isRotation" :name="[name,'y']" label=""/>

    </div>
    <div class="flex  gap-1.5 mt-1">
      <div>
        z:
      </div>
      <input-number-item  :isRotatio="isRotation" :name="[name,'z']" label=""/>

    </div>
  </el-form-item>
</template>

<style scoped>

</style>