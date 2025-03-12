<script lang="ts" setup>
import {ElForm} from "element-plus";
import {BoolItem, ColorItem, InputItem, InputNumberItem, SelectItem, TextItem, Vector2Item} from "../../../common-ui";
import TextureItem from "../../../common-ui/attributeItem/TextureItem.vue";
import {blendingOptions, sideOptions} from "./selectOptions.ts";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import {useMaterialAttributeProvide} from "../../../hooks/useMaterialAttributeProvide.ts";
import UserDataItem from "../../../common-ui/attributeItem/UserDataItem.vue";

const {objectAttributeChangeSubject, toggle, updateTrigger} = useMaterialAttributeProvide({
  isAutoUpdate: false,
})
const {} = useBindSubscribe({
  fun: toggle,
  isMounted: true,
  isBindCallFun: true,
})

</script>

<template>
  <el-form :label-width="80" label-position="left" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <color-item label="颜色" name="color"/>
    <color-item label="自发光" name="emissive"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2  }" label="自发光强度" name="emissiveIntensity"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="反射率" name="reflectivity"/>
    <input-number-item label="IOR" name="ior"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="粗糙度" name="roughness"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="金属度" name="metalness"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="清漆" name="clearcoat"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="清漆粗糙度" name="clearcoatRoughness"/>
    <input-number-item :formProps="{max:10,min:0,step:0.01,precision:2 }" label="色散" name="dispersion"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="彩虹色" name="iridescence"/>
    <input-number-item :formProps="{max:5,min:0,step:0.01,precision:2 }" label="彩虹色折射率" name="iridescenceIOR"/>
    <vector2-item :formProps="{max:5,min:0,step:1}" label="彩虹色厚度" name="iridescenceThicknessRange"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="光泽" name="sheen"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="光泽粗超度" name="sheenRoughness"/>
    <color-item label="光泽颜色" name="sheenColor"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="透光" name="transmission"/>
    <input-number-item label="衰减距离" name="attenuationDistance"/>
    <color-item label="衰减色" name="attenuationColor"/>

    <input-number-item :formProps="{step:0.01,precision:2 }" label="厚度" name="thickness"/>
    <bool-item label="顶点颜色" name="vertexColors"/>

    <texture-item label="贴图" name="map"/>
    <texture-item label="自发光贴图" name="emissiveMap"/>
    <texture-item label="透明贴图" name="alphaMap"/>

    <texture-item label="凹凸贴图" name="bumpMap"/>
    <input-number-item label="凹凸缩放" name="bumpScale"/>

    <texture-item label="法线贴图" name="bumpMap"/>
    <vector2-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="法线缩放" name="normalScale"/>

    <texture-item label="清漆贴图" name="clearcoatMap"/>
    <texture-item label="清漆法线贴图" name="clearcoatNormalMap"/>
    <vector2-item label="清漆法线贴图缩放" name="clearcoatNormalScale"/>
    <texture-item label="清漆粗超度贴图" name="clearcoatRoughnessMap"/>

    <texture-item label="置换贴图" name="displacementMap"/>
    <input-number-item label="置换缩放" name="displacementScale"/>

    <texture-item label="粗糙贴图" name="roughnessMap"/>
    <texture-item label="金属贴图" name="metalnessMap"/>

    <texture-item label="彩虹色贴图" name="iridescenceMap"/>
    <texture-item label="光泽颜色贴图" name="sheenColorMap"/>
    <texture-item label="光泽粗超度贴图" name="sheenRoughnessMap"/>

    <texture-item label="彩虹色厚度贴图" name="iridescenceThicknessMap"/>
    <vector2-item :formProps="{step:1}" label="彩虹色厚度贴图缩放" name="iridescenceThicknessRange"/>

    <texture-item label="环境贴图" name="envMap"/>
    <texture-item label="光照贴图" name="lightMap"/>
    <texture-item label="环境光遮蔽贴图" name="aoMap"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="环境光遮蔽贴图强度"
                       name="aoMapIntensity"/>

    <texture-item label="透光贴图" name="transmissionMap"/>
    <texture-item label="厚度贴图" name="thicknessMap"/>

    <select-item :options="sideOptions" label="面" name="side"/>

    <bool-item label="平面着色" name="flatShading"/>

    <select-item :options="blendingOptions" label="混合" name="blending"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="透明度" name="opacity"/>
    <bool-item label="透明性" name="transparent"/>

    <bool-item label="强制单通道" name="forceSinglePass"/>

    <bool-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="α测试" name="alphaTest"/>
    <bool-item label="深度测试" name="depthTest"/>
    <bool-item label="深度缓冲" name="depthWrite"/>

    <bool-item label="线框" name="wireframe"/>
    <user-data-item/>
  </el-form>

</template>

<style scoped>
:deep(.el-form-item--small .el-form-item__label) {
  height: max-content;
}
</style>