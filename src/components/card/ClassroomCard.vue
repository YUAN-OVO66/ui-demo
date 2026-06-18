<script setup lang="ts">
import ClassroomIcon from '@/assets/home/classroom-01.png'

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
    <div class="classroom-content">
      <div class="classroom-name">{{ name }}</div>
    </div>
    <img :src="ClassroomIcon" alt="教室" class="classroom-icon" />
  </div>
</template>

<style scoped>
.classroom-card {
  width: 250px;
  height: 80px;
  border-radius: 12px;
  background: #deeafb;
  box-sizing: border-box;
  box-shadow: 0px 10px 20px 0px rgba(190, 198, 223, 0.2), inset 0px 1px 10px 0px rgba(15, 101, 231, 0.1154);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;
}

.classroom-card:hover {
  border: 1px solid #1947FF;
  box-shadow: 0px 12px 24px 0px rgba(190, 198, 223, 0.3), inset 0px 1px 10px 0px rgba(15, 101, 231, 0.1154);
}

.classroom-card.active {
  border: 2px solid #4080FF;
  box-shadow: 0 4px 12px rgba(64, 128, 255, 0.2);
}

.classroom-icon {
  width: 83px;
  height: 75px;
  opacity: 0.6;
  object-fit: contain;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.classroom-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.classroom-name {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: normal;
  color: #191C1E;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>