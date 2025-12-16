<!-- src/App.vue -->
<script setup lang="ts">
import { onMounted, onErrorCaptured } from 'vue';
import { ElMessage } from 'element-plus';

onErrorCaptured((err: any) => {
  console.error('全局捕获到错误:', err);
  ElMessage.error('发生了一个未知错误，请稍后再试。');
  return false;
});
</script>

<template>
  <router-view />
</template>
