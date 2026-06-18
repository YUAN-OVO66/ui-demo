<script setup lang="ts">
import { ref, computed } from 'vue'
import IconUnread from '@/assets/layout/icon-06.svg'
import IconRead from '@/assets/layout/icon-07.svg'
import { notificationList } from '@/data/mockData'
import MessageDetailDialog from '@/components/dialog/MessageDetailDialog.vue'

const props = defineProps<{ hasUnread?: boolean }>()
const emit = defineEmits<{
  readAll: [tab: string]
  'update:hasUnread': [value: boolean]
}>()

const activeTab = ref('message')

const tabs = [
  { key: 'message', label: '消息' },
  { key: 'todo', label: '待办' },
  { key: 'done', label: '已办' },
]

const messageList = ref(notificationList.map(item => ({ ...item })))
const showDetail = ref(false)
const selectedTitle = ref('')
const selectedContent = ref('')

const currentList = computed(() => {
  switch (activeTab.value) {
    case 'message': return messageList.value
    case 'todo': return messageList.value.filter(item => !item.isRead)
    case 'done': return messageList.value.filter(item => item.isRead)
    default: return []
  }
})

function handleReadAll() {
  messageList.value.forEach(item => { item.isRead = true })
  emit('readAll', activeTab.value)
  emit('update:hasUnread', false)
}

function handleItemClick(item: { title: string; isRead: boolean; content: string }) {
  item.isRead = true
  selectedTitle.value = item.title
  selectedContent.value = item.content
  showDetail.value = true
  if (!messageList.value.some(m => !m.isRead)) {
    emit('update:hasUnread', false)
  }
}
</script>

<template>
  <div class="message-popover">
    <!-- Tabs -->
    <div class="popover-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <span class="tab-label">{{ tab.label }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="popover-content">
      <template v-if="currentList.length">
        <div
          v-for="(item, index) in currentList"
          :key="index"
          class="content-item"
          @click="handleItemClick(item)"
        >
          <div class="item-icon" :class="{ 'is-read': item.isRead }">
            <img :src="item.isRead ? IconRead : IconUnread" class="icon-img" />
            <span v-if="!item.isRead" class="unread-dot"></span>
          </div>
          <span class="item-title">{{ item.title }}</span>
        </div>
      </template>
      <div v-else class="empty-state">
        <span>暂无数据</span>
      </div>
    </div>

    <!-- 分割线 + 一键已读 -->
    <div class="popover-bottom">
      <div class="read-all" @click="handleReadAll">
        <span>一键已读</span>
      </div>
    </div>

    <!-- 消息详情弹窗 -->
    <MessageDetailDialog v-model="showDetail" :title="selectedTitle" :content="selectedContent" />
  </div>
</template>

<style scoped>
.message-popover {
  width: 400px;
  height: 392px;
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  background: #FFFFFF;
  box-shadow: 0px 10px 30px 0px rgba(190, 198, 223, 0.4);
}

.popover-tabs {
  display: flex;
  padding: 16px 20px 0;
  gap: 24px;
  border-bottom: 1px solid var(--color-border, rgba(105, 123, 169, 0.15));
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 0 4px 12px;
  cursor: pointer;
  position: relative;
  color: #86909C;
  transition: color 0.2s;
}

.tab-item:hover {
  color: #4E5969;
}

.tab-item.active {
  color: var(--color-primary, #3D7EFF);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary, #3D7EFF);
  border-radius: 1px;
}

.tab-label {
  font-size: 14px;
  font-weight: 500;
}

.popover-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
}

.content-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  cursor: pointer;
}

.content-item:hover .item-title {
  color: var(--color-primary, #3D7EFF);
}

.item-icon {
  position: relative;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #E9EFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-img {
  width: 16px;
  height: 16px;
  display: block;
}

.unread-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background: #E30000;
  border: 2px solid #FFFFFF;
  border-radius: 50%;
}

.item-icon.is-read::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
}

.item-title {
  font-size: 14px;
  color: #000000;
  transition: color 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 196px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #C9CDD4;
  font-size: 14px;
}

.popover-bottom {
  flex-shrink: 0;
  padding: 0 20px 12px;
  border-top: 1px solid var(--color-border, rgba(105, 123, 169, 0.15));
}

.read-all {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  cursor: pointer;
  font-family: 'PingFang SC', '苹方', sans-serif;
  font-size: 12px;
  font-weight: normal;
  color: #8C8C8C;
  border-radius: var(--radius-sm, 4px);
  transition: color 0.2s;
}

.read-all:hover {
  color: #595959;
}
</style>
