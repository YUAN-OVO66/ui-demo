<script setup lang="ts">
import IconClose from '@/assets/layout/icon-05.svg'

const props = defineProps<{
  modelValue: boolean
  title: string
  content?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    class="message-detail-dialog"
    :show-close="false"
    :close-on-click-modal="true"
    overlay-class="dialog-overlay"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">消息详情</span>
        <button class="close-btn" @click="handleClose">
          <img :src="IconClose" class="close-icon" />
        </button>
      </div>
    </template>

    <div class="form-card">
      <h3 class="detail-title">{{ title }}</h3>
      <div class="detail-content">
        <p>{{ content || '暂无更多详情内容。' }}</p>
      </div>
    </div>

    <div class="dialog-footer">
      <el-button class="btn-view" @click="handleClose">查看</el-button>
    </div>

    <template #footer><span /></template>
  </el-dialog>
</template>

<style scoped lang="scss">
.form-card {
  height: 426px;
  border-radius: var(--radius-lg);
  background: var(--color-bg-white);
  margin: 0 5px;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: auto;
}

.detail-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-deep);
  margin: 0 0 16px;
}

.detail-content {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.detail-content p {
  margin: 0;
}

.dialog-footer {
  margin-top: auto;
}

.btn-view {
  width: 60px;
  height: 36px;
  font-size: 14px;
  color: var(--color-text-invert);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-sm);
}
</style>

<style lang="scss">
.message-detail-dialog.el-dialog {
  width: 520px;
  height: 560px;
  border-radius: var(--radius-full);
  background:
    url('@/assets/layout/bg-02.png') no-repeat top center / 100% auto,
    var(--color-primary-bg-light);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.message-detail-dialog .el-dialog__header {
  padding: 20px 24px;
  margin-right: 0;
}

.message-detail-dialog .el-dialog__body {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.message-detail-dialog .el-dialog__footer {
  padding: 0;
}
</style>
