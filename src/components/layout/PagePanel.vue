<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="page-panel">
    <h2 class="panel-title">{{ title }}</h2>
    <div class="panel-body">
      <slot>
        <div class="placeholder">页面建设中</div>
      </slot>
    </div>
  </section>
</template>

<style scoped>
.page-panel {
  width: 100%;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.6);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

.panel-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: #191C1E;
  margin: 0;
}

.panel-body {
  flex: 1;
  min-height: 0;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;
  color: #999;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
}
</style>
