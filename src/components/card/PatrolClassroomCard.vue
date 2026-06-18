<script setup lang="ts">
import { computed } from 'vue'
import ongoingIcon from '@/assets/supervision/status-ongoing-01.svg'
import { supervisionPeriodOptions } from '@/data/mockData'

const props = defineProps<{
  classroom: string
  status: 'ongoing' | 'idle'
  course?: string
  teacher?: string
  period?: string
  active?: boolean
}>()

defineEmits<{
  click: []
  enter: []
}>()

const formattedPeriod = computed(() => {
  if (!props.period) return ''
  const opt = supervisionPeriodOptions.find((o) => o.label === props.period)
  if (!opt) return props.period
  const start = opt.time.split('-')[0]
  const end = opt.time.split('-')[1]
  const num = opt.value
  return `${start} - ${end}（${num}节）`
})
</script>

<template>
  <div
    class="patrol-classroom-card"
    :class="{ active, 'is-ongoing': status === 'ongoing' }"
    @click="$emit('click')"
  >
    <header class="card-header">
      <span class="classroom-name">{{ classroom }}</span>
      <div :class="['status-badge', `status-${status}`]">
        <img v-if="status === 'ongoing'" :src="ongoingIcon" class="status-icon" />
        <span>{{ status === 'ongoing' ? '上课中' : '暂未上课' }}</span>
      </div>
    </header>

    <div class="card-body">
      <template v-if="status === 'ongoing'">
        <div class="info-row">
          <img src="@/assets/patrol/icon-01.svg" class="info-icon" />
          <span class="info-label">课程：</span>
          <span class="info-value">{{ course }}</span>
        </div>
        <div class="info-row">
          <img src="@/assets/patrol/icon-02.svg" class="info-icon" />
          <span class="info-label">教员：</span>
          <span class="info-value">{{ teacher }}</span>
        </div>
        <div class="info-row">
          <img src="@/assets/patrol/icon-03.svg" class="info-icon" />
          <span class="info-label">时间：</span>
          <span class="info-value">{{ formattedPeriod }}</span>
        </div>
      </template>
      <div v-else class="empty-tip">
        <img src="@/assets/patrol/icon-05.svg" class="empty-icon" />
        <span>当前暂无课程安排</span>
      </div>
    </div>

    <img v-if="status === 'ongoing'" src="@/assets/patrol/stat-01.png" class="corner-stat" />
    <button class="btn-primary" @click.stop="$emit('enter')">
      <img src="@/assets/patrol/icon-04.svg" class="btn-icon" />
      进入教室
    </button>
  </div>
</template>

<style scoped>
.patrol-classroom-card {
  width: 340px;
  height: 276px;
  border-radius: 14px;
  background: #FFFFFF;
  border: 1px solid rgba(64, 128, 255, 0.08);
  box-shadow: 0 6px 16px rgba(190, 198, 223, 0.18), inset 0 1px 8px rgba(15, 101, 231, 0.06);
  padding: 16px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  box-sizing: border-box;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;
}

.patrol-classroom-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(190, 198, 223, 0.28), inset 0 1px 8px rgba(15, 101, 231, 0.08);
}

.patrol-classroom-card.active {
  border-color: #4080FF;
  box-shadow: 0 8px 20px rgba(64, 128, 255, 0.18);
}

.patrol-classroom-card.is-ongoing {
  background: #eaf0fb;
}

.corner-stat {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 151px;
  height: 135px;
  z-index: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.classroom-name {
  font-size: 18px;
  font-weight: 600;
  color: #191C1E;
  line-height: 26px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  border-radius: 8px;
  font-size: 14px;
}

.status-badge .status-icon {
  width: 16px;
  height: 16px;
}

.status-ongoing {
  width: 92px;
  background: #E1ECFF;
  color: #1947FF;
  border: 1px solid #A8B9FF;
}

.status-idle {
  width: 92px;
  background: #F1F5F9;
  color: rgba(0, 0, 0, 0.88);
  border: 1px solid #E2E8F0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
  padding-top: 26px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  height: 28px;
}

.info-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.info-label {
  font-family: 'PingFang SC', '苹方-简', '苹方', sans-serif;
  font-size: 14px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: normal;
  color: #64748B;
  flex-shrink: 0;
}

.info-value {
  font-family: 'PingFang SC', '苹方-简', '苹方', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: normal;
  color: #191C1E;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;
  gap: 8px;
  color: #B7BBC2;
  font-size: 13px;
}

.empty-icon {
  width: 48px;
  height: 48px;
}

.btn-primary {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
  z-index: 1;
}

.btn-icon {
  width: 16px;
  height: 16px;
}
</style>
