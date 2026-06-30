<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

import { supervisionTableData, buildingList, getPatrolClassroomsByPrefix } from '@/data/mockData'
import BottomArea from './BottomArea.vue'
import HlsPlayer from '@/components/video/HlsPlayer.vue'

const router = useRouter()
const route = useRoute()

const classroomId = computed(() => String(route.params.id ?? ''))

const currentRecord = computed(() => {
  const ongoing = supervisionTableData.find(
    (r) => r.classroom === classroomId.value && r.status === 'ongoing'
  )
  return ongoing ?? supervisionTableData.find((r) => r.classroom === classroomId.value)
})

const videoUrl = import.meta.env.VITE_VIDEO_URL

/* 顶部导航 */
const handleBack = () => router.back()
const showMoreRooms = ref(false)
const activeBuilding = ref(buildingList[0].prefix)
const handleMoreRooms = () => { showMoreRooms.value = !showMoreRooms.value }
const handleRoomClick = (classroom: string) => {
  showMoreRooms.value = false
  router.push({ name: 'classroom-live', params: { id: classroom } })
}
const classroomsByFloor = computed(() => {
  const list = getPatrolClassroomsByPrefix(activeBuilding.value)
  const map = new Map<string, typeof list>()
  for (const c of list) {
    const floor = c.classroom.split('-')[1]?.[0] ?? '1'
    if (!map.has(floor)) map.set(floor, [])
    map.get(floor)!.push(c)
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
})
</script>

<template>
  <div class="classroom-live scrollbar-hidden">
    <!-- header + 中部展示区 合并容器 -->
    <div class="top-section">
    <!-- 1. 顶部导航栏 -->
    <header class="live-header">
      <div class="header-row-top">
        <el-button link @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回</span>
        </el-button>
        <button class="more-rooms-btn" @click="handleMoreRooms">
          <img class="more-rooms-icon" src="@/assets/patrol/classroom-live/icon-01.svg" alt="" />
          <span>更多教室</span>
        </button>
      </div>
      <div class="header-row-bottom">
        <div class="header-info">
          <h1 class="course-title" v-if="currentRecord">
            {{ currentRecord.course }}
          </h1>
          <span class="tag-item">
            <img class="tag-icon" src="@/assets/patrol/classroom-live/icon-02.svg" alt="" />
            <span>教员：<span class="tag-value">{{ currentRecord?.teacher ?? '--' }}</span></span>
          </span>
          <span class="tag-item">
            <img class="tag-icon" src="@/assets/patrol/classroom-live/icon-03.svg" alt="" />
            <span>班级：<span class="tag-value">{{ currentRecord?.college ?? '--' }}</span></span>
          </span>
          <span class="tag-item">
            <img class="tag-icon" src="@/assets/patrol/classroom-live/icon-04.svg" alt="" />
            <span>教室：<span class="tag-value">{{ currentRecord?.classroom ?? '--' }}</span></span>
          </span>
        </div>
        <span class="live-count">
          实时巡课人数：x
        </span>
      </div>
    </header>

    <!-- 更多教室弹出面板 -->
    <Transition name="panel-slide">
      <div v-if="showMoreRooms" class="more-rooms-panel">
        <div class="building-tabs">
          <span
            v-for="b in buildingList"
            :key="b.id"
            :class="['building-tab', { active: activeBuilding === b.prefix }]"
            @click="activeBuilding = b.prefix"
          >{{ b.name }}</span>
        </div>
        <div class="classroom-floors">
          <div v-for="([floor, rooms]) in classroomsByFloor" :key="floor" class="floor-row">
            <div class="floor-rooms">
              <button
                v-for="room in rooms"
                :key="room.id"
                :class="['room-btn', { active: room.classroom === classroomId }]"
                @click="handleRoomClick(room.classroom)"
              >{{ room.classroom }}</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 2. 中部展示区 -->
    <section class="main-display">
      <el-row :gutter="20">
        <!-- 左列：媒体流 -->
        <el-col :span="12">
          <el-card shadow="never" class="media-card" body-class="media-card-body">
            <div class="video-container">
              <HlsPlayer
                :src="videoUrl"
                :autoplay="true"
                :muted="true"
              />
            </div>
          </el-card>
        </el-col>

        <!-- 右列：多媒体系统屏幕 -->
        <el-col :span="12">
          <el-card shadow="never" class="screen-card">
            <img class="media-img" src="@/assets/patrol/classroom-live/example-02.png" alt="多媒体系统屏幕" />
          </el-card>
        </el-col>
      </el-row>
    </section>
    </div>

    <!-- 3. 底部功能区 -->
    <BottomArea :classroom-id="classroomId" />
  </div>
</template>

<style scoped lang="scss">
/* ========== 顶部合并区域 ========== */
.top-section {
  width: 100%;
  min-height: 592px;
  border-radius: var(--radius-full);
  background: var(--color-bg-page);
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  position: relative;
}

/* ========== 整体页面架构 ========== */
.classroom-live {
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}

.main-display {
  flex: 1;
  min-height: 0;
  width: 100%;
}

/* ========== 顶部导航栏 ========== */
.live-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 20px;
}

.header-row-top {
  display: flex;
  align-items: center;
  gap: 30px;
}

.more-rooms-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: 110px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--color-bg-page-strong);
  border: 1px solid var(--color-border-soft);
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0 10px;
}

.more-rooms-icon {
  width: 16px;
  height: 16px;
}

.header-row-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.course-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  line-height: 26px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--color-text-soft);
}

.tag-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--color-text);
}

.tag-icon {
  width: 16px;
  height: 16px;
}

.live-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: right;
  letter-spacing: normal;
  color: var(--color-text-secondary);
}

/* ========== 更多教室弹出面板 ========== */
.more-rooms-panel {
  position: absolute;
  top: 80px;
  left: 10px;
  right: 10px;
  height: 240px;
  border-radius: var(--radius-full);
  background: var(--color-bg-white);
  box-shadow: var(--shadow-popover);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px) scaleY(0.95);
}

.building-tabs {
  display: flex;
  gap: 24px;
  padding: 14px 24px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.building-tab {
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: color var(--transition-base), border-color var(--transition-base);
}

.building-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
}

.classroom-floors {
  flex: 1;
  overflow-y: auto;
  padding: 10px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: none;
}

.classroom-floors::-webkit-scrollbar {
  display: none;
}

.floor-row {
  display: flex;
  align-items: center;
}

.floor-rooms {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.room-btn {
  height: 32px;
  padding: 0 14px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: #f5f6fa;
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;
  font-family: inherit;
  transition: border-color var(--transition-base), color var(--transition-base);
}

.room-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.room-btn.active {
  border: 1px solid var(--color-primary);
}

/* ========== 中部展示区 ========== */
.media-card,
.screen-card {
  border: none;
  border-radius: 10px;
  background: transparent;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-card :deep(.el-card__body),
.screen-card :deep(.el-card__body) {
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-img {
  width: 100%;
  max-width: 790px;
  aspect-ratio: 790 / 444;
  object-fit: cover;
  display: block;
  border-radius: 10px;
}

.video-container {
  width: 100%;
  max-width: 790px;
  aspect-ratio: 790 / 444;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
}

.card-header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}
</style>
