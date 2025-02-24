<script setup lang="ts">
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'
import type {Subject} from "rxjs";
import Objectkey from "./Objectkey.ts";

interface Props {
  object: any;
  change?: Subject<any>;
}
const {object, change} = defineProps<Props>();
provide(Objectkey, object) // 若提供的是非字符串值会导致错误

</script>

<template>
  <slot></slot>
</template>

<style scoped>

</style>