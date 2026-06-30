<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Calendar } from '@element-plus/icons-vue'
import ClassroomCard from '@/components/card/ClassroomCard.vue'
import StatCard from '@/components/card/StatCard.vue'
import PatrolCard from '@/components/card/PatrolCard.vue'
import BasePage from '@/components/layout/BasePage.vue'
import { getPatrolClassroomsByPrefix, buildingList, supervisionTableData, statsData, MOCK_TODAY } from '@/data/mockData'

const router = useRouter()

// 从所有教学楼获取教室列表数据（使用 Patrol 页面的数据源）
const classroomList = computed(() => {
  const allClassrooms = buildingList.flatMap((building) =>
    getPatrolClassroomsByPrefix(building.prefix)
  )
  return allClassrooms
})

// 最近巡课数据 - 从 supervisionTableData 中获取最近正在上课和已完成的课程
const nearestPatrolData = computed(() => {
  // 筛选最近的课程记录（优先今天上课中，然后是今天待上课，最后是昨天已完成）
  const recentRecords = supervisionTableData
    .filter(record => {
      const recordDate = new Date(record.date)
      const todayDate = new Date(MOCK_TODAY)
      const daysDiff = Math.floor((todayDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24))
      // 只显示今天和昨天的记录
      return daysDiff >= 0 && daysDiff <= 1
    })
    .sort((a, b) => {
      // 排序规则：1. ongoing > pending > finished  2. 日期越新越靠前
      const statusOrder = { ongoing: 0, pending: 1, finished: 2 }
      const statusDiff = statusOrder[a.status] - statusOrder[b.status]
      if (statusDiff !== 0) return statusDiff
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 6) // 只取前6条
    .map((record) => ({
      id: record.id,
      title: record.course,
      subtitle: record.teacher,
      location: record.classroom,
      classroom: record.classroom // 用于跳转
    }))

  return recentRecords
})

const activeClassroomId = ref<string | null>(null)
const activePatrolId = ref<number | null>(null)

const handleClassroomClick = (classroomId: string) => {
  activeClassroomId.value = classroomId
  router.push({ name: 'classroom-live', params: { id: classroomId } })
}

const handlePatrolClick = (patrolItem: typeof nearestPatrolData.value[0]) => {
  activePatrolId.value = patrolItem.id
  // 点击最近巡课卡片，跳转到对应的教室实时页面
  if (patrolItem.classroom) {
    router.push({ name: 'classroom-live', params: { id: patrolItem.classroom } })
  }
}

const handlePatrolWheel = (event: WheelEvent) => {
  const container = event.currentTarget as HTMLElement
  if (container) {
    event.preventDefault()
    container.scrollLeft += event.deltaY
  }
}

const handleClassroomWheel = (event: WheelEvent) => {
  const container = event.currentTarget as HTMLElement
  if (container) {
    container.scrollTop += event.deltaY
  }
}

const handleScheduleClick = (tab: 'today' | 'ongoing') => {
  router.push({ name: 'teachers', query: { tab } })
}
</script>

<template>
  <BasePage>
    <section class="classroom-section panel">
      <h2 class="section-title">教室巡课</h2>
      <div class="classroom-grid scrollbar-thin" @wheel="handleClassroomWheel">
        <ClassroomCard
          v-for="item in classroomList"
          :key="item.id"
          :name="item.classroom"
          :active="activeClassroomId === item.id"
          @click="handleClassroomClick(item.id)"
        />
      </div>
    </section>

    <div class="two-columns">
      <section class="patrol-section panel">
        <h2 class="section-title">最近巡课</h2>
        <div class="patrol-grid scrollbar-hidden" @wheel="handlePatrolWheel">
          <PatrolCard
            v-for="item in nearestPatrolData"
            :key="item.id"
            :title="item.title"
            :subtitle="item.subtitle"
            :location="item.location"
            :active="activePatrolId === item.id"
            @click="handlePatrolClick(item)"
          />
        </div>
      </section>

      <section class="schedule-section panel">
        <h2 class="section-title">教学督导</h2>
        <div class="schedule-list">
          <div class="schedule-item schedule-today" @click="handleScheduleClick('today')">
            <el-icon class="schedule-icon"><Calendar /></el-icon>
            <span>今日课表</span>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
          <div class="schedule-item schedule-ongoing" @click="handleScheduleClick('ongoing')">
            <el-icon class="schedule-icon"><Calendar /></el-icon>
            <span>上课中课表</span>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </section>
    </div>

    <section class="stats-section panel">
      <div class="stats-grid">
        <StatCard
          v-for="item in statsData"
          :key="item.id"
          :label="item.label"
          :count="item.count"
          :bg-style="item.bgStyle"
          :icon-src="item.iconSrc"
        />
      </div>
    </section>
  </BasePage>
</template>

<style scoped lang="scss">
.section-title {
  width: 96px;
  height: 32px;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: var(--color-text);
  margin: 0;
}

.classroom-section {
  height: 420px;
  overflow: hidden;
}

.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding-right: 8px;
}

.two-columns {
  display: flex;
  gap: 20px;
}

.patrol-section {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.patrol-grid {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
}

.schedule-section {
  width: 370px;
  flex-shrink: 0;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--color-bg-page);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  background-size: cover;
  background-position: center;
}

.schedule-today {
  background-image: url('@/assets/home/bg-01.png');
}

.schedule-ongoing {
  background-image: url('@/assets/home/bg-02.png');
}

.schedule-item:hover {
  opacity: 0.9;
  transform: translateX(4px);
}

.schedule-icon {
  color: var(--color-primary-soft);
  font-size: 20px;
}

.arrow-icon {
  margin-left: auto;
  color: var(--color-text-muted);
}

.stats-grid {
  display: flex;
  gap: 24px;
}

.stats-grid :deep(.stat-card) {
  flex: 1;
  min-width: 0;
  height: 140px;
}
</style>
