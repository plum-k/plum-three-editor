<script lang="ts" setup>
import {defineModel, reactive, watch} from "vue";
import {ElButton, ElDialog, ElForm, ElFormItem, ElInput} from "element-plus";
import {ApplicationApi} from "../../api";
import type {IApplication} from "../../interface";

const dialogEditVisible = defineModel('visible', {
  default: false,
})
const editAppInfo = defineModel<IApplication | null>('editAppInfo', {
  default: null
})

watch(editAppInfo, (value) => {
  if (value) {
    form.name = value.name;
  }
})

const form = reactive({
  name: '',
  parentId: null,
})

const onFinish = async () => {
  let data = {
    name: form.name,
    parentId: form.parentId
  }
  const res = await ApplicationApi.edit({...data, id: editAppInfo.value?.id} as Partial<IApplication>);
  if (res.code === 1) {
    dialogFormVisible.value = false;
  }
}
</script>

<template>
  <el-dialog v-model="dialogEditVisible" title="编辑" width="350">
    <el-form>
      <el-form-item label="名称">
        <el-input v-model="form.name"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取消</el-button>
        <el-button type="primary" @click="onFinish">
          新建
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>