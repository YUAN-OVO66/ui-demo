<script setup lang="ts">
defineProps<{
  label: string
  count: number | string
  bgStyle?: string
  iconSrc?: string
}>()
</script>

<template>
  <div class="stat-card" :style="bgStyle">
    <div class="stat-info">
      <div class="stat-label">{{ label }}</div>
      <div class="stat-count">{{ count }}</div>
    </div>
    <div v-if="iconSrc" class="stat-icon">
      <img :src="iconSrc" alt="" />
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  transition: transform 0.2s;
  box-sizing: border-box;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-count {
  font-size: 36px;
  font-weight: 600;
  color: #333;
}

.stat-icon {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.stat-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
