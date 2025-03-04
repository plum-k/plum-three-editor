<script lang="ts" setup>
import {Button as TButton, Dropdown as TDropdown, type DropdownProps, MessagePlugin} from 'tdesign-vue-next';

const options: DropdownProps['options'] = [
  {
    content: '撤销',
    value: 1,
  },
  {
    content: '回退',
    value: 1,
  },
  {
    content: '删除',
    value: 1,
  },
]

const clickHandler: DropdownProps['onClick'] = (data) => {
  console.log(data)
  MessagePlugin.success(`选中【${data.content}】`);

};

</script>

<template>
  <t-dropdown :max-column-width="120" :options="options" @click="clickHandler">
    <t-button variant="text">
      编辑
    </t-button>
  </t-dropdown>
</template>

<style scoped>

</style>