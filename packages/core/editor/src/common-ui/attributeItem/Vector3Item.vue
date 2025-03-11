<script lang="ts" setup>
import {ElFormItem, type InputNumberProps} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";
import InputNumberItem from "./InputNumberItem.vue";

interface Props extends IAttributeProps {
  formProps?: Partial<InputNumberProps>;
  isRotation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isRotation: false
})
const {name, label, isRotation} = props
const {objectAttributeChangeSubject,} = useAttributeInject(props)
</script>

<template>
  <el-form-item :label="label" size="small">
    <div class="flex  gap-1.5">
      <div>
        x:
      </div>
      <input-number-item :isRotatio="isRotation" :name="[name  ,'x']" label=""/>
      <!--      <el-input-number-->
      <!--          v-model="formContext!.model![name]['x']"-->
      <!--          controls-position="right"-->
      <!--          size="small"-->
      <!--          v-bind="props.formProps"-->
      <!--          @change="(value)=>change(value,'x')"-->
      <!--      />-->
    </div>
    <div class="flex  gap-1.5 mt-1">
      <div>
        y:
      </div>
      <input-number-item :isRotatio="isRotation" :name="[name as string,'y']" label=""/>
      <!--      <el-input-number-->
      <!--          v-model="formContext!.model![name]['y']"-->
      <!--          controls-position="right"-->
      <!--          size="small"-->
      <!--          v-bind="props.formProps"-->
      <!--          @change="(value)=>change(value,'y')"-->
      <!--      />-->
    </div>
    <div class="flex  gap-1.5 mt-1">
      <div>
        z:
      </div>
      <input-number-item :isRotatio="isRotation" :name="[name as string,'z']" label=""/>
      <!--      <el-input-number-->
      <!--          v-model="formContext!.model![name]['z']"-->
      <!--          controls-position="right"-->
      <!--          size="small"-->
      <!--          v-bind="props.formProps"-->
      <!--          @change="(value)=>change(value,'z')"-->
      <!--      />-->
    </div>
  </el-form-item>
</template>

<style scoped>

</style>