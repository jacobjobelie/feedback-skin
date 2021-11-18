<script lang="ts">
import { ref, defineComponent, onMounted, SetupContext } from 'vue'
import { selectedVideoRes } from '../3d/constants'
import { FBWScene } from '../3d/fullscreen-ortho-scene'
// import { run } from '../webrtc/simple-peer'
// import { run } from '../webrtc/socketpeer'
import SocketPeer from '../webrtc/socket-peer'

export default defineComponent({
  name: 'HelloWorld',
  setup(props, context: SetupContext) {
    // const el = ref<HTMLCanvasElement>()
    const sceneCanvasEl = ref<HTMLCanvasElement>()
    const webcamVidEl = ref<HTMLVideoElement>()
    const peerVidEl = ref<HTMLVideoElement>()
    onMounted(async () => {
      // const ctx = el.value!.getContext('2d')!
      // setInterval(() => {
      //   ctx.fillStyle = `rgba(
      //       ${Math.random() * 255},
      //       ${Math.random() * 255},
      //       ${Math.random() * 255},
      //       100)`
      //   ctx.fillRect(0, 0, 100, 100)
      // }, 2000)
      const webcamStream = await navigator.mediaDevices
        .getUserMedia({
          video: { width: 640, height: 480 },
          audio: true,
        })
        .catch((e) => {
          console.log(e)
        })

      const outgoingStream = new MediaStream()
      if (webcamStream) {
        const myStream = new MediaStream()
        myStream.addTrack(webcamStream!.getVideoTracks()[0])
        if ('srcObject' in webcamVidEl.value!) {
          webcamVidEl.value!.srcObject = myStream
        }
        webcamVidEl.value!.play()
        const { canvas } = FBWScene({
          sceneCanvasEl: sceneCanvasEl.value!,
          webcamVidEl: webcamVidEl.value!,
          peerVidEl: peerVidEl.value!,
        })
        const mySceneStream = canvas.captureStream(25)
        outgoingStream.addTrack(mySceneStream.getVideoTracks()[0])
        outgoingStream.addTrack(webcamStream.getAudioTracks()[0])
      } else {
        // var stream = el.value!.captureStream(25)
        // dStream.addTrack(stream.getVideoTracks()[0])
      }

      var peer = new SocketPeer({
        pairCode: 'yolo',
        stream: outgoingStream,
        url: 'http://localhost:3003/socketpeer/',
      })

      peer.on('connect', function (c) {
        console.log(c)
        console.log('peer connected')
      })

      peer.on('connect_timeout', function () {
        console.error('connection timed out (after %s ms)', peer.timeout)
      })

      peer.on('data', function (data) {
        console.log('data received:', new TextDecoder().decode(data))
      })

      peer.on('rtc.signal', function () {
        console.log('WebRTC signalling')
      })

      peer.on('peer.found', function (data) {
        console.log(data)
        console.log('peer found:', data.initiator)
        // peer.send('hello')
      })

      peer.on('stream', function (s) {
        console.log('Got stream')
        console.log(s)
        if ('srcObject' in peerVidEl.value!) {
          peerVidEl.value!.srcObject = s
        }
      })
      peer.on('upgrade', function () {
        console.log(
          'successfully upgraded WebSocket ⇒ to WebRTC peer connection',
        )
        peer.send('upgraded')
        peer.peer.send(new TextEncoder().encode('try this'))
      })

      peer.on('upgrade_attempt', function () {
        console.log(
          'attempting to upgrade WebSocket ⇒ to WebRTC peer connection (attempt number: %d)',
          peer._connections.rtc.attempt,
        )
      })

      peer.on('downgrade', function () {
        console.log(
          'downgraded WebRTC peer connection ⇒ to WebSocket connection',
        )
      })

      peer.on('warning', function (data) {
        console.error('warning:', data.message)
      })

      peer.on('error', function (err) {
        console.error('error:', err)
      })
    })

    return {
      sceneCanvasEl,
      webcamVidEl,
      peerVidEl,
      selectedVideoRes,
    }
  },
})
</script>

<template>
  <div class="world">
    <video
      :width="selectedVideoRes.w"
      :height="selectedVideoRes.h"
      class="scenevideo"
      playsinline
      muted
      autoplay
      ref="webcamVidEl"
    ></video>
    <div class="scene" ref="sceneCanvasEl">
      <!-- <canvas width="640" height="480" class="scene" ref="sceneCanvasEl"></canvas> -->
    </div>
    <div>
      <h1>you</h1>
      <!-- <canvas width="100" height="100" ref="el"></canvas> -->
    </div>
    <div>
      <h1>friend</h1>
      <video
        :width="selectedVideoRes.w"
        :height="selectedVideoRes.h"
        class="scenevideo"
        playsinline
        autoplay
        ref="peerVidEl"
      ></video>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}

.scene {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  /* width: 640px;
  height: 480px; */
}
.world {
  width: 100%;
  height: 100%;
}

.scenevideo {
  display: none;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
