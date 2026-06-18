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

<style scoped>
.building-card {
  width: 150px;
  height: 44px;
  border-radius: 8px;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 10px 16px;
  cursor: pointer;
  box-sizing: border-box;
  transition: background 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;
}

.building-card:hover {
  opacity: 0.5;
  background: #FFFFFF;
  border-radius: 8px;
}

.building-card.active {
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 4px 14px 0px rgba(190, 198, 223, 0.2);
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
  background: #0047FF;
}

.building-name {
  font-family: 'PingFang SC', '苹方-简', '苹方', sans-serif;
  font-size: 14px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: normal;
  color: #000000;
  white-space: nowrap;
}

.building-card.active .building-name {
  font-weight: 600;
  color: #0047FF;
}

.update-time {
  font-size: 12px;
  color: #8C9099;
  line-height: 18px;
  display: none;
}
</style>
