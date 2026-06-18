<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import IconClose from '@/assets/layout/icon-05.svg'
import {
  evaluateTemplates,
  type EvaluateTemplate
} from '@/data/mockData'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const activeTemplateId = ref('classroom')
const formData = ref<Record<string, any>>({})

const activeTemplate = computed<EvaluateTemplate | undefined>(() =>
  evaluateTemplates.find((t) => t.id === activeTemplateId.value)
)

/* 打开弹窗时默认选中课堂评价 */
watch(() => props.modelValue, (visible) => {
  if (visible) activeTemplateId.value = 'classroom'
})

/* 切换模板时重置表单，为各控件设置合理的初始值 */
watch(activeTemplateId, () => {
  const defaults: Record<string, any> = {}
  if (activeTemplate.value) {
    for (const section of activeTemplate.value.sections) {
      for (const item of section.items) {
        defaults[item.key] = item.type === 'checkbox' ? [] : item.type === 'number' ? undefined : ''
      }
    }
  }
  formData.value = defaults
})

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  // TODO: 提交逻辑
  handleClose()
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="520px"
    class="evaluate-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    overlay-class="dialog-overlay"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">在线评价</span>
        <button class="close-btn" @click="handleClose">
          <img :src="IconClose" class="close-icon" />
        </button>
      </div>
    </template>

    <div class="form-card">
      <!-- 模板选择下拉框 -->
      <div class="template-select-row">
        <label class="template-label">评价模板</label>
        <el-select
          v-model="activeTemplateId"
          placeholder="请选择教学模板"
          class="template-select"
        >
          <el-option
            v-for="t in evaluateTemplates"
            :key="t.id"
            :label="t.label"
            :value="t.id"
          />
        </el-select>
      </div>

      <!-- 模板渲染卡片 -->
      <div v-if="activeTemplate" class="template-card">
        <div
          v-for="(section, sIdx) in activeTemplate.sections"
          :key="sIdx"
          class="template-section"
        >
          <div class="section-title">{{ section.title }}</div>

          <div
            v-for="item in section.items"
            :key="item.key"
            class="section-item"
          >
            <label class="item-label">
              <span v-if="item.required" class="required-mark">*</span>
              {{ item.label }}
            </label>

            <!-- 文本输入 -->
            <el-input
              v-if="item.type === 'input'"
              v-model="formData[item.key]"
              :placeholder="item.placeholder"
              class="item-input"
            />

            <!-- 数字输入 -->
            <el-input-number
              v-else-if="item.type === 'number'"
              v-model="formData[item.key]"
              :placeholder="item.placeholder"
              :min="0"
              class="item-number"
            />

            <!-- 下拉选择 -->
            <el-select
              v-else-if="item.type === 'select'"
              v-model="formData[item.key]"
              :placeholder="item.placeholder"
              class="item-select"
            >
              <el-option
                v-for="opt in item.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>

            <!-- 单选 -->
            <el-radio-group
              v-else-if="item.type === 'radio'"
              v-model="formData[item.key]"
              class="item-radio"
            >
              <el-radio
                v-for="opt in item.options"
                :key="opt.value"
                :value="opt.value"
              >{{ opt.label }}</el-radio>
            </el-radio-group>

            <!-- 多选 -->
            <el-checkbox-group
              v-else-if="item.type === 'checkbox'"
              v-model="formData[item.key]"
              class="item-checkbox"
            >
              <el-checkbox
                v-for="opt in item.options"
                :key="opt.value"
                :value="opt.value"
              >{{ opt.label }}</el-checkbox>
            </el-checkbox-group>

            <!-- 评分 -->
            <el-rate
              v-else-if="item.type === 'rate'"
              v-model="formData[item.key]"
              class="item-rate"
            />

            <!-- 文本域 -->
            <el-input
              v-else-if="item.type === 'textarea'"
              v-model="formData[item.key]"
              type="textarea"
              :placeholder="item.placeholder"
              class="item-textarea"
            />
          </div>
        </div>
      </div>

      <!-- 未选择模板占位 -->
      <div v-else class="template-placeholder">
        <span class="placeholder-text">请先选择教学模板</span>
      </div>
    </div>

    <!-- 底部按钮（form-card 外部） -->
    <div class="dialog-footer">
      <el-button class="btn-plain" @click="handleClose">取消</el-button>
      <el-button class="btn-primary" :disabled="!activeTemplate" @click="handleSubmit">提交</el-button>
    </div>

    <template #footer><span /></template>
  </el-dialog>
</template>

<style scoped>
.form-card {
  width: 480px;
  flex: 1;
  min-height: 0;
  border-radius: 12px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;
}

/* 模板选择行 */
.template-select-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.template-label {
  font-size: 14px;
  font-weight: 500;
  color: #191C1E;
  white-space: nowrap;
}

.template-select {
  width: 260px;
  height: 36px;
  border-radius: 6px;
  background: #FFFFFF;
  box-sizing: border-box;

}

:deep(.template-select .el-input__wrapper) {
  height: 36px;
  border-radius: 6px;
  background: #FFFFFF;
  border: 1px solid #E7E7E9;
  box-shadow: none;
}

:deep(.template-select .el-input__wrapper:hover),
:deep(.template-select .el-input__wrapper.is-focus) {
  border-color: #E7E7E9;
  box-shadow: none;
}

/* 模板渲染卡片 */
.template-card {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
}

.template-card::-webkit-scrollbar {
  display: none;
}

/* 每个 section 独立卡片，背景 #F5F6FA */
.template-section {
  padding: 16px;
  border-radius: 10px;
  background: #F5F6FA;
  margin-bottom: 12px;
}

.template-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #191C1E;
  margin-bottom: 14px;
}

.section-title::before {
  content: '';
  width: 3px;
  height: 14px;
  border-radius: 8px;
  background: #1947FF;
  flex-shrink: 0;
}

.section-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.section-item:last-child {
  margin-bottom: 0;
}

.item-label {
  font-size: 14px;
  font-weight: 500;
  color: #191C1E;
}

.required-mark {
  color: #F56C6C;
  margin-right: 4px;
}

.item-rate :deep(.el-rate__icon) {
  font-size: 22px;
}

.item-select {
  width: 180px;
}

:deep(.item-select .el-input__wrapper) {
  height: 36px;
  border-radius: 6px;
  background: #FFFFFF;
  border: 1px solid #E7E7E9;
  box-shadow: none;
}

:deep(.item-select .el-input__wrapper:hover),
:deep(.item-select .el-input__wrapper.is-focus) {
  border-color: #E7E7E9;
  box-shadow: none;
}

.item-textarea :deep(.el-textarea__inner) {
  min-height: 80px;
  border-radius: 6px;
  background: #FFFFFF;
  border: 1px solid #E7E7E9;
  box-shadow: none;
  resize: none;
  font-size: 14px;
  line-height: 1.6;
}

.item-input {
  width: 280px;
}

:deep(.item-input .el-input__wrapper) {
  height: 36px;
  border-radius: 6px;
  background: #FFFFFF;
  border: 1px solid #E7E7E9;
  box-shadow: none;
}

:deep(.item-input .el-input__wrapper:hover),
:deep(.item-input .el-input__wrapper.is-focus) {
  border-color: #E7E7E9;
  box-shadow: none;
}

.item-number {
  width: 180px;
}

:deep(.item-number .el-input__wrapper) {
  height: 36px;
  border-radius: 6px;
  background: #FFFFFF;
  border: 1px solid #E7E7E9;
  box-shadow: none;
}

:deep(.item-number .el-input__wrapper:hover),
:deep(.item-number .el-input__wrapper.is-focus) {
  border-color: #E7E7E9;
  box-shadow: none;
}

.item-radio {
  display: flex;
  gap: 16px;
}

.item-checkbox {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.item-textarea :deep(.el-textarea__inner:focus) {
  border-color: #E7E7E9;
  box-shadow: none;
}

/* 未选择占位 */
.template-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 14px;
  color: #B7BBC2;
}

/* 底部 */
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-shrink: 0;
  padding: 16px 0;
}

/* 弹窗头部 */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.close-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  width: 20px;
  height: 20px;
}

.dialog-title {
  font-family: '苹方', 'PingFang SC', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  letter-spacing: normal;
  color: #FFFFFF;
}
</style>

<style>
/* 非 scoped — 穿透 append-to-body 的 el-dialog */
.evaluate-dialog.el-dialog {
  width: 520px;
  height: 878px;
  background:
    url('@/assets/layout/bg-02.png') no-repeat top center / 100% auto,
    #E7F2FF;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.evaluate-dialog .el-dialog__header {
  padding: 20px 24px;
  margin-right: 0;
}

.evaluate-dialog .el-dialog__body {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.evaluate-dialog .el-dialog__footer {
  padding: 0;
}

.dialog-overlay {
  background: rgba(0, 0, 0, 0.6);
}
</style>
