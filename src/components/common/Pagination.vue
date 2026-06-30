<script setup lang="ts">
defineOptions({ name: 'Pagination' })

const props = withDefaults(
  defineProps<{
    currentPage: number
    pageSize: number
    total: number
    pageSizes?: number[]
    pagerCount?: number
  }>(),
  {
    pageSizes: () => [10, 20, 50, 100],
    pagerCount: 5
  }
)

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'update:pageSize', value: number): void
}>()

const handlePageChange = (page: number) => {
  emit('update:currentPage', page)
}

const handlePageSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('update:currentPage', 1)
}
</script>

<template>
  <div class="pagination-bar">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
      @size-change="handlePageSizeChange"
    />
  </div>
</template>

<style scoped lang="scss">
.pagination-bar {
  display: flex;
  justify-content: flex-end;
}

.pagination-bar :deep(.el-pagination) {
  font-size: 14px;
  line-height: 14px;
  color: var(--color-text-secondary);
}

.pagination-bar :deep(.el-pagination *) {
  font-size: 14px;
  line-height: 14px;
  color: var(--color-text-secondary);
}

/* 选中页码 - 无背景，颜色 #1947FF */
.pagination-bar :deep(.el-pager li.is-active) {
  background: transparent;
  color: var(--color-primary);
  font-weight: normal;
}

.pagination-bar :deep(.el-pager li) {
  background: transparent;
}

/* 左右翻页按钮 */
.pagination-bar :deep(.el-pagination button),
.pagination-bar :deep(.el-pagination .btn-prev),
.pagination-bar :deep(.el-pagination .btn-next) {
  border-radius: var(--radius-sm);
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  width: 28px;
  height: 28px;
  background: transparent;
}

.pagination-bar :deep(.el-select) {
  height: 28px;
}

.pagination-bar :deep(.el-input) {
  width: 60px;
  height: 28px;
}

.pagination-bar :deep(.el-select__wrapper),
.pagination-bar :deep(.el-input__wrapper) {
  border-radius: var(--radius-sm);
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  background: transparent;
  min-height: 28px;
  height: 28px;
}

.pagination-bar :deep(.el-input__wrapper) {
  width: 60px;
}
</style>
