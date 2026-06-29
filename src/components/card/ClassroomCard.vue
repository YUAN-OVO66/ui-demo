<script setup lang="ts">
defineProps<{
  name: string
  active?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="classroom-card" :class="{ active }" @click="$emit('click')">
    <div class="classroom-name">{{ name }}</div>
  </div>
</template>

<style scoped lang="scss">
.classroom-card {
  width: 100%;
  height: 80px;
  border-radius: var(--radius-lg);
  background-image: url('@/assets/home/card-01.png');
  background-size: cover;
  background-position: center;
  box-sizing: border-box;
  display: grid;
  place-items: center start;
  padding: 12px 16px;
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
  position: relative;
  overflow: hidden;
}

.classroom-card:hover {
  border: 1px solid var(--color-primary);
  box-shadow: 0px 12px 24px 0px rgba(190, 198, 223, 0.3);
}

.classroom-card.active {
  border: 2px solid var(--color-primary-soft);
  box-shadow: 0 4px 12px rgba(64, 128, 255, 0.2);
}

.classroom-name {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: normal;
  color: var(--color-text);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
</style>