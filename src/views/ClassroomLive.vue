<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft,
  Top,
  Bottom,
  Back,
  Right,
  Refresh
} from '@element-plus/icons-vue'

import { supervisionTableData, getMessagesByClassroom, buildingList, getPatrolClassroomsByPrefix } from '@/data/mockData'
import EvaluateDialog from '@/components/dialog/EvaluateDialog.vue'

const router = useRouter()
const route = useRoute()

const classroomId = computed(() => String(route.params.id ?? ''))

const currentRecord = computed(() => {
  const ongoing = supervisionTableData.find(
    (r) => r.classroom === classroomId.value && r.status === 'ongoing'
  )
  return ongoing ?? supervisionTableData.find((r) => r.classroom === classroomId.value)
})

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

/* 底部功能区 - 控制台 */
const cameraSegments = [
  { label: '球机', value: 'dome' },
  { label: '半球机', value: 'hemisphere' },
  { label: '常态化录播', value: 'recording' }
]
const activeCamera = ref('dome')

/* 底部功能区 - 数据统计 Tab */
const activeDataTab = ref('classroomData')

/* 云台控制 */
const handlePtz = (direction: string) => { void direction }

/* 截图 */
const handleScreenshot = () => { /* 占位 */ }

/* 留言 */
const messages = computed(() => getMessagesByClassroom(classroomId.value))
const showAllMessages = ref(false)
const displayMessages = computed(() => showAllMessages.value ? messages.value : messages.value.slice(0, 5))
const newMessage = ref('')
const handleSend = () => { if (newMessage.value.trim()) newMessage.value = '' }

/* 在线评价弹窗 */
const showEvaluateDialog = ref(false)
const handleOpenEvaluate = () => { showEvaluateDialog.value = true }
const handleCloseEvaluate = () => { showEvaluateDialog.value = false }

</script>

<template>
  <div class="classroom-live">
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

    <!-- 2. 中部展示区 -->
    <section class="main-display">
      <el-row :gutter="20">
        <!-- 左列：媒体流 -->
        <el-col :span="12">
          <el-card shadow="never" class="media-card" body-class="media-card-body">
            <img class="media-img" src="@/assets/patrol/classroom-live/example-01.png" alt="摄像头画面" />
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
    <section class="bottom-area">
      <el-row :gutter="20">
        <!-- 左列：控制台 -->
        <el-col :span="12">
          <el-card shadow="never" class="control-card">
            <div class="control-header">
              <button class="btn-primary evaluate-btn" @click="handleOpenEvaluate">
                <img class="evaluate-icon" src="@/assets/patrol/classroom-live/icon-05.svg" alt="" />
                在线评价
              </button>
              <div class="segmented">
                <span
                  v-for="item in cameraSegments"
                  :key="item.value"
                  :class="['segmented-item', { active: activeCamera === item.value }]"
                  @click="activeCamera = item.value"
                >{{ item.label }}</span>
              </div>
            </div>
            <div class="control-body">
              <div class="control-inner">
                <!-- 球机 -->
                <template v-if="activeCamera === 'dome'">
                  <div class="ptz-area">
                    <div class="ptz-grid">
                      <div />
                      <el-button :icon="Top" @click="handlePtz('up')" />
                      <div />
                      <el-button :icon="Back" @click="handlePtz('left')" />
                      <el-button class="ptz-center" @click="handlePtz('auto')">
                        <el-icon><Refresh /></el-icon>
                      </el-button>
                      <el-button :icon="Right" @click="handlePtz('right')" />
                      <div />
                      <el-button :icon="Bottom" @click="handlePtz('down')" />
                      <div />
                    </div>
                  </div>
                  <div class="preset-area">
                    <div class="preset-row">
                      <el-button class="btn-plain preset-btn">
                        <img src="@/assets/patrol/classroom-live/icon-11.svg" class="preset-icon" />
                        拉远
                      </el-button>
                      <el-button class="btn-plain preset-btn">
                        <img src="@/assets/patrol/classroom-live/icon-10.svg" class="preset-icon" />
                        拉近
                      </el-button>
                    </div>
                    <el-button type="primary" class="btn-primary screenshot-btn" @click="handleScreenshot">
                      <img src="@/assets/patrol/classroom-live/icon-12.svg" class="preset-icon" />
                      截图
                    </el-button>
                  </div>
                </template>
                <!-- 半球机 / 常态化录播 -->
                <div v-else class="no-control-hint">
                  <img class="no-control-img" src="@/assets/patrol/classroom-live/stat-01.png" alt="" />
                  <p class="no-control-text">仅球机画面支持远程控制</p>
                </div>
              </div>
            </div>
            <p class="control-hint">教学督导请选择常态录播按钮，如果异常，请选择轻录播按钮。教室巡视、设备巡检，考试巡查请选择轻录播球机/半球机按钮。</p>
          </el-card>
        </el-col>

        <!-- 右列：数据统计 -->
        <el-col :span="12">
          <el-card shadow="never" class="data-card">
            <el-tabs v-model="activeDataTab" class="data-tabs">
              <el-tab-pane label="课堂数据" name="classroomData">
                <div class="stats-table">
                  <!-- 互动 -->
                  <div class="stats-row">
                    <div class="stats-category cat-interact">
                      <img class="category-icon" src="@/assets/patrol/classroom-live/icon-06.svg" alt="" />
                      <span>互动</span>
                    </div>
                    <div class="stats-items">
                      <div class="stats-item">
                        <span class="stats-val">128</span>
                        <span class="stats-label">课堂互动次数</span>
                      </div>
                      <div class="stats-item">
                        <span class="stats-val">36</span>
                        <span class="stats-label">课件发布次数</span>
                      </div>
                      <div class="stats-item">
                        <span class="stats-val">92%</span>
                        <span class="stats-label">出勤率</span>
                      </div>
                    </div>
                  </div>
                  <!-- 抢答 -->
                  <div class="stats-row">
                    <div class="stats-category cat-rush">
                      <img class="category-icon" src="@/assets/patrol/classroom-live/icon-07.svg" alt="" />
                      <span>抢答</span>
                    </div>
                    <div class="stats-items">
                      <div class="stats-item">
                        <span class="stats-val">15</span>
                        <span class="stats-label">累计发布抢答条数</span>
                      </div>
                      <div class="stats-item">
                        <span class="stats-val">86</span>
                        <span class="stats-label">参与抢答人次</span>
                      </div>
                      <div class="stats-item">
                        <span class="stats-val">78%</span>
                        <span class="stats-label">抢答平均参与率</span>
                      </div>
                    </div>
                  </div>
                  <!-- 提问 -->
                  <div class="stats-row">
                    <div class="stats-category cat-question">
                      <img class="category-icon" src="@/assets/patrol/classroom-live/icon-08.svg" alt="" />
                      <span>提问</span>
                    </div>
                    <div class="stats-items">
                      <div class="stats-item">
                        <span class="stats-val">42</span>
                        <span class="stats-label">累计发布提问次数</span>
                      </div>
                      <div class="stats-item">
                        <span class="stats-val">28</span>
                        <span class="stats-label">累计随机提问次数</span>
                      </div>
                      <div class="stats-item">
                        <span class="stats-val">14</span>
                        <span class="stats-label">累计点名提问次数</span>
                      </div>
                    </div>
                  </div>
                  <!-- 互动答题 -->
                  <div class="stats-row">
                    <div class="stats-category cat-quiz">
                      <img class="category-icon" src="@/assets/patrol/classroom-live/icon-09.svg" alt="" />
                      <span>互动答题</span>
                    </div>
                    <div class="stats-items">
                      <div class="stats-item">
                        <span class="stats-val">20</span>
                        <span class="stats-label">累计发布个数</span>
                      </div>
                      <div class="stats-item">
                        <span class="stats-val">560</span>
                        <span class="stats-label">答题总数</span>
                      </div>
                      <div class="stats-item">
                        <span class="stats-val">85%</span>
                        <span class="stats-label">平均参与率</span>
                      </div>
                      <div class="stats-item">
                        <span class="stats-val">72%</span>
                        <span class="stats-label">平均正确率</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="留言" name="messages">
                <div class="messages-wrap">
                  <div class="message-input">
                    <el-input v-model="newMessage" placeholder="发布留言..." size="small" />
                    <el-button type="primary" class="btn-primary send-btn" @click="handleSend">发送</el-button>
                  </div>
                  <div class="messages-list">
                    <template v-if="messages.length > 0">
                      <div v-for="(msg, i) in displayMessages" :key="i" class="message-item">
                        <div class="message-head">
                          <span class="message-name">{{ msg.name }}</span>
                          <span class="message-time">{{ msg.time }}</span>
                        </div>
                        <p class="message-content">{{ msg.content }}</p>
                      </div>
                      <button v-if="messages.length > 5 && !showAllMessages" class="more-comments" @click="showAllMessages = true">
                        查看更多评论
                      </button>
                    </template>
                    <div v-else class="no-control-hint">
                      <img class="no-control-img" src="@/assets/patrol/classroom-live/stat-02.png" alt="" />
                      <p class="no-control-text">暂无留言</p>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 在线评价弹窗 -->
    <EvaluateDialog v-model="showEvaluateDialog" />
  </div>
</template>

<style scoped>
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
}

/* ========== 整体页面架构 ========== */
.classroom-live {
  min-height: 100vh;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-display {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.bottom-area {
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
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(105, 123, 169, 0.1);
  font-size: 14px;
  color: #5b6470;
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
  color: #8c9099;
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
  color: #64748b;
}

/* ========== 更多教室弹出面板 ========== */
.more-rooms-panel {
  width: 100%;
  height: 240px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 30px 0 rgba(190, 198, 223, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  color: #5b6470;
  cursor: pointer;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.building-tab.active {
  color: #1947ff;
  border-bottom-color: #1947ff;
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
  border-radius: 8px;
  border: 1px solid transparent;
  background: #f5f6fa;
  font-size: 13px;
  color: #191c1e;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.2s, color 0.2s;
}

.room-btn:hover {
  border-color: #1947ff;
  color: #1947ff;
}

.room-btn.active {
  border: 1px solid #1947ff;
}

/* ========== 中部展示区 ========== */
.media-card,
.screen-card {
  border: none;
  border-radius: 10px;
  background: transparent;
  height: 100%;
}

.control-card {
  border: none;
  border-radius: 10px;
  background: var(--color-bg-page);
  backdrop-filter: blur(8px);
  height: 330px;
}

.data-card {
  border: none;
  border-radius: 10px;
  background: var(--color-bg-page);
  backdrop-filter: blur(8px);
  height: 430px;
  overflow: hidden;
}

.data-card :deep(.el-card__body),
.data-card :deep(.el-tabs__content),
.data-card :deep(.el-tab-pane) {
  overflow: hidden;
  scrollbar-width: none;
}

.data-card :deep(.el-card__body)::-webkit-scrollbar,
.data-card :deep(.el-tabs__content)::-webkit-scrollbar,
.data-card :deep(.el-tab-pane)::-webkit-scrollbar {
  display: none;
}

.media-card :deep(.el-card__body),
.screen-card :deep(.el-card__body) {
  padding: 0;
  height: 100%;
}

.media-img {
  width: 790px;
  height: 444px;
  object-fit: cover;
  display: block;
  border-radius: 10px;
}

.card-header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

/* ========== 底部功能区 ========== */
.control-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.evaluate-btn {
  width: 110px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.evaluate-icon {
  width: 16px;
  height: 16px;
}

.segmented {
  display: inline-flex;
  align-items: center;
  width: 242px;
  height: 36px;
  border-radius: 6px;
  background: #ecf3fb;
  padding: 3px;
  box-sizing: border-box;
}

.segmented-item {
  flex: 1;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 13px;
  color: #5b6470;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.segmented-item.active {
  background: #fff;
  color: #4080ff;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.control-hint {
  font-size: 13px;
  color: #64748b;
  margin: 10px 0 0;
  line-height: 20px;
}

.control-inner {
  height: 170px;
  padding: 0 20px;
  border-radius: 6px;
  background: #ecf3fb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.data-tabs :deep(.el-tabs__header) {
  margin-bottom: 16px;
}

.tab-pane-content {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pane-hint {
  font-size: 14px;
  color: #b7bbc2;
}

.no-control-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  width: 100%;
}

.no-control-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.no-control-text {
  font-size: 14px;
  color: #b7bbc2;
  margin: 0;
}

.ptz-area {
  padding-left: 80px;
}

.ptz-grid {
  display: grid;
  grid-template-columns: repeat(3, 30px);
  grid-template-rows: repeat(3, 30px);
  gap: 10px;
  align-items: center;
  justify-items: center;
}

.ptz-grid .el-button {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  padding: 0;
  margin: 0;
  min-width: 30px;
}

.ptz-center {
  background: #1947ff;
  color: #fff;
}

.preset-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 380px;
  flex-shrink: 0;
}

.preset-row {
  display: flex;
  gap: 10px;
}

.preset-btn {
  flex: 1;
  height: 48px;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #191c1e;
}

.preset-btn:hover {
  background: #f0f4ff;
  border: 1px solid #1947ff;
  border-color: #3b65ff;
  color: #1947ff;
}

.screenshot-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #191c1e;
}

.screenshot-btn:hover {
  background: #f0f4ff;
  color: #1947ff;
  border: 1px solid #1947ff;
}

.preset-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  vertical-align: middle;
}

.preset-hint {
  font-size: 12px;
  color: #b7bbc2;
  margin: 0;
  line-height: 18px;
}

/* ========== 数据统计分栏 ========== */
.stats-table {
  display: flex;
  flex-direction: column;
}

.stats-row {
  display: flex;
  align-items: center;
  height: 72px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 10px 0 rgba(214, 220, 225, 0.2);
  padding: 0 20px;
  margin-bottom: 10px;
}

.stats-row:last-child {
  margin-bottom: 0;
}

.stats-category {
  width: 70px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 13px;
  font-weight: 600;
  margin-right: 16px;
}

.category-icon {
  width: 20px;
  height: 20px;
}

.cat-interact {
  background: #e9efff;
  color: #1947ff;
}

.cat-rush {
  background: #e9f6ff;
  color: #0047ff;
}

.cat-question {
  background: #eee9ff;
  color: #3813ff;
}

.cat-quiz {
  background: #fff1df;
  color: #ff6600;
}

/* ========== 留言区 ========== */
.messages-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 350px;
  overflow: hidden;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  scrollbar-width: none;
}

.messages-list::-webkit-scrollbar {
  display: none;
}

.message-item {
  padding: 10px 14px;
  border-radius: 8px;
  background: #f9fafb;
}

.message-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.message-name {
  font-size: 14px;
  font-weight: 600;
  color: #191c1e;
}

.message-time {
  font-size: 12px;
  color: #8c9099;
}

.message-content {
  font-size: 13px;
  color: #5b6470;
  line-height: 20px;
  margin: 0;
}

.more-comments {
  font-size: 13px;
  color: #1947ff;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  font-family: inherit;
  text-align: center;
}

.more-comments:hover {
  color: #3b65ff;
}

.message-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.message-input .el-input {
  width: 695px;
  height: 36px;
}

.send-btn {
  width: 60px;
  height: 36px;
  border-radius: 8px;
  opacity: 0.5;
}

.stats-items {
  flex: 1;
  display: flex;
  align-items: center;
}

.stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-right: 1px solid #e8e8e8;
  padding: 0 8px;
}

.stats-item:last-child {
  border-right: none;
}

.stats-val {
  font-size: 20px;
  font-weight: 700;
  color: #191c1e;
  line-height: 28px;
}

.stats-label {
  font-size: 12px;
  color: #8c9099;
  text-align: center;
  white-space: nowrap;
}
</style>
