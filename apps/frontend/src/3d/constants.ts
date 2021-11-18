import { computed, ref } from 'vue'

const selectedVideoSize = ref<'m'>('m')
const V_RES = ref({
  m: {
    w: 640,
    h: 480,
  },
})

export const selectedVideoRes = computed(
  () => V_RES.value[selectedVideoSize.value],
)
