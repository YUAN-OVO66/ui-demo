<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { House, User, Location, Document, DocumentCopy, PieChart, Folder, Star } from '@element-plus/icons-vue'
import { menuConfig } from '@/config/menu'

const router = useRouter()
const route = useRoute()

const iconMap: Record<string, any> = {
  house: House,
  user: User,
  location: Location,
  document: Document,
  'document-copy': DocumentCopy,
  'pie-chart': PieChart,
  folder: Folder,
  star: Star
}

const activeMenu = computed(() => {
  const path = route.path.replace(/^\//, '')
  return path || 'home'
})
</script>

<template>
  <el-aside width="220px" class="sidebar" style="box-sizing: border-box;">
    <el-menu :default-active="activeMenu" class="menu" background-color="transparent" text-color="#333" active-text-color="#FFFFFF">
      <template v-for="item in menuConfig" :key="item.id">
        <el-sub-menu v-if="item.children" :index="item.id" popper-class="submenu-popper">
          <template #title>
            <el-icon><component :is="iconMap[item.icon]" /></el-icon>
            <span>{{ item.label }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.id"
            :index="child.id"
            @click="router.push(`/${child.id}`)"
          >
            {{ child.label }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.id" @click="router.push(`/${item.id}`)">
          <el-icon><component :is="iconMap[item.icon]" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<style scoped>
.sidebar {
  height: 100%;
  background: transparent;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.menu {
  border: none;
  background: transparent;
}

:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  width: 100%;
  max-width: 180px;
  height: 44px;
  border-radius: 8px;
  background-color: transparent;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

:deep(.el-sub-menu__title > span) {
  flex: 1;
}

:deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
  position: static;
  margin: 0;
  flex-shrink: 0;
}

:deep(.el-sub-menu .el-menu) {
  background-color: transparent;
}

:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  opacity: 0.9;
  background-color: #1947FF;
  box-shadow: 0px 6px 16px 0px rgba(0, 71, 255, 0.3);
  color: #FFFFFF;
}

:deep(.el-sub-menu__title:hover .el-icon),
:deep(.el-menu-item:hover .el-icon) {
  color: #FFFFFF;
}

:deep(.el-menu-item.is-active) {
  border-radius: 8px;
  background-color: #0F3DF4;
  box-shadow: 0px 6px 16px 0px rgba(0, 71, 255, 0.3);
  color: #FFFFFF;
}

:deep(.el-menu-item.is-active .el-icon) {
  color: #FFFFFF;
}
</style>
