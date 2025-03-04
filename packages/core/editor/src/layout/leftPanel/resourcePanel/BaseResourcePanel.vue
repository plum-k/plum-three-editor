<script lang="ts" setup>
import type {IDragInfo} from "../../../interface/IDragInfo.ts";
import {computed} from "vue";
import DragCard from "./DragCard.vue";

const geometryList: IDragInfo[] = [
  {
    type: 'PlaneGeometry',
    label: '平面',
    option: {},
    icon: 'icon-pingmian',
  },
  {
    type: 'BoxGeometry',
    label: '正方体',
    option: {},
    icon: 'icon-componenel-full2',
  },
  {
    type: 'CapsuleGeometry',
    label: '胶囊',
    option: {},
    icon: 'icon-capsule-fill',
  },
  {
    type: 'CircleGeometry',
    label: '圆',
    option: {},
    icon: 'icon-big-circle',
  },
  {
    type: 'CylinderGeometry',
    label: '圆柱体',
    option: {},
    icon: 'icon-icon-yuanzhuti',
  },
  {
    type: 'RingGeometry',
    label: '环',
    option: {},
    icon: 'icon-ditu-huan',
  },
  {
    type: 'SphereGeometry',
    label: '球体',
    option: {},
    icon: 'icon-qiuti',
  },
  {
    type: 'DodecahedronGeometry',
    label: '十二面体',
    option: {},
    icon: 'icon-influxdb',
  },
  {
    type: 'IcosahedronGeometry',
    label: '二十面体',
    option: {},
    icon: 'icon-influxdb',
  },
  {
    type: 'OctahedronGeometry',
    label: '八面体',
    option: {},
    icon: 'icon-influxdb',
  },
  {
    type: 'TetrahedronGeometry',
    label: '四面体',
    option: {},
    icon: 'icon-influxdb',
  },
  {
    type: 'TorusGeometry',
    label: '圆环体',
    option: {},
    icon: 'icon-yuanhuan',
  },
  {
    type: 'TorusKnotGeometry',
    label: '环面纽结体',
    option: {},
    icon: 'icon-influxdb',
  },
  {
    type: 'TubeGeometry',
    label: '管',
    option: {},
    icon: 'icon-influxdb',
  },
  {
    type: 'LatheGeometry',
    label: '酒杯',
    option: {},
    icon: 'icon-jiubei',
  },
  {
    type: 'Sprite',
    label: '精灵',
    option: {},
    icon: 'icon-jinglingqiu',
  },
];
const lightList: IDragInfo[] = [
  {
    type: 'AmbientLight',
    label: '环境光',
    option: {},
    icon: 'icon-huanjingguang',
  },
  {
    type: 'DirectionalLight',
    label: '平行光',
    option: {},
    icon: 'icon-fangxiangguang',
  },
  {
    type: 'HemisphereLight',
    label: '半球光',
    option: {},
    icon: 'icon-banqiuguang',
  },
  {
    type: 'PointLight',
    label: '点光源',
    option: {},
    icon: 'icon-dengpao',
  },
  {
    type: 'SpotLight',
    label: '聚光灯',
    option: {},
    icon: 'icon-a-24_nor',
  },
];

const list = computed(() => {
  return geometryList.concat(lightList)
})


</script>

<template>
  <div class="flex flex-wrap gap-2">
    <drag-card v-for="(item,index) in list" :key="index" v-bind="item">

    </drag-card>
  </div>
</template>

<style scoped>

</style>