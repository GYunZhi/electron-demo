<template>
  <div>
    <el-divider>测试自定义协议 - 加载 js 脚本</el-divider>
    <el-button @click="loadjs">加载 js 脚本</el-button>

    <el-divider>测试自定义协议 - 注册为标准协议，可以解析相对地址的资源,</el-divider>
    <!-- file 协议 -->
    <iframe id="hello" src="embed.html"></iframe>

    <!-- standard: true -> 标准协议，img 正常加载 -->
    <iframe id="hello" src="is-standard:/embed.html"></iframe>

    <!-- standard: false -> 不能解析相对地址的资源，img 不会加载 -->
    <iframe id="hello" src="not-standard:/embed.html"></iframe>
  </div>
</template>

<script setup lang="ts">
// 使用自定义协议加载 js 脚本
function loadjs() {
  var scriptElement = document.createElement('script');
  scriptElement.src = 'myapp://example.com/resource';
  document.body.appendChild(scriptElement);
}
</script>

<style lang="scss" scoped></style>
