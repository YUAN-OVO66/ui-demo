<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  subtitle?: string
  location?: string
  active?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const hasMultipleFields = computed(() => {
  return !!(props.subtitle || props.location)
})
</script>

<template>
  <div
    class="patrol-card"
    :class="{ active }"
    @click="emit('click')"
  >
    <div class="patrol-title" :class="{ 'single-field': !hasMultipleFields }">
      {{ title }}
    </div>
    <div v-if="subtitle" class="patrol-subtitle">{{ subtitle }}</div>
    <div v-if="location" class="patrol-location">{{ location }}</div>
  </div>
</template>

<style scoped>
.patrol-card {
  width: 220px;
  height: 120px;
  border-radius: 12px;
  background: linear-gradient(0deg, #eff5fd 0%, #ebf0fd 100%);
  box-sizing: border-box;
  border: 1px solid #E3E9F6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
  flex-shrink: 0;
}

.patrol-card:hover {
  border: 1px solid #1947FF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.patrol-card.active {
  border: 2px solid #4080FF;
  box-shadow: 0 4px 12px rgba(64, 128, 255, 0.2);
}

.patrol-title {
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  text-align: center;
  color: #000000;
}

.patrol-title.single-field {
  font-size: 18px;
  font-weight: 500;
}

.patrol-subtitle,
.patrol-location {
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-align: center;
  color: #373737;
}
</style>