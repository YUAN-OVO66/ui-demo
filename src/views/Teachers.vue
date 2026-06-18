<script setup lang="ts">
import { ref, watch } from 'vue'
import { List, Calendar } from '@element-plus/icons-vue'
import BasePage from '@/components/layout/BasePage.vue'
import ScheduleView from '@/components/supervision/ScheduleView.vue'
import SupervisionList from '@/components/supervision/SupervisionList.vue'
import {
  supervisionTableData,
  createInitialSupervisionFilter,
  type SupervisionFilterState
} from '@/data/mockData'

type TabKey = 'ongoing' | 'today' | 'all'
type ViewMode = 'list' | 'schedule'

const activeTab = ref<TabKey>('ongoing')

// 从 localStorage 恢复视图模式，默认 'list'
const viewMode = ref<ViewMode>(
  (localStorage.getItem('teachers-view-mode') as ViewMode) || 'list'
)

// 切换时持久化
watch(viewMode, (val) => {
  localStorage.setItem('teachers-view-mode', val)
})

// 跨视图持久化的筛选状态（v-model 传给当前激活的视图）
const filterState = ref<SupervisionFilterState>(createInitialSupervisionFilter())
</script>

<template>
  <BasePage>
    <template #actions>
      <div class="view-switch">
        <button
          class="view-item"
          :class="{ 'view-active': viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          <el-icon><List /></el-icon>
          <span>列表视图</span>
        </button>
        <button
          class="view-item"
          :class="{ 'view-active': viewMode === 'schedule' }"
          @click="viewMode = 'schedule'"
        >
          <el-icon><Calendar /></el-icon>
          <span>课表视图</span>
        </button>
      </div>
    </template>

    <section class="supervision-panel">
      <SupervisionList
        v-if="viewMode === 'list'"
        v-model="filterState"
        v-model:active-tab="activeTab"
        :raw-records="supervisionTableData"
      >
        <template #default="{ tabs, activeTab: curTab, handleTabChange }">
          <div class="tab-list">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="tab-item"
              :class="{ 'tab-active': curTab === tab.key }"
              @click="handleTabChange(tab.key)"
            >
              {{ tab.label }}
            </button>
          </div>
        </template>
      </SupervisionList>

      <ScheduleView
        v-else
        v-model="filterState"
        :raw-records="supervisionTableData"
      />
    </section>
  </BasePage>
</template>

<style scoped>
.supervision-panel {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.6);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  min-height: 0;
}

.view-switch {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(64, 128, 255, 0.06);
  border-radius: 10px;
}

.view-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 14px;
  color: #5b6470;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-family: inherit;
}

.view-item:hover {
  color: #4080ff;
}

.view-active {
  color: #4080ff;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.tab-list {
  display: flex;
  gap: 8px;
}

.tab-item {
  padding: 10px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #5b6470;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  font-family: inherit;
}

.tab-item:hover {
  color: #4080ff;
}

.tab-active {
  color: #4080ff;
  border-bottom-color: #4080ff;
}
</style>
