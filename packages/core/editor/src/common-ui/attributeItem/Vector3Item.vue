<script lang="ts" setup>
import {ElFormItem, ElInputNumber, formContextKey, type InputNumberProps} from "element-plus";
import {inject} from "vue";
import {useAttributeInject} from "../../hooks";

interface Props {
  name: string;
  label: string;
  formProps?: Partial<InputNumberProps>;
}

const formContext = inject(formContextKey, undefined)
const props = defineProps<Props>();
const {name, label} = props

const {objectAttributeChangeSubject,} = useAttributeInject(props)
const change = (value: number | undefined, key: string) => {
  objectAttributeChangeSubject.next({
    name: [name, key],
    value: value
  });
}
</script>

<template>
  <el-form-item :label="label" size="small">
    <div class="flex  gap-1.5">
      <div>
        x:
      </div>
      <el-input-number
          v-model="formContext!.model![name]['x']"
          controls-position="right"
          size="small"
          @change="(value)=>change(value,'x')"
          v-bind="props.formProps"
      />
    </div>
    <div class="flex  gap-1.5 mt-1">
      <div>
        y:
      </div>
      <el-input-number
          v-model="formContext!.model![name]['y']"
          controls-position="right"
          size="small"
          @change="(value)=>change(value,'y')"
          v-bind="props.formProps"
      />
    </div>
    <div class="flex  gap-1.5 mt-1">
      <div>
          z:
      </div>
      <el-input-number
          v-model="formContext!.model![name]['z']"
          controls-position="right"
          size="small"
          @change="(value)=>change(value,'z')"
          v-bind="props.formProps"
      />
    </div>
  </el-form-item>
</template>

<style scoped>

</style>