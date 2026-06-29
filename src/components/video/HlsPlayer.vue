<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Hls from 'hls.js'

const props = withDefaults(
  defineProps<{
    src: string
    autoplay?: boolean
    muted?: boolean
  }>(),
  {
    autoplay: true,
    muted: true,
  }
)

const videoRef = ref<HTMLVideoElement | null>(null)
let hls: Hls | null = null

const isHls = (url: string) => /\.m3u8(\?|$)/i.test(url)

const initPlayer = () => {
  if (!videoRef.value || !props.src) return

  if (isHls(props.src)) {
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      hls.loadSource(props.src)
      hls.attachMedia(videoRef.value)

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('[HlsPlayer] Network error', data)
              hls?.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('[HlsPlayer] Media error', data)
              hls?.recoverMediaError()
              break
            default:
              console.error('[HlsPlayer] Fatal error', data)
              destroyPlayer()
              break
          }
        }
      })
    } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.value.src = props.src
    }
  } else {
    videoRef.value.src = props.src
  }
}

const destroyPlayer = () => {
  if (hls) {
    hls.destroy()
    hls = null
  }
}

watch(() => props.src, () => {
  destroyPlayer()
  initPlayer()
})

onMounted(() => {
  initPlayer()
})

onUnmounted(() => {
  destroyPlayer()
})
</script>

<template>
  <video
    ref="videoRef"
    class="hls-player"
    :autoplay="autoplay"
    :muted="muted"
    playsinline
    controls
  />
</template>

<style scoped lang="scss">
.hls-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
}
</style>
