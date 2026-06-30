<script setup lang="ts">
import { ref } from 'vue'
import DefaultAvatar from '@/assets/layout/avatar-01.png'
import IconFeedback from '@/assets/layout/icon-01.svg'
import IconBell from '@/assets/layout/icon-02.svg'
import IconSwitch from '@/assets/layout/icon-03.svg'
import IconLogout from '@/assets/layout/icon-04.svg'
import FeedbackDialog from '@/components/dialog/FeedbackDialog.vue'
import MessagePopover from '@/components/layout/MessagePopover.vue'

const showRoleDropdown = ref(false)
const currentRole = ref('管理员')
const hasUnread = ref(true)
const showFeedback = ref(false)
const showMessagePopover = ref(false)
</script>

<template>
  <div class="top-nav">
    <div class="nav-right">
      <!-- 意见反馈 -->
      <el-tooltip content="意见反馈" placement="bottom">
        <el-button circle class="nav-btn" @click="showFeedback = true">
          <img :src="IconFeedback" class="nav-icon" />
        </el-button>
      </el-tooltip>

      <!-- 意见反馈弹窗 -->
      <FeedbackDialog v-model="showFeedback" />
      <!-- 消息通知 -->
      <el-popover
        v-model:visible="showMessagePopover"
        placement="bottom-end"
        :show-arrow="false"
        trigger="click"
        :width="400"
        popper-class="message-popover-popper"
      >
        <template #reference>
          <el-button circle class="nav-btn">
            <div class="notification-wrapper">
              <img :src="IconBell" class="nav-icon" />
              <span v-if="hasUnread" class="unread-dot"></span>
            </div>
          </el-button>
        </template>
        <MessagePopover v-model:hasUnread="hasUnread" />
      </el-popover>
      <!-- 分隔线 -->
      <div class="divider"></div>
      <!-- 用户头像 + 名称 -->
      <div class="user-info">
        <el-avatar :src="DefaultAvatar" :size="44" fit="cover" class="avatar" />
        <span class="username">admin</span>
      </div>
      <!-- 角色切换 -->
      <el-tooltip content="点击切换角色" placement="bottom">
        <div class="role-switch" @click="showRoleDropdown = !showRoleDropdown">
          <span class="role-text">{{ currentRole }}</span>
          <img :src="IconSwitch" class="switch-icon" />
        </div>
      </el-tooltip>
      <!-- 退出登录 -->
      <el-tooltip content="退出登录" placement="bottom">
        <el-button text class="logout-btn">
          <img :src="IconLogout" class="nav-icon" />
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.top-nav {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn {
  width: 44px;
  height: 44px;
  background: var(--color-bg-page-strong);
  border: 1px solid var(--color-border-soft);
  box-shadow: var(--shadow-card);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.notification-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.unread-dot {
  position: absolute;
  top: 0.1px;
  right: 0.1px;
  width: 10px;
  height: 10px;
  background: var(--color-unread);
  border: 2px solid var(--color-bg-tint);
  border-radius: 50%;
}

.switch-icon {
  width: 16px;
  height: 16px;
}

.divider {
  width: 1px;
  height: 30px;
  opacity: 0.5;
  background: rgba(105, 123, 169, 0.4);
  margin: 0 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.avatar {
  border: 1px solid var(--color-border-soft);
}

.role-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 110px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-bg-page-strong);
  border: 1px solid var(--color-border-soft);
  cursor: pointer;
  transition: background var(--transition-base), border-color var(--transition-base);
}

.role-switch:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-card);
}

.role-text {
  font-size: 14px;
  font-weight: 500;
}

.logout-btn.el-button {
  width: 44px;
  height: 44px;
  padding: 0;
  background: transparent;
  border: none;
}

.logout-btn.el-button:hover,
.logout-btn.el-button:focus {
  color: var(--color-danger);
  background: transparent;
  border: none;
}
</style>

<style lang="scss">
.el-popover.el-popper.message-popover-popper {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.el-popover.el-popper.message-popover-popper .el-popover__arrow {
  display: none;
}
</style>
