<script setup lang="ts">
import type { SupervisionRecord } from '@/data/mockData'
import ongoingIcon from '@/assets/supervision/status-ongoing-01.gif'
import finishedIcon from '@/assets/supervision/status-finished-01.svg'

defineOptions({ name: 'CourseCard' })

const props = defineProps<{
  record: SupervisionRecord
}>()

const emit = defineEmits<{
  click: [record: SupervisionRecord]
}>()

// 课程卡片配色(按 id 取模,稳定分配)
const courseColorPalette = [
  'course-color-orange',
  'course-color-pink',
  'course-color-blue',
  'course-color-cyan',
  'course-color-yellow'
]

const colorClass = courseColorPalette[props.record.id % courseColorPalette.length]
const statusClass = `status-${props.record.status}`
</script>

<template>
  <div
    class="course-card"
    :class="[colorClass, statusClass]"
    @click="emit('click', record)"
  >
    <span
      v-if="record.status === 'ongoing'"
      class="status-tag status-ongoing-tag"
    >
      <img :src="ongoingIcon" class="status-svg-icon" />
      上课中
    </span>
    <span
      v-else-if="record.status === 'finished'"
      class="status-tag status-finished-tag"
    >
      <img :src="finishedIcon" class="status-svg-icon" />
      已结束
    </span>
    <span
      v-else-if="record.status === 'pending'"
      class="status-tag status-pending-tag"
    >
      未开始
    </span>

    <div class="course-name">{{ record.course }}</div>
    <div class="course-class">{{ record.college }}</div>
    <div class="course-teacher">{{ record.teacher }}</div>
  </div>
</template>

<style scoped lang="scss">
/* 课程卡片 */
.course-card {
  position: relative;
  flex: 1;
  min-height: 0;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-slow), border-color var(--transition-slow);
  border: 1px solid transparent;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--color-primary);
}

/* 课程类型颜色 */
.course-color-orange {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-color: rgba(255, 152, 0, 0.2);
}

.course-color-yellow {
  background: linear-gradient(135deg, #fffde7 0%, #fff9c4 100%);
  border-color: rgba(255, 235, 59, 0.2);
}

.course-color-pink {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
  border-color: rgba(233, 30, 99, 0.2);
}

.course-color-blue {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-color: rgba(33, 150, 243, 0.2);
}

.course-color-cyan {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  border-color: rgba(0, 188, 212, 0.2);
}

.course-color-default {
  background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
  border-color: rgba(158, 158, 158, 0.2);
}

/* 状态标签 */
.status-tag {
  position: absolute;
  top: 6px;
  right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: auto;
  min-width: 56px;
  max-width: 64px;
  height: 18px;
  border-radius: 6px;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  font-weight: normal;
  line-height: 18px;
  letter-spacing: normal;
  color: var(--color-primary);
  padding: 0 4px;
  box-sizing: border-box;
}

.status-svg-icon {
  width: 12px;
  height: 12px;
}

.status-ongoing-tag,
.status-finished-tag {
  background: rgba(255, 255, 255, 0.8);
  color: var(--color-primary);
}

.status-pending-tag {
  background: rgba(255, 255, 255, 0.8);
  color: var(--color-text-muted);
}

/* 课程信息 */
.course-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  line-height: 1.4;
  word-break: break-word;
}

.course-color-orange .course-name { color: #e65100; }
.course-color-yellow .course-name { color: #b8860b; }
.course-color-pink   .course-name { color: #c2185b; }
.course-color-blue   .course-name { color: #1565c0; }
.course-color-cyan   .course-name { color: #00838f; }
.course-color-default .course-name { color: var(--color-text); }

.course-class {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.3;
  margin-bottom: 2px;
}

.course-teacher {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.3;
}

/* 响应式适配 */
@media (max-width: 1400px) {
  .course-name {
    font-size: 13px;
  }

  .course-class,
  .course-teacher {
    font-size: 11px;
  }
}
</style>
