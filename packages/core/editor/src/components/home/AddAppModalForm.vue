<script setup lang="ts">
import {defineModel, reactive} from "vue";
import {ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElSegmented} from "element-plus";
import {ApplicationApi} from "../../api";
import type {IApplication} from "../../interface";

const dialogFormVisible = defineModel('visible', {
  default: false,
})
const appInfo = defineModel<IApplication | null>('appInfo', {
  default: null
})
const options = [{
  label: '应用',
  value: 'THREE',
}, {
  label: '目录',
  value: 'DIR',
}]

const form = reactive({
  name: '',
  appType: "THREE"
})

const onFinish = async () => {
  const res = await ApplicationApi.create({...form, parentId: appInfo.value?.id} as Partial<IApplication>);
  if (res.code === 1) {
    dialogFormVisible.value = false;
  }
}
</script>

<template>
  <el-dialog v-model="dialogFormVisible" title="新建" width="350">
    <el-form >
      <el-form-item label="名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="类型">
        <el-segmented v-model="form.appType" :options="options"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onFinish">
          新建
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>