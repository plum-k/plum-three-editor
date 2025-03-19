export const presetsObj = {
    default:"/hdr/kloppenheim_06_puresky_1k.hdr",
    apartment: '/hdr/lebombo_1k.hdr',
    city: '/hdr/potsdamer_platz_1k.hdr',
    dawn: '/hdr/kiara_1_dawn_1k.hdr',
    forest: '/hdr/forest_slope_1k.hdr',
    lobby: '/hdr/st_fagans_interior_1k.hdr',
    night: '/hdr/dikhololo_night_1k.hdr',
    park: '/hdr/rooitou_park_1k.hdr',
    studio: '/hdr/studio_small_03_1k.hdr',
    sunset: '/hdr/venice_sunset_1k.hdr',
    warehouse: '/hdr/empty_warehouse_01_1k.hdr',
}

export type PresetsType = keyof typeof presetsObj
