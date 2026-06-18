import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout.vue'
import Home from '@/views/Home.vue'
import Teachers from '@/views/Teachers.vue'
import Patrol from '@/views/Patrol.vue'
import ClassroomLive from '@/views/ClassroomLive.vue'
import Building from '@/views/evaluation/Building.vue'
import Practice from '@/views/evaluation/Practice.vue'
import Usage from '@/views/evaluation/Usage.vue'
import ClassMgmt from '@/views/evaluation/ClassMgmt.vue'
import Report from '@/views/evaluation/Report.vue'
import ClassEval from '@/views/evaluation/ClassEval.vue'
import PatrolRecords from '@/views/PatrolRecords.vue'
import PatrolStats from '@/views/PatrolStats.vue'
import ReviewRecords from '@/views/ReviewRecords.vue'
import TeacherEval from '@/views/TeacherEval.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', redirect: '/home' },
        { path: 'home', name: 'home', component: Home, meta: { title: '首页' } },
        { path: 'teachers', name: 'teachers', component: Teachers, meta: { title: '教学督导' } },
        { path: 'patrol', name: 'patrol', component: Patrol, meta: { title: '教室巡课' } },
        { path: 'classroom-live/:id', name: 'classroom-live', component: ClassroomLive, meta: { title: '实时巡课' } },
        { path: 'building', name: 'building', component: Building, meta: { title: '模板管理' } },
        { path: 'practice', name: 'practice', component: Practice, meta: { title: '分类管理' } },
        { path: 'usage', name: 'usage', component: Usage, meta: { title: '指标管理' } },
        { path: 'class-mgmt', name: 'class-mgmt', component: ClassMgmt, meta: { title: '选项管理' } },
        { path: 'report', name: 'report', component: Report, meta: { title: '评价报表' } },
        { path: 'class-eval', name: 'class-eval', component: ClassEval, meta: { title: '评价记录' } },
        { path: 'patrol-records', name: 'patrol-records', component: PatrolRecords, meta: { title: '巡课记录' } },
        { path: 'patrol-stats', name: 'patrol-stats', component: PatrolStats, meta: { title: '巡视数据' } },
        { path: 'review-records', name: 'review-records', component: ReviewRecords, meta: { title: '留言记录' } },
        { path: 'teacher-eval', name: 'teacher-eval', component: TeacherEval, meta: { title: '教学回看' } },
        { path: ':pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { title: '页面未找到' } }
      ]
    }
  ]
})

export default router