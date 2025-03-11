<script lang="ts" setup>
import {ElFormItem, ElInputNumber, formContextKey, type InputNumberProps} from "element-plus";
import {inject} from "vue";
import {useAttributeInject} from "../../hooks";
import InputNumberItem from "./InputNumberItem.vue";

interface Props {
  name: string;
  label: string;
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