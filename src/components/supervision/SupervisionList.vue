<script setup lang="ts">
import { computed, ref } from 'vue'
import { RefreshLeft } from '@element-plus/icons-vue'
import Pagination from '@/components/common/Pagination.vue'
import ongoingIcon from '@/assets/supervision/status-ongoing-01.svg'
import finishedIcon from '@/assets/supervision/status-finished-01.svg'
import emptyIcon from '@/assets/supervision/status-01.png'
import {
  supervisionPeriodOptions,
  supervisionCourseTypeOptions,
  supervisionStatusMap,
  getPeriodTime,
  createInitialSupervisionFilter,
  type SupervisionRecord,
  type SupervisionStatus,
  type SupervisionFilterState
} from '@/data/mockData'

type TabKey = 'ongoing' | 'today' | 'all'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'ongoing', label: '上课中' },
  { key: 'today', label: '今日' },
  { key: 'all', label: '全部' }
]

const props = withDefaults(
  defineProps<{
    rawRecords: SupervisionRecord[]
    activeTab: TabKey
    today?: string
    modelValue?: SupervisionFilterState
    pageSizes?: number[]
  }>(),
  {
    today: '2026-06-12',
    pageSizes: () => [10, 20, 50, 100]
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: SupervisionFilterState): void
  (e: 'update:activeTab', value: TabKey): void
  (e: 'rowClick', record: SupervisionRecord): void
}>()

const handleTabChange = (key: TabKey) => {
  emit('update:activeTab', key)
}

const internalFilter = ref<SupervisionFilterState>(createInitialSupervisionFilter())

const filterState = computed<SupervisionFilterState>(() => props.modelValue ?? internalFilter.value)

const updateFilter = (next: SupervisionFilterState) => {
  if (props.modelValue) {
    emit('update:modelValue', next)
  } else {
    internalFilter.value = next
  }
}

const updateField = <K extends keyof SupervisionFilterState>(key: K, value: SupervisionFilterState[K]) => {
  updateFilter({ ...filterState.value, [key]: value })
}

const showDatePicker = computed(() => props.activeTab === 'all')

const currentPage = ref(1)
const pageSize = ref(10)

const filteredData = computed<SupervisionRecord[]>(() => {
  const { period, courseType, dateRange, keyword } = filterState.value
  const kw = keyword.trim().toLowerCase()
  const [rangeStart, rangeEnd] = dateRange ?? ['', '']

  return props.rawRecords.filter((item) => {
    if (props.activeTab === 'ongoing' && item.status !== 'ongoing') return false
    if (props.activeTab === 'today' && item.date !== props.today) return false

    if (period) {
      const opt = supervisionPeriodOptions.find((o) => o.value === period)
      if (opt && item.period !== opt.label) return false
    }

    if (courseType && item.courseType !== courseType) return false

    if (props.activeTab === 'all' && rangeStart && rangeEnd) {
      if (item.date < rangeStart || item.date > rangeEnd) return false
    }

    if (kw) {
      const haystack = [item.course, item.classroom, item.college, item.teacher]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(kw)) return false
    }

    return true
  })
})

const total = computed(() => filteredData.value.length)

const pagedData = computed<SupervisionRecord[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  updateFilter(createInitialSupervisionFilter())
  currentPage.value = 1
}

const handleRowClick = (row: SupervisionRecord) => {
  emit('rowClick', row)
}

const formatStatus = (status: SupervisionStatus) => supervisionStatusMap[status]
const formatPeriodTime = (periodLabel: string) => getPeriodTime(periodLabel)
</script>

<template>
  <div class="supervision-list">
    <slot :tabs="tabs" :active-tab="activeTab" :handle-tab-change="handleTabChange" />

    <div class="filter-bar">
      <div class="filter-field">
        <span class="filter-label">课程时间</span>
        <el-select
          :model-value="filterState.period"
          placeholder="请选择"
          clearable
          class="form-select"
          @update:model-value="(val: string | undefined) => updateField('period', val ?? '')"
        >
          <el-option
            v-for="opt in supervisionPeriodOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>

      <div class="filter-field">
        <span class="filter-label">课程类型</span>
        <el-select
          :model-value="filterState.courseType"
          placeholder="请选择"
          clearable
          class="form-select"
          @update:model-value="(val: string | undefined) => updateField('courseType', val ?? '')"
        >
          <el-option
            v-for="opt in supervisionCourseTypeOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>

      <div v-if="showDatePicker" class="filter-field">
        <span class="filter-label">课程日期</span>
        <el-date-picker
          :model-value="filterState.dateRange"
          type="daterange"
          single-panel
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          clearable
          class="filter-date"
          @update:model-value="(val: [string, string] | null) => updateField('dateRange', val)"
        />
      </div>

      <div class="filter-field">
        <el-input
          :model-value="filterState.keyword"
          placeholder="请输入课程、教室、学院、教师名称"
          clearable
          class="form-input"
          @update:model-value="(val: string | undefined) => updateField('keyword', val ?? '')"
          @keyup.enter="handleSearch"
        />
      </div>

      <div class="filter-actions">
        <button class="btn-primary" @click="handleSearch">搜索</button>
        <button class="btn-plain" @click="handleReset">
          <el-icon><RefreshLeft /></el-icon>
          <span>重置</span>
        </button>
      </div>
    </div>

    <div class="table-wrap">
      <el-table
        :data="pagedData"
        stripe
        height="100%"
        @row-click="handleRowClick"
      >
        <template #empty>
          <div class="empty-state">
            <img :src="emptyIcon" alt="暂无数据" class="empty-icon" />
            <span>暂无数据</span>
          </div>
        </template>
        <el-table-column prop="course" label="课程" min-width="120" />
        <el-table-column prop="classroom" label="教室" min-width="110" />
        <el-table-column prop="classroomType" label="教室类型" min-width="120" />
        <el-table-column prop="college" label="学院" min-width="130" />
        <el-table-column prop="teacher" label="教员" min-width="100" />
        <el-table-column label="课程时间" min-width="130">
          <template #default="{ row }">
            <span>{{ formatPeriodTime(row.period) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上课状态" min-width="110">
          <template #default="{ row }">
            <div :class="['status-badge', `status-${row.status}`]">
              <img v-if="row.status === 'ongoing'" :src="ongoingIcon" class="status-icon" />
              <img v-if="row.status === 'finished'" :src="finishedIcon" class="status-icon" />
              <span>{{ formatStatus(row.status).label }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="pageSizes"
      @update:current-page="(val) => currentPage = val"
      @update:page-size="(val) => { pageSize = val; currentPage = 1 }"
    />
  </div>
</template>

<script lang="ts">
export default { name: 'SupervisionList' }
</script>

<style scoped>
.supervision-list {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.filter-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  width: 56px;
  height: 20px;
  font-size: 14px;
  font-weight: normal;
  color: #191C1E;
  white-space: nowrap;
}

.form-select {
  width: 240px;
}

.filter-date {
  width: 240px;
}

.form-input {
  width: 240px;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.table-wrap {
  flex: 1;
  min-height: 0;
  border-radius: 12px;
  overflow: hidden;
  background: transparent;
}

.table-wrap :deep(.el-table) {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-row-hover-bg-color: transparent;
  --el-fill-color-lighter: transparent;
  background: transparent;
}

.table-wrap :deep(.el-table__inner-wrapper::before) {
  display: none;
}

/* 表头 */
.table-wrap :deep(.el-table__header-wrapper) {
  border-radius: 8px 0 0 0;
  background: rgba(255, 255, 255, 0.6);
}

.table-wrap :deep(.el-table__header-wrapper th) {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.88);
  text-align: left;
  background: transparent;
  box-shadow: inset 0 -1px 0 0 #E5E7EB;
}

/* 表格正文 */
.table-wrap :deep(.el-table__body-wrapper) {
  background: transparent;
}

.table-wrap :deep(.el-table__body-wrapper tr) {
  background: transparent;
  height: 60px;
}

.table-wrap :deep(.el-table__body-wrapper td) {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.88);
  background: transparent;
}

.table-wrap :deep(.el-table__body-wrapper tr:hover > td) {
  background: #f9fdff;
  box-shadow: inset 0 -1px 0 0 #E5E7EB;
}

/* 状态徽章 */
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
}

.status-pending {
  width: 66px;
  background: #F1F5F9;
  color: rgba(0, 0, 0, 0.88);
}

.status-finished {
  width: 92px;
  background: #E1ECFF;
  color: #1947FF;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 0;
}

.empty-icon {
  width: 80px;
  height: 80px;
}
</style>
