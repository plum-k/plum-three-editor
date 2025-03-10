<script lang="ts" setup>
import {ElFormItem, ElInput, formContextKey, type InputProps} from "element-plus";
import {inject, onMounted, ref, toRaw} from "vue";
import {type IAttributeProps, type IObjectAttributeChange, useAttributeInject, useBus} from "../../hooks";
import {get} from "lodash-es";
import {Subject} from "rxjs";

interface Props extends IAttributeProps {
  formProps?: Partial<InputProps>;
}
const bus = useBus();
const formContext = inject(formContextKey, undefined)
const props = defineProps<Props>();
const {name, label} = props;
const {change} = useAttributeInject(props)

const getObject = inject<()=>object>("getObject")!;

const testA = ref(0);
onMounted(() => {
  const object = getObject();
  const raw = toRaw(formContext!.model)
  console.log("raw",raw)
  let value = get(object, name)
  testA.value = value
  console.log("value",value)
  // console.log("testA.value", testA.value)
})


</script>

<template>
  <el-form-item :label="label" size="small">
    <el-input v-model="testA" v-bind="props.formProps" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>