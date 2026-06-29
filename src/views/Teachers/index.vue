<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { List, Calendar } from '@element-plus/icons-vue'
import BasePage from '@/components/layout/BasePage.vue'
import ScheduleView from '@/components/supervision/ScheduleView.vue'
import SupervisionList from '@/components/supervision/SupervisionList.vue'
import {
  supervisionTableData,
  createInitialSupervisionFilter,
  type SupervisionFilterState,
  type SupervisionRecord
} from '@/data/mockData'

type TabKey = 'ongoing' | 'today' | 'all'
type ViewMode = 'list' | 'schedule'

const route = useRoute()
const router = useRouter()
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

// 监听路由 query 参数切换选项卡
onMounted(() => {
  const tab = route.query.tab as TabKey
  if (tab && ['ongoing', 'today', 'all'].includes(tab)) {
    activeTab.value = tab
  }
})

watch(() => route.query.tab, (tab) => {
  if (tab && ['ongoing', 'today', 'all'].includes(tab as string)) {
    activeTab.value = tab as TabKey
  }
})

const handleRowClick = (record: SupervisionRecord) => {
  router.push({ name: 'classroom-live', params: { id: record.classroom } })
}
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

    <section class="supervision-panel panel">
      <SupervisionList
        v-if="viewMode === 'list'"
        v-model="filterState"
        v-model:active-tab="activeTab"
        :raw-records="supervisionTableData"
        @row-click="handleRowClick"
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

<style scoped lang="scss">
.supervision-panel {
  height: 100%;
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
  transition: background var(--transition-base), color var(--transition-base);
  font-family: inherit;
}

.view-item:hover {
  color: var(--color-primary-soft);
}

.view-active {
  color: var(--color-primary-soft);
  background: var(--color-bg-white);
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
  transition: color var(--transition-base), border-color var(--transition-base);
  font-family: inherit;
}

.tab-item:hover {
  color: var(--color-primary-soft);
}

.tab-active {
  color: var(--color-primary-soft);
  border-bottom-color: var(--color-primary-soft);
}
</style>
