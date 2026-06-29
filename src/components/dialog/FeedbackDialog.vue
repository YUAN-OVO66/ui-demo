<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import { ElMessage } from 'element-plus'
import IconClose from '@/assets/layout/icon-05.svg'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const feedbackType = ref('')
const isAnonymous = ref(false)

const editor = useEditor({
  extensions: [StarterKit, Underline, Image, Highlight],
  content: '',
  editorProps: {
    attributes: {
      class: 'tiptap-editor-inner'
    }
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const feedbackTypes = [
  { label: '功能建议', value: 'suggestion' },
  { label: 'BUG反馈', value: 'bug' },
  { label: '体验优化', value: 'experience' },
  { label: '其他', value: 'other' }
]

const toolbarItems = [
  { key: 'undo', icon: '↩', title: '撤销', action: () => editor.value?.chain().focus().undo().run() },
  { key: 'redo', icon: '↪', title: '重做', action: () => editor.value?.chain().focus().redo().run() },
  { key: 'divider1' },
  { key: 'heading', icon: 'H', title: '标题', action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(), active: () => editor.value?.isActive('heading', { level: 2 }) },
  { key: 'bold', icon: 'B', title: '加粗', action: () => editor.value?.chain().focus().toggleBold().run(), active: () => editor.value?.isActive('bold') },
  { key: 'italic', icon: 'I', title: '斜体', action: () => editor.value?.chain().focus().toggleItalic().run(), active: () => editor.value?.isActive('italic') },
  { key: 'underline', icon: 'U', title: '下划线', action: () => editor.value?.chain().focus().toggleUnderline().run(), active: () => editor.value?.isActive('underline') },
  { key: 'strike', icon: 'S', title: '删除线', action: () => editor.value?.chain().focus().toggleStrike().run(), active: () => editor.value?.isActive('strike') },
  { key: 'highlight', icon: '🖍', title: '高亮', action: () => editor.value?.chain().focus().toggleHighlight().run(), active: () => editor.value?.isActive('highlight') },
  { key: 'divider2' },
  { key: 'bulletList', icon: '•', title: '无序列表', action: () => editor.value?.chain().focus().toggleBulletList().run(), active: () => editor.value?.isActive('bulletList') },
  { key: 'orderedList', icon: '1.', title: '有序列表', action: () => editor.value?.chain().focus().toggleOrderedList().run(), active: () => editor.value?.isActive('orderedList') },
  { key: 'blockquote', icon: '❝', title: '引用', action: () => editor.value?.chain().focus().toggleBlockquote().run(), active: () => editor.value?.isActive('blockquote') },
  { key: 'codeBlock', icon: '⟨⟩', title: '代码块', action: () => editor.value?.chain().focus().toggleCodeBlock().run(), active: () => editor.value?.isActive('codeBlock') },
  { key: 'divider3' },
  { key: 'image', icon: '🖼', title: '插入图片', action: () => {
    const input = window.prompt('请输入图片地址（仅支持 http:// 或 https://）')
    if (!input) return
    const url = input.trim()
    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      ElMessage.warning('请输入合法的图片地址')
      return
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      ElMessage.warning('仅支持 http:// 或 https:// 协议的图片')
      return
    }
    editor.value?.chain().focus().setImage({ src: parsed.href }).run()
  }},
]

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
    class="feedback-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    overlay-class="dialog-overlay"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">意见反馈</span>
        <button class="close-btn" @click="handleClose">
          <img :src="IconClose" class="close-icon" />
        </button>
      </div>
    </template>

    <div class="form-card">
      <div class="feedback-body">
        <div class="form-item">
          <label class="form-label">反馈类型</label>
          <el-select v-model="feedbackType" placeholder="请选择反馈类型" class="type-select">
            <el-option
              v-for="item in feedbackTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div class="form-item editor-item">
          <label class="form-label">问题描述</label>
          <div class="editor-wrapper">
            <div class="editor-toolbar">
              <template v-for="item in toolbarItems" :key="item.key">
                <div v-if="item.key.startsWith('divider')" class="toolbar-divider" />
                <button
                  v-else
                  class="toolbar-btn"
                  :class="{ active: item.active?.() }"
                  :title="item.title"
                  @click="item.action"
                ><span>{{ item.icon }}</span></button>
              </template>
            </div>
            <EditorContent class="editor-content" :editor="editor" />
          </div>
        </div>

        <div class="form-item">
          <label class="form-label">匿名</label>
          <el-radio-group v-model="isAnonymous">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="dialog-footer">
        <el-button class="btn-primary" @click="handleSubmit">提交</el-button>
      </div>
    </div>

    <template #footer><span /></template>
  </el-dialog>
</template>

<style scoped lang="scss">
.form-card {
  width: 480px;
  flex: 1;
  min-height: 0;
  border-radius: var(--radius-lg);
  background: var(--color-bg-white);
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;
}

.feedback-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.type-select {
  width: 180px;
}

:deep(.type-select .el-input__wrapper) {
  height: 36px;
  border-radius: 6px;
  background: var(--color-bg-white);
  border: 1px solid var(--color-border-light);
  box-shadow: none;
}

:deep(.type-select .el-input__wrapper:hover),
:deep(.type-select .el-input__wrapper.is-focus) {
  border-color: var(--color-border-light);
  box-shadow: none;
}

.editor-item {
  flex: 1;
  min-height: 0;
}

.editor-wrapper {
  width: 440px;
  flex: 1;
  min-height: 0;
  border-radius: 6px;
  background: var(--color-bg-white);
  border: 1px solid var(--color-border-light);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  border-bottom: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.toolbar-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  padding: 0;
}

.toolbar-btn:hover {
  background: #F0F0F0;
  color: #333;
}

.toolbar-btn.active {
  background: #E8F0FE;
  color: var(--color-primary-soft);
}

.toolbar-divider {
  width: 1px;
  height: 18px;
  background: #E0E0E0;
  margin: 0 4px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
}

:deep(.tiptap-editor-inner) {
  padding: 8px 12px;
  outline: none;
  min-height: 100%;
  font-size: 14px;
  line-height: 1.6;
}

:deep(.tiptap-editor-inner p) {
  margin: 0 0 8px;
}

:deep(.tiptap-editor-inner ul),
:deep(.tiptap-editor-inner ol) {
  padding-left: 20px;
  margin: 0 0 8px;
}

:deep(.tiptap-editor-inner:focus) {
  outline: none;
}

:deep(.tiptap-editor-inner blockquote) {
  border-left: 3px solid var(--color-primary-soft);
  margin: 0 0 8px;
  padding-left: 12px;
  color: #666;
}

:deep(.tiptap-editor-inner pre) {
  background: #F5F5F5;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 0 0 8px;
  font-family: monospace;
  font-size: 13px;
  overflow-x: auto;
}

:deep(.tiptap-editor-inner code) {
  background: #F0F0F0;
  border-radius: 3px;
  padding: 2px 4px;
  font-family: monospace;
  font-size: 13px;
}

:deep(.tiptap-editor-inner mark) {
  background: #FFF3B0;
  border-radius: 2px;
  padding: 0 2px;
}

.dialog-footer {
  padding: 0;
}
</style>

<style lang="scss">
/* 非 scoped — 穿透 append-to-body 的 el-dialog */
.feedback-dialog.el-dialog {
  width: 520px;
  height: 580px;
  background:
    url('@/assets/layout/bg-02.png') no-repeat top center / 100% auto,
    #EEEEEF;
  border-radius: var(--radius-full);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.feedback-dialog .el-dialog__header {
  padding: 20px 24px;
  margin-right: 0;
}

.feedback-dialog .el-dialog__body {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.feedback-dialog .el-dialog__footer {
  padding: 0;
}
</style>
