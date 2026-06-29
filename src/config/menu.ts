export interface MenuChild {
  id: string
  label: string
}

export interface MenuItem {
  id: string
  icon: string
  label: string
  children?: MenuChild[]
}

export const menuConfig: MenuItem[] = [
  { id: 'home', icon: 'icon-sidebar-01', label: '首页' },
  { id: 'teachers', icon: 'icon-sidebar-02', label: '教学督导' },
  { id: 'patrol', icon: 'icon-sidebar-03', label: '教室巡课' },
  {
    id: 'evaluation',
    icon: 'icon-sidebar-04',
    label: '评价系统',
    children: [
      { id: 'building', label: '模板管理' },
      { id: 'practice', label: '分类管理' },
      { id: 'usage', label: '指标管理' },
      { id: 'class-mgmt', label: '选项管理' },
      { id: 'report', label: '评价报表' },
      { id: 'class-eval', label: '评价记录' }
    ]
  },
  { id: 'patrol-records', icon: 'icon-sidebar-05', label: '巡课记录' },
  { id: 'patrol-stats', icon: 'icon-sidebar-06', label: '巡视数据' },
  { id: 'review-records', icon: 'icon-sidebar-07', label: '留言记录' },
  { id: 'teacher-eval', icon: 'icon-sidebar-08', label: '教学回看' }
]