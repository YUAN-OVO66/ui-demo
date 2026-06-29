<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BasePage from '@/components/layout/BasePage.vue'
import BuildingCard from '@/components/card/BuildingCard.vue'
import PatrolClassroomCard from '@/components/card/PatrolClassroomCard.vue'
import { buildingList, getPatrolClassroomsByPrefix } from '@/data/mockData'

const router = useRouter()

const activeBuildingId = ref<number>(buildingList[0].id)
const activeClassroomId = ref<string | null>(null)
const currentTime = ref(new Date())

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const classPeriods = [
  { start: '08:00', end: '08:45', name: '第1节课' },
  { start: '08:55', end: '09:40', name: '第2节课' },
  { start: '10:00', end: '10:45', name: '第3节课' },
  { start: '10:55', end: '11:40', name: '第4节课' },
  { start: '14:00', end: '14:45', name: '第5节课' },
  { start: '14:55', end: '15:40', name: '第6节课' },
  { start: '16:00', end: '16:45', name: '第7节课' },
  { start: '16:55', end: '17:40', name: '第8节课' },
  { start: '19:00', end: '19:45', name: '第9节课' },
  { start: '19:55', end: '20:40', name: '第10节课' },
]

const padZero = (n: number) => n.toString().padStart(2, '0')

const currentClassPeriod = computed(() => {
  const now = currentTime.value
  const timeStr = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`
  return classPeriods.find((p) => timeStr >= p.start && timeStr <= p.end)?.name || ''
})

const formattedTime = computed(() => {
  const now = currentTime.value
  const year = now.getFullYear()
  const month = padZero(now.getMonth() + 1)
  const day = padZero(now.getDate())
  const weekday = weekdays[now.getDay()]
  const hours = padZero(now.getHours())
  const minutes = padZero(now.getMinutes())
  return `${year}-${month}-${day} ${weekday} ${hours}:${minutes}`
})

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const activeBuilding = computed(
  () => buildingList.find((b) => b.id === activeBuildingId.value) ?? buildingList[0]
)

const classroomList = computed(() => getPatrolClassroomsByPrefix(activeBuilding.value.prefix))

const handleSelectBuilding = (id: number) => {
  activeBuildingId.value = id
  activeClassroomId.value = null
}

const handleEnterClassroom = (id: string) => {
  activeClassroomId.value = id
  router.push({ name: 'classroom-live', params: { id } })
}
</script>

<template>
  <BasePage>
    <section class="patrol-layout">
      <aside class="building-aside panel panel-soft">
        <h3 class="panel-title-sm">教学楼</h3>
        <div class="building-list">
          <BuildingCard
            v-for="item in buildingList"
            :key="item.id"
            :name="item.name"
            :active="activeBuildingId === item.id"
            @click="handleSelectBuilding(item.id)"
          />
        </div>
      </aside>

      <section class="classroom-main panel">
        <header class="main-header">
          <h2 class="panel-title">{{ activeBuilding.name }}</h2>
          <span class="current-time">
            当前时间：{{ formattedTime }}{{ currentClassPeriod ? ` (${currentClassPeriod})` : '' }}
          </span>
        </header>
        <div v-if="classroomList.length" class="classroom-grid">
          <PatrolClassroomCard
            v-for="room in classroomList"
            :key="room.id"
            :classroom="room.classroom"
            :status="room.status"
            :course="room.course"
            :teacher="room.teacher"
            :period="room.period"
            :active="activeClassroomId === room.id"
            @click="activeClassroomId = room.id"
            @enter="handleEnterClassroom(room.id)"
          />
        </div>
        <div v-else class="empty-state">该教学楼暂无教室数据</div>
      </section>
    </section>
  </BasePage>
</template>

<style scoped lang="scss">
.patrol-layout {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
  min-height: 0;
  overflow: hidden;
}

.building-aside {
  width: 190px;
  flex: none;
  min-height: 0;
  flex-shrink: 0;
  overflow: hidden;
}

.building-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.classroom-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  flex-shrink: 0;
  overflow: hidden;
}

.main-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.current-time {
  font-size: 13px;
  color: var(--color-text-soft);
}

.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  padding-right: 4px;
  align-content: start;
}

.classroom-grid::-webkit-scrollbar {
  width: 6px;
}

.classroom-grid::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-sm);
}

.empty-state {
  flex: 1;
  height: 100%;
}
</style>
