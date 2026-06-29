<script setup lang="ts">
defineProps<{
  name: string
  updateTime?: string
  active?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="building-card" :class="{ active }" @click="$emit('click')">
    <div class="name-row">
      <span class="building-name">{{ name }}</span>
    </div>
    <div v-if="active && updateTime" class="update-time">更新时间：{{ updateTime }}</div>
  </div>
</template>

<style scoped lang="scss">
.building-card {
  width: 150px;
  height: 44px;
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 10px 16px;
  cursor: pointer;
  box-sizing: border-box;
  transition: background var(--transition-base), opacity var(--transition-base);
  display: flex;
  align-items: center;
}

.building-card:hover {
  opacity: 0.5;
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
}

.building-card.active {
  background: var(--color-bg-page);
  box-shadow: var(--shadow-card);
  position: relative;
}

.building-card.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 24px;
  border-radius: 0px 100px 100px 0px;
  background: var(--color-primary);
}

.building-name {
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: normal;
  color: var(--color-text-strong);
  white-space: nowrap;
}

.building-card.active .building-name {
  font-weight: 600;
  color: var(--color-primary);
}

.update-time {
  font-size: 12px;
  color: var(--color-text-soft);
  line-height: 18px;
  display: none;
}
</style>
