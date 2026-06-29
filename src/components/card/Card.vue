<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
}>()
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="card-label">{{ label }}</span>
      <el-icon v-if="icon" class="card-icon">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  background: var(--color-bg-page);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-label {
  font-size: 14px;
  color: #333;
}

.card-icon {
  font-size: 24px;
  color: var(--color-primary-soft);
}
</style>
