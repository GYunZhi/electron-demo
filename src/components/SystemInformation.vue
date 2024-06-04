<template>
  <div>
    <div class="title">Information</div>
    <div class="items">
      <div class="item">
        <div class="name">Path:</div>
        <div class="value">{{ path }}</div>
      </div>
      <div class="item">
        <div class="name">Route Name:</div>
        <div class="value">{{ name }}</div>
      </div>
      <div class="item">
        <div class="name">Vue.js:</div>
        <div class="value">{{ vue }}</div>
      </div>
      <div class="item">
        <div class="name">Electron:</div>
        <div class="value">{{ electron }}</div>
      </div>
      <div class="item">
        <div class="name">ABI:</div>
        <div class="value">{{ ABI }}</div>
      </div>
      <div class="item">
        <div class="name">Node:</div>
        <div class="value">{{ node }}</div>
      </div>
      <div class="item">
        <div class="name">v8:</div>
        <div class="value">{{ v8 }}</div>
      </div>
      <div class="item">
        <div class="name">chrome:</div>
        <div class="value">{{ chrome }}</div>
      </div>
      <div class="item">
        <div class="name">Platform:</div>
        <div class="value">{{ platform }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      path: this.$route.path,
      name: this.$route.name,
      vue: require('vue/package.json').version,
      electron: process.versions.electron, // electron 版本
      ABI: process.versions.modules,  // ABI版本
      node: process.versions.node, // NODE版本
      v8: process.versions.v8, // V8 引擎版本
      chrome: process.versions.chrome, // chrome版本
      platform: require('os').platform(),
    }
  },
  mounted() {
    // 架构信息
    console.log('process.env.PROCESSOR_ARCHITECTURE', process.versions)
  }
}
</script>

<style scoped>
.title {
  color: #888;
  font-size: 18px;
  font-weight: initial;
  letter-spacing: 0.25px;
  margin-top: 10px;
}

.items {
  margin-top: 8px;
}

.item {
  display: flex;
  margin-bottom: 6px;
}

.item .name {
  color: #6a6a6a;
  margin-right: 6px;
}

.item .value {
  color: #35495e;
  font-weight: bold;
}
</style>
