<script lang="ts" setup>
import {computed} from "vue";
import {EAppType, type IApplication} from "../../interface";
import dayjs from "dayjs";
import {Document, Folder} from "@element-plus/icons-vue";
import {ElIcon, ElTooltip} from "element-plus";
import Icon from "../Icon.vue";
import {ApplicationApi} from "../../api";
import {Dropdown as TDropdown, type DropdownProps} from 'tdesign-vue-next';

interface Props {
  item: IApplication;
}

const {item} = defineProps<Props>()
const {name, appType, createTime} = item;
const emit = defineEmits<{
  handleDir: [value: IApplication],
  handleEdit: [value: IApplication],
  reset: []
}>()
const isDir = computed(() => {
  return appType === EAppType.DIR;
});

const skip = () => {
  if (isDir.value) {
    emit("handleDir", item)
  } else {

    const url = `${window.location.origin}/#/editor/${item.id}`
    window.open(url, '_blank');
  }
}
const formatTime = (time: Date) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}
const clickHandler: DropdownProps['onClick'] = async (data) => {

  const res = await ApplicationApi.remove(item.id);
  if (res.code === 1) {
    emit("reset",)
  }
}
const preview = () => {
  const url = `${window.location.origin}/#/preview/${item.id}`
  window.open(url, '_blank');
}
const options: DropdownProps['options'] = [
  {
    content: '删除',
    value: 1,
  },]

const edit = () => {
  emit("handleEdit", item)
}
</script>

<template>
  <div class="rounded-xl border shadow space-y-2 overflow-hidden h-[200px]">
    <div class="h-[60%] border-b cursor-pointer" @click="skip">
      <div v-if="isDir" class="flex justify-center items-center h-full">
        <el-icon>
          <Folder/>
        </el-icon>
      </div>
      <img v-else-if="item.thumbnailBase64" :src="item.thumbnailBase64" alt="图片"
           class="w-full h-full object-cover cursor-pointer"
      />
      <div v-else class="flex justify-center items-center h-full">
        <el-icon>
          <Document/>
        </el-icon>
      </div>
    </div>
    <div class="h-[40%] p-2">
      <div class="">
        {{ name }}
      </div>
      <div class="flex justify-between items-center mb-4">
        <div class="text-xs">
          {{ formatTime(createTime) }}
        </div>
        <div class="space-x-1">
          <el-tooltip
              effect="dark"
              content="编辑"
              placement="bottom"
          >
            <div class="inline-block" @click="edit">
              <icon icon-name="icon-bianji"/>
            </div>
          </el-tooltip>
          <el-tooltip
              effect="dark"
              content="预览"
              placement="bottom"
          >
            <div class="inline-block">
              <icon icon-name="icon-yulan" @click="preview"/>
            </div>
          </el-tooltip>

          <t-dropdown :max-column-width="120" :options="options" @click="clickHandler">
            <div class="inline-block">
              <icon icon-name="icon-ellipsis-outlined"/>
            </div>
          </t-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>