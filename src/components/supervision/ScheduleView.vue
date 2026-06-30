<script setup lang="ts">
import { computed, ref } from 'vue'
import { RefreshLeft } from '@element-plus/icons-vue'
import ongoingIcon from '@/assets/supervision/status-ongoing-01.gif'
import finishedIcon from '@/assets/supervision/status-finished-01.svg'
import {
  supervisionPeriodOptions,
  type SupervisionRecord
} from '@/data/mockData'

// 搜索类别选项
const categoryOptions = [
  { value: '教室', label: '教室' },
  { value: '班级', label: '班级' },
  { value: '教员', label: '教员' }
]

const props = withDefaults(
  defineProps<{
    rawRecords: SupervisionRecord[]
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'cellClick', record: SupervisionRecord): void
}>()

// 教室列表选项（从 supervisionTableData 的 classroom 字段去重）
const classroomOptions = computed(() => {
  const seen = new Set<string>()
  const list: { value: string; label: string }[] = []
  props.rawRecords.forEach(item => {
    if (!seen.has(item.classroom)) {
      seen.add(item.classroom)
      list.push({ value: item.classroom, label: item.classroom })
    }
  })
  return list
})

// 当前搜索类别
const searchCategory = ref('教室')

// 搜索值（教室下拉 / 班级输入 / 教员输入）
const searchValue = ref(classroomOptions.value[0]?.value ?? '')

// 当前周的起始日期（星期一）
const currentWeekStart = ref<Date>(getMonday(new Date()))

// 获取本周一的日期
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

// 格式化日期为 YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化日期为显示格式
function formatDateDisplay(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

// 获取星期几的中文
function getWeekdayName(dayIndex: number): string {
  const weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  return weekdays[dayIndex]
}

// 计算本周的7天日期
const weekDates = computed(() => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart.value)
    date.setDate(date.getDate() + i)
    dates.push({
      date,
      dateStr: formatDate(date),
      displayDate: formatDateDisplay(date),
      weekday: getWeekdayName(i)
    })
  }
  return dates
})

// 标题栏显示文本
const titleText = computed(() => searchValue.value || '请选择')

// 表格行只渲染单节次（第一节～第九节）
const singlePeriodOptions = computed(() =>
  supervisionPeriodOptions.filter(opt => !opt.value.includes('-'))
)

// 解析节次标签 → 起始行索引与跨行数
function parsePeriod(label: string): { startIdx: number; span: number } {
  const opt = supervisionPeriodOptions.find(o => o.label === label)
  if (!opt) return { startIdx: -1, span: 1 }
  if (opt.value.includes('-')) {
    const [start, end] = opt.value.split('-').map(Number)
    return { startIdx: start - 1, span: end - start + 1 }
  }
  return { startIdx: Number(opt.value) - 1, span: 1 }
}

interface CourseCell {
  records: SupervisionRecord[]
  span: number
  skip: boolean
}

// 9 行 × 7 列的课程单元格矩阵
const scheduleCells = computed<CourseCell[][]>(() => {
  const rows = singlePeriodOptions.value.length
  const cols = 7
  const cells: CourseCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ records: [], span: 1, skip: false }))
  )

  const kw = searchValue.value.trim().toLowerCase()
  if (!kw) return cells

  const filtered = props.rawRecords.filter(record => {
    if (searchCategory.value === '教室') return record.classroom === searchValue.value
    if (searchCategory.value === '班级') return record.college.toLowerCase().includes(kw)
    if (searchCategory.value === '教员') return record.teacher.toLowerCase().includes(kw)
    return false
  })

  for (const record of filtered) {
    const dayIdx = weekDates.value.findIndex(d => d.dateStr === record.date)
    if (dayIdx < 0) continue
    const { startIdx, span } = parsePeriod(record.period)
    if (startIdx < 0 || startIdx >= rows) continue
    const cappedSpan = Math.min(span, rows - startIdx)
    const cell = cells[startIdx][dayIdx]
    cell.records.push(record)
    if (cappedSpan > cell.span) cell.span = cappedSpan
  }

  // 标记被跨行覆盖的下方单元格;若被覆盖单元格本身有记录,合并到顶部跨行单元格
  for (let p = 0; p < rows; p++) {
    for (let d = 0; d < cols; d++) {
      const cell = cells[p][d]
      if (cell.skip || cell.span <= 1) continue
      for (let pp = p + 1; pp < p + cell.span; pp++) {
        const covered = cells[pp][d]
        if (covered.records.length > 0) {
          cell.records.push(...covered.records)
          covered.records = []
        }
        covered.skip = true
      }
    }
  }

  return cells
})

// 切换到上一周
const goPrevWeek = () => {
  const prev = new Date(currentWeekStart.value)
  prev.setDate(prev.getDate() - 7)
  currentWeekStart.value = prev
}

// 切换到下一周
const goNextWeek = () => {
  const next = new Date(currentWeekStart.value)
  next.setDate(next.getDate() + 7)
  currentWeekStart.value = next
}

// 重置筛选条件
const handleReset = () => {
  searchCategory.value = '教室'
  searchValue.value = classroomOptions.value[0]?.value ?? ''
  currentWeekStart.value = getMonday(new Date())
}

// 切换类别时重置搜索值
const handleCategoryChange = (val: string) => {
  searchCategory.value = val
  searchValue.value = val === '教室' ? (classroomOptions.value[0]?.value ?? '') : ''
}

// 课程卡片配色(按 id 取模,稳定分配,避免同一卡片每次渲染颜色变化)
const courseColorPalette = [
  'course-color-orange',
  'course-color-pink',
  'course-color-blue',
  'course-color-cyan',
  'course-color-yellow'
]

const getCourseColor = (record: SupervisionRecord): string =>
  courseColorPalette[record.id % courseColorPalette.length]
</script>

<template>
  <div class="schedule-view">
    <!-- 顶部控制栏 -->
    <div class="schedule-header">
      <div class="filter-bar">
      <el-select
        :model-value="searchCategory"
        class="form-select"
        @update:model-value="handleCategoryChange"
      >
        <el-option
          v-for="opt in categoryOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>

      <el-select
        v-if="searchCategory === '教室'"
        v-model="searchValue"
        class="form-input"
      >
        <el-option
          v-for="opt in classroomOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <el-input
        v-else
        v-model="searchValue"
        :placeholder="searchCategory === '班级' ? '请输入班级名称' : '请输入教员名称'"
        class="form-input"
      />

      <button class="btn-plain" @click="handleReset">
        <el-icon><RefreshLeft /></el-icon>
        <span>重置</span>
      </button>
      </div>
    </div>

    <!-- 标题 + 周导航 -->
    <div class="schedule-title-bar">
      <button class="week-nav-btn prev" @click="goPrevWeek">
        <span class="arrow">&laquo;</span>
        <span>上一周</span>
      </button>
      <h2 class="schedule-title">{{ titleText }}</h2>
      <button class="week-nav-btn next" @click="goNextWeek">
        <span>下一周</span>
        <span class="arrow">&raquo;</span>
      </button>
    </div>

    <!-- 核心表格容器 -->
    <div class="schedule-container">
      <div class="schedule-grid">
        <!-- 表头 -->
        <div class="grid-header">
          <!-- 左上角：上课时间标签 -->
          <div class="header-cell header-corner">上课时间</div>

          <!-- 日期列标题 -->
          <div
            v-for="(day, index) in weekDates"
            :key="index"
            class="header-cell header-day"
          >
            <div class="day-weekday">{{ day.weekday }}</div>
            <div class="day-date">{{ day.displayDate }}</div>
          </div>
        </div>

        <!-- 表格主体 -->
        <div class="grid-body">
          <!-- 时间列(每节一行) -->
          <div
            v-for="(period, pIdx) in singlePeriodOptions"
            :key="`time-${period.value}`"
            class="time-cell"
            :style="{ gridColumn: 1, gridRow: pIdx + 1 }"
          >
            <div class="period-time">{{ period.time }}</div>
          </div>

          <!-- 课程单元格(9行 × 7列,跨节次单元格通过 grid-row span 跨行) -->
          <template v-for="(period, pIdx) in singlePeriodOptions" :key="`row-${period.value}`">
            <template v-for="dayIdx in 7" :key="`cell-${pIdx}-${dayIdx}`">
              <div
                v-if="!scheduleCells[pIdx][dayIdx - 1].skip"
                class="course-cell"
                :style="{
                  gridColumn: dayIdx + 1,
                  gridRow: `${pIdx + 1} / span ${scheduleCells[pIdx][dayIdx - 1].span}`
                }"
              >
                <div
                  v-for="record in scheduleCells[pIdx][dayIdx - 1].records"
                  :key="record.id"
                  class="course-card"
                  :class="[getCourseColor(record), `status-${record.status}`]"
                  @click="$emit('cellClick', record)"
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
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'ScheduleView' }
</script>

<style scoped lang="scss">
.schedule-view {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}


/* 筛选栏 */
.filter-bar {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* 下拉框 & 输入框宽度 */
.form-select {
  width: 100px;
}

.form-input {
  width: 240px;
}

/* 标题栏 + 周导航 */
.schedule-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--radius-lg);
}

.schedule-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
  flex: 1;
}

.week-nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-slow);
  font-weight: 500;
  border-radius: 6px;
}

.week-nav-btn:hover {
  color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.week-nav-btn .arrow {
  font-size: 16px;
  font-weight: bold;
}

/* 核心表格容器 */
.schedule-container {
  flex: 1;
  min-height: 0;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.schedule-grid {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 表头 */
.grid-header {
  display: grid;
  grid-template-columns: 110px repeat(7, 1fr);
  grid-template-rows: minmax(48px, auto);
  gap: 10px;
  background: transparent;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  margin-bottom: 10px;
}

/* 列标题（日期列） */
.header-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 12px;
  border-radius: var(--radius-md);
  background: var(--color-primary-bg-soft);
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;
  box-sizing: border-box;
  overflow: hidden;
  word-break: break-word;
}

.header-corner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  border-radius: var(--radius-md);
  background: var(--color-primary-bg-soft);
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
}

.header-day {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
}

.day-weekday {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.day-date {
  font-size: 12px;
  color: #666;
  font-weight: 400;
}

/* 表格主体 */
.grid-body {
  flex: 1;
  display: grid;
  grid-template-columns: 110px repeat(7, 1fr);
  grid-template-rows: repeat(9, minmax(100px, 1fr));
  grid-auto-rows: minmax(100px, auto);
  gap: 10px;
  background: transparent;
  overflow: auto;
}

/* 行表头（时间列） */
.time-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 8px;
  border-radius: var(--radius-md);
  background: var(--color-primary-bg-soft);
  box-sizing: border-box;
  overflow: hidden;
}

.period-time {
  font-size: 13px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  font-weight: 500;
}

/* 课程单元格 */
.course-cell {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: background var(--transition-base);
}

.course-cell:hover {
  background: rgba(245, 247, 250, 0.9);
}

/* 课程卡片 */
.course-card {
  position: relative;
  flex: 1;
  min-height: 0;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-slow);
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
