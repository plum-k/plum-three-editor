<script lang="ts" setup>
import {ColorItem, InputItem, InputNumberItem, SelectItem, TextItem, Vector2Item, Vector3Item} from "../../common-ui";
import {ElForm} from "element-plus";
import {useAttributeProvide, useBus} from "../../hooks";
import {reactive} from "vue";

const overrideMaterialList = [
  {value: "无", label: '无'},
  {value: "法线", label: '法线'},
  {value: "描边", label: '描边'},
]
const backgroundTypeList = [
  {value: "无", label: '无'},
  {value: "颜色", label: '颜色'},
  {value: "贴图", label: '贴图'},
]

const envTypeList = [
  {value: "无", label: '无'},
  {value: "贴图", label: '贴图'},
  {value: "同步背景", label: '同步背景'},
]

const fogList = [
  {value: "无", label: '无'},
  {value: "雾", label: '雾'},
  {value: "指数雾", label: '指数雾'},
]
const bus = useBus();

// ui -> three
const {objectAttributeChangeSubject} = useAttributeProvide()
objectAttributeChangeSubject.subscribe((editValue) => {
  const {name, value} = editValue;
})

const form = reactive({
  overrideMaterial: '',
  uuid: '',
  name: ''
})

</script>

<template>
  <el-form :model="form" label-position="left" :label-width="80" size="small">
    <select-item label="覆盖材质" name="overrideMaterial" :options="overrideMaterialList"/>
    <select-item label="背景类型" name="overrideMaterial" :options="backgroundTypeList"/>
    <input-number-item label="背景模糊" name="backgroundBlurriness" :formProps="{max:1,min:0,step:0.01,precision:2  }"/>
    <input-number-item label="背景强度" name="backgroundIntensity" :formProps="{max:1,min:0,step:0.01,precision:2  }"/>
    <vector3-item label="背景旋转" name="backgroundRotation" :formProps="{max:1,min:0,step:0.01,precision:2 }"/>

    <select-item label="环境类型" name="environmentType" :options="envTypeList"/>

    <input-number-item label="环境强度" name="backgroundBlurriness" :formProps="{max:1,min:0,step:0.01,precision:2  }"/>
    <vector3-item label="环境旋转" name="environmentRotation" :formProps="{max:1,min:0,step:0.01,precision:2 }"/>

    <select-item label="雾" name="overrideMaterial" :options="fogList"/>

    <color-item label="衰减色" name="attenuationColor"/>
    <input-number-item label="最小距离" name="color" :formProps="{max:1,min:0,step:0.01,precision:2  }"/>
    <input-number-item label="最大距离" name="far" :formProps="{max:1,min:0,step:0.01,precision:2  }"/>
    <input-number-item label="雾密度" name="density" :formProps="{max:1,min:0,step:0.01,precision:2  }"/>


  </el-form>


</template>

<style scoped>

</style>