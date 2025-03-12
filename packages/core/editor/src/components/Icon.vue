<script lang="ts" setup>

interface IConProps {
  iconName: string;
}

const props = defineProps<IConProps>();
const {iconName} = props;
const emit = defineEmits<{
  click: []
}>()

const click = () => {
  emit("click")
}

</script>

<template>
  <svg aria-hidden="true" class="icon cursor-pointer" @click="click">
    <use :xlink:href="`#${iconName}`"/>
  </svg>
</template>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
svg:focus {
  outline: none!important;
}
</style>