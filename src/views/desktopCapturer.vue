<template>
  <div class="desktopCapturer">
    <el-button type="primary" @click="getVideoStream">捕获摄像头视频流</el-button>
    <el-button type="primary" @click="getScreenStream">捕获桌面视频流</el-button>
    <div style="margin-top: 20px">
      <video id="screen-video"></video>
    </div>
  </div>
</template>

<script>
import { desktopCapturer } from  '@electron/remote'
export default {
  name: 'desktopCapturer',
  data() {
    return {}
  },
  methods: {
    // 捕获摄像头的视频流
    async getVideoStream() {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          this.play(stream)
        })
        .catch(error => {
          console.error('Error accessing media devices:', error)
        })
    },
    // 捕获屏幕视频流
    async getScreenStream() {
      // 可用媒体源的数组
      const sources = await desktopCapturer.getSources({ types: ['screen'] })

      // 捕获特定的媒体源视频流
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[0].id,
              maxWidth: window.screen.width,
              maxHeight: window.screen.height
            }
          }
        })
        .then(stream => {
          this.play(stream)
        })
        .catch(error => {
          console.error('Error accessing media devices:', error)
        })
    },
    play(stream) {
      let video = document.getElementById('screen-video')
      video.srcObject = stream
      video.onloadedmetadata = function () {
        video.play()
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
