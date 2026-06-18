<script setup lang="ts">
import { useRouter } from 'vue-router'
import NotFoundImage from '@/assets/not-found/error-01.png'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <img :src="NotFoundImage" alt="404" class="not-found-img" />
    <p class="not-found-tip">抱歉，您访问的页面不存在</p>
    <el-button type="primary" class="back-btn" @click="router.push('/home')">返回首页</el-button>
  </div>
</template>

<style scoped>
.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 24px;
  box-sizing: border-box;
}

.not-found-img {
  max-width: 480px;
  width: 40%;
  height: auto;
  user-select: none;
}

.not-found-tip {
  font-size: 16px;
  color: #697BA9;
  margin: 0;
}

.back-btn {
  border-radius: 8px;
  padding: 0 24px;
  height: 40px;
}
</style>