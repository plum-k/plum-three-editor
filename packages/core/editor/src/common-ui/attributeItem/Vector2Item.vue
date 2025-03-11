<script lang="ts" setup>
import {ElFormItem, type InputNumberProps} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";
import InputNumberItem from "./InputNumberItem.vue";

interface Props extends IAttributeProps {
  formProps?: Partial<InputNumberProps>;
}

const props = defineProps<Props>();
const {name, label} = props

const {objectAttributeChangeSubject,} = useAttributeInject(props)
// const change = (value: number | undefined, key: string) => {
//   objectAttributeChangeSubject.next({
//     name: [name, key],
//     value: value
//   });
// }
</script>

<template>
  <el-form-item :label="label" size="small">
    <div class="flex  gap-1.5">
      <div>
        x:
      </div>
      <input-number-item :name="[name,'x']" label=""/>
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
      <input-number-item :name="[name,'y']" label=""/>
      <!--      <el-input-number-->
      <!--          v-model="formContext!.model![name]['y']"-->
      <!--          controls-position="right"-->
      <!--          size="small"-->
      <!--          v-bind="props.formProps"-->
      <!--          @change="(value)=>change(value,'y')"-->
      <!--      />-->
    </div>
  </el-form-item>
</template>

<style scoped>

</style>