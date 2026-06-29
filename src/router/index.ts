import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', redirect: '/home' },
        { path: 'home', name: 'home', component: () => import('@/views/Home/index.vue'), meta: { title: '首页' } },
        { path: 'teachers', name: 'teachers', component: () => import('@/views/Teachers/index.vue'), meta: { title: '教学督导' } },
        { path: 'patrol', name: 'patrol', component: () => import('@/views/Patrol/index.vue'), meta: { title: '教室巡课' } },
        { path: 'classroom-live/:id', name: 'classroom-live', component: () => import('@/views/ClassroomLive/index.vue'), meta: { title: '实时巡课' } },
        { path: 'building', name: 'building', component: () => import('@/views/evaluation/Building/index.vue'), meta: { title: '模板管理' } },
        { path: 'practice', name: 'practice', component: () => import('@/views/evaluation/Practice/index.vue'), meta: { title: '分类管理' } },
        { path: 'usage', name: 'usage', component: () => import('@/views/evaluation/Usage/index.vue'), meta: { title: '指标管理' } },
        { path: 'class-mgmt', name: 'class-mgmt', component: () => import('@/views/evaluation/ClassMgmt/index.vue'), meta: { title: '选项管理' } },
        { path: 'report', name: 'report', component: () => import('@/views/evaluation/Report/index.vue'), meta: { title: '评价报表' } },
        { path: 'class-eval', name: 'class-eval', component: () => import('@/views/evaluation/ClassEval/index.vue'), meta: { title: '评价记录' } },
        { path: 'patrol-records', name: 'patrol-records', component: () => import('@/views/PatrolRecords/index.vue'), meta: { title: '巡课记录' } },
        { path: 'patrol-stats', name: 'patrol-stats', component: () => import('@/views/PatrolStats/index.vue'), meta: { title: '巡视数据' } },
        { path: 'review-records', name: 'review-records', component: () => import('@/views/ReviewRecords/index.vue'), meta: { title: '留言记录' } },
        { path: 'teacher-eval', name: 'teacher-eval', component: () => import('@/views/TeacherEval/index.vue'), meta: { title: '教学回看' } },
        { path: ':pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound/index.vue'), meta: { title: '页面未找到' } }
      ]
    }
  ]
})

export default router
