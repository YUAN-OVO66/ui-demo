<script setup lang="ts">
import TopNav from '@/components/layout/TopNav.vue'
import SideBar from '@/components/layout/SideBar.vue'
</script>

<template>
  <el-container class="app-container">
    <el-header class="header-row">
      <div class="header-left">
        <img src="@/assets/layout/logo-01.png" alt="logo" class="logo" />
      </div>
      <div class="header-right">
        <h1 class="title">教学巡视督导系统</h1>
        <TopNav />
      </div>
    </el-header>
    <el-container class="main-layout">
      <SideBar />
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/layout/bg-01.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

body {
  overflow: auto;
}

#app {
  min-width: 1280px;
  min-height: 720px;
  width: 100%;
  height: 100%;
}

.app-container {
  width: 100%;
  height: 100%;
  min-width: 1280px;
  min-height: 720px;
  flex-direction: column;
  background: transparent;
}

.header-row {
  display: flex;
  padding: 0;
  background: transparent;
}

.header-left {
  width: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 153px;
  height: 48px;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
}

.title {
  width: 160px;
  height: 24px;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  color: #022170;
  margin: 0;
}

.main-layout {
  flex: 1;
  overflow: hidden;
}

.main-content {
  padding: 0;
  overflow: auto;
  background: transparent;
  height: 100%;
  min-width: 0;
}

@media screen and (max-width: 1680px) {
  html {
    font-size: 14px;
  }
}

@media screen and (max-width: 1440px) {
  html {
    font-size: 12px;
  }
}

@media screen and (max-width: 1280px) {
  html {
    font-size: 11px;
  }
}
</style>
