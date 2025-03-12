import * as THREE from "three";

export const blendingOptions = [
    {value: 0, label: '无'},
    {value: 1, label: '正常'},
    {value: 2, label: '加法'},
    {value: 3, label: '减法'},
    {value: 4, label: '乘法'},
    {value: 5, label: '自定义'}
];

export const sideOptions = [{value: 0, label: '正面'}, {value: 1, label: '背面'}, {
    value: 2,
    label: '双面'
}]


export const materialDepthPackingOptions = [
    {value: THREE.BasicDepthPacking, label: 'Basic'}, {value: THREE.RGBADepthPacking, label: 'RGBA'},
]