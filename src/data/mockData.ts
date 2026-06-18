// ==================== 资源导入 ====================
import patrolCountIcon from '@/assets/home/stat-01.png'
import evalCountIcon from '@/assets/home/stat-02.png'
import evalTeacherIcon from '@/assets/home/stat-03.png'

// ==================== 课程时间配置 ====================
export const supervisionPeriodOptions = [
  { value: '1', label: '第一节', time: '08:00-08:45' },
  { value: '2', label: '第二节', time: '08:55-09:40' },
  { value: '3', label: '第三节', time: '10:00-10:45' },
  { value: '4', label: '第四节', time: '10:55-11:40' },
  { value: '5', label: '第五节', time: '13:00-13:45' },
  { value: '6', label: '第六节', time: '14:00-14:45' },
  { value: '7', label: '第七节', time: '14:55-15:40' },
  { value: '8', label: '第八节', time: '16:00-16:45' },
  { value: '9', label: '第九节', time: '16:55-17:40' },
  { value: '1-2', label: '第一、二节', time: '08:00-09:40' },
  { value: '3-4', label: '第三、四节', time: '10:00-11:40' },
  { value: '5-6', label: '第五、六节', time: '13:00-14:45' },
  { value: '7-8', label: '第七、八节', time: '14:55-16:45' }
]

export const getPeriodTime = (periodLabel: string): string =>
  supervisionPeriodOptions.find((opt) => opt.label === periodLabel)?.time ?? ''

// ==================== 课程类型配置 ====================
export const supervisionCourseTypeOptions = [
  { value: 'theory', label: '理论课' },
  { value: 'practice', label: '实践课' },
  { value: 'experiment', label: '实验课' },
  { value: 'pe', label: '体育课' },
  { value: 'public', label: '公共课' }
]

// ==================== 上课状态配置 ====================
export type SupervisionStatus = 'ongoing' | 'finished' | 'pending'

export const supervisionStatusMap: Record<SupervisionStatus, { label: string; type: 'success' | 'info' | 'warning' }> = {
  ongoing: { label: '上课中', type: 'success' },
  pending: { label: '未开始', type: 'warning' },
  finished: { label: '已结束', type: 'info' }
}

// ==================== 筛选状态 ====================
export type DateRange = [string, string] | null

export interface SupervisionFilterState {
  period: string
  courseType: string
  dateRange: DateRange
  keyword: string
}

export const createInitialSupervisionFilter = (): SupervisionFilterState => ({
  period: '',
  courseType: '',
  dateRange: null,
  keyword: ''
})

// ==================== 教学督导记录数据 ====================
export interface SupervisionRecord {
  id: number
  course: string
  classroom: string
  classroomType: string
  courseType: string
  college: string
  teacher: string
  date: string
  period: string
  status: SupervisionStatus
}

export const supervisionTableData: SupervisionRecord[] = [
  // ========== 今天（2026-06-18）正在上课 ==========
  { id: 1, course: '高等数学', classroom: 'A-101', classroomType: '多媒体教室', courseType: 'theory', college: '基础部', teacher: '刘丽娟', date: '2026-06-18', period: '第一、二节', status: 'ongoing' },
  { id: 2, course: '大学英语', classroom: 'A-102', classroomType: '语音教室', courseType: 'theory', college: '外语学院', teacher: '陈晓燕', date: '2026-06-18', period: '第一节', status: 'ongoing' },
  { id: 3, course: '数据结构', classroom: 'B-201', classroomType: '机房', courseType: 'theory', college: '信息学院', teacher: '王建国', date: '2026-06-18', period: '第二节', status: 'ongoing' },
  { id: 4, course: '物理学', classroom: 'B-302', classroomType: '多媒体教室', courseType: 'theory', college: '基础部', teacher: '郑文斌', date: '2026-06-18', period: '第二节', status: 'ongoing' },
  { id: 5, course: '编译原理', classroom: 'B-208', classroomType: '机房', courseType: 'theory', college: '信息学院', teacher: '何丽萍', date: '2026-06-18', period: '第一节', status: 'ongoing' },
  { id: 6, course: '模拟电路', classroom: 'C-201', classroomType: '实验室', courseType: 'experiment', college: '电子学院', teacher: '钱玉萍', date: '2026-06-18', period: '第一、二节', status: 'ongoing' },

  // ========== 今天（2026-06-18）待上课 ==========
  { id: 7, course: '线性代数', classroom: 'A-101', classroomType: '多媒体教室', courseType: 'theory', college: '基础部', teacher: '徐建华', date: '2026-06-18', period: '第三、四节', status: 'pending' },
  { id: 8, course: '概率论', classroom: 'A-101', classroomType: '多媒体教室', courseType: 'theory', college: '基础部', teacher: '潘丽霞', date: '2026-06-18', period: '第五节', status: 'pending' },
  { id: 9, course: '思想道德', classroom: 'A-101', classroomType: '多媒体教室', courseType: 'public', college: '马克思学院', teacher: '孙美华', date: '2026-06-18', period: '第七、八节', status: 'pending' },
  { id: 10, course: '电路原理', classroom: 'C-305', classroomType: '实验室', courseType: 'experiment', college: '电子学院', teacher: '李志强', date: '2026-06-18', period: '第三、四节', status: 'pending' },
  { id: 11, course: '思想道德', classroom: 'A-201', classroomType: '多媒体教室', courseType: 'public', college: '马克思学院', teacher: '孙美华', date: '2026-06-18', period: '第四节', status: 'pending' },
  { id: 12, course: '体育训练', classroom: '操场', classroomType: '室外场地', courseType: 'pe', college: '体育部', teacher: '周国栋', date: '2026-06-18', period: '第五、六节', status: 'pending' },
  { id: 13, course: '软件工程', classroom: 'B-211', classroomType: '机房', courseType: 'theory', college: '信息学院', teacher: '余建波', date: '2026-06-18', period: '第七节', status: 'pending' },
  { id: 14, course: '市场营销', classroom: 'F-101', classroomType: '多媒体教室', courseType: 'theory', college: '管理学院', teacher: '段秀英', date: '2026-06-18', period: '第八节', status: 'pending' },
  { id: 15, course: '化学实验', classroom: 'E-103', classroomType: '实验室', courseType: 'experiment', college: '化工学院', teacher: '吴桂兰', date: '2026-06-18', period: '第七节', status: 'pending' },
  { id: 16, course: '计算机网络', classroom: 'B-210', classroomType: '机房', courseType: 'theory', college: '信息学院', teacher: '罗志明', date: '2026-06-18', period: '第八节', status: 'pending' },
  { id: 17, course: '数字电路', classroom: 'C-202', classroomType: '实验室', courseType: 'experiment', college: '电子学院', teacher: '冯志刚', date: '2026-06-18', period: '第八节', status: 'pending' },

  // ========== 昨天（2026-06-17）已结束 ==========
  { id: 18, course: '大学英语', classroom: 'A-101', classroomType: '多媒体教室', courseType: 'theory', college: '外语学院', teacher: '陈晓燕', date: '2026-06-17', period: '第一、二节', status: 'finished' },
  { id: 19, course: '物理学', classroom: 'A-101', classroomType: '多媒体教室', courseType: 'theory', college: '基础部', teacher: '郑文斌', date: '2026-06-17', period: '第三节', status: 'finished' },
  { id: 20, course: '计算机网络', classroom: 'A-101', classroomType: '多媒体教室', courseType: 'theory', college: '信息学院', teacher: '罗志明', date: '2026-06-17', period: '第五、六节', status: 'finished' },
  { id: 21, course: '高等数学', classroom: 'A-103', classroomType: '多媒体教室', courseType: 'theory', college: '基础部', teacher: '刘丽娟', date: '2026-06-17', period: '第一节', status: 'finished' },
  { id: 22, course: '操作系统', classroom: 'B-205', classroomType: '机房', courseType: 'theory', college: '信息学院', teacher: '黄玉兰', date: '2026-06-17', period: '第四节', status: 'finished' },

  // ========== 更早历史记录（2026-06-16 ~ 2026-06-10）==========
  { id: 23, course: '法律基础', classroom: 'A-101', classroomType: '多媒体教室', courseType: 'public', college: '马克思学院', teacher: '苏丽红', date: '2026-06-16', period: '第一、二节', status: 'finished' },
  { id: 24, course: '经济学原理', classroom: 'A-101', classroomType: '多媒体教室', courseType: 'theory', college: '管理学院', teacher: '段秀英', date: '2026-06-16', period: '第三节', status: 'finished' },
  { id: 25, course: '线性代数', classroom: 'A-103', classroomType: '多媒体教室', courseType: 'theory', college: '基础部', teacher: '徐建华', date: '2026-06-15', period: '第一节', status: 'finished' },
  { id: 26, course: '编译原理', classroom: 'B-208', classroomType: '机房', courseType: 'theory', college: '信息学院', teacher: '何丽萍', date: '2026-06-15', period: '第二节', status: 'finished' },
  { id: 27, course: '工程力学', classroom: 'D-302', classroomType: '多媒体教室', courseType: 'theory', college: '机械学院', teacher: '高建军', date: '2026-06-14', period: '第二节', status: 'finished' },
  { id: 28, course: '材料力学', classroom: 'D-303', classroomType: '多媒体教室', courseType: 'theory', college: '机械学院', teacher: '林晓东', date: '2026-06-14', period: '第三节', status: 'finished' },
  { id: 29, course: '模拟电路', classroom: 'C-201', classroomType: '实验室', courseType: 'experiment', college: '电子学院', teacher: '钱玉萍', date: '2026-06-14', period: '第四节', status: 'finished' },
  { id: 30, course: '数字电路', classroom: 'C-202', classroomType: '实验室', courseType: 'experiment', college: '电子学院', teacher: '冯志刚', date: '2026-06-13', period: '第一节', status: 'finished' },
  { id: 31, course: '概率论', classroom: 'A-104', classroomType: '多媒体教室', courseType: 'theory', college: '基础部', teacher: '潘丽霞', date: '2026-06-13', period: '第二节', status: 'finished' },
  { id: 32, course: '英语听力', classroom: 'A-105', classroomType: '语音教室', courseType: 'theory', college: '外语学院', teacher: '蒋雪梅', date: '2026-06-13', period: '第三节', status: 'finished' },
  { id: 33, course: '机械设计', classroom: 'D-404', classroomType: '绘图教室', courseType: 'practice', college: '机械学院', teacher: '韩国良', date: '2026-06-13', period: '第四节', status: 'finished' },
  { id: 34, course: '工程制图', classroom: 'D-405', classroomType: '绘图教室', courseType: 'practice', college: '机械学院', teacher: '叶敏华', date: '2026-06-12', period: '第一节', status: 'finished' },
  { id: 35, course: '软件工程', classroom: 'B-211', classroomType: '机房', courseType: 'theory', college: '信息学院', teacher: '余建波', date: '2026-06-12', period: '第二节', status: 'finished' },
  { id: 36, course: '市场营销', classroom: 'F-101', classroomType: '多媒体教室', courseType: 'theory', college: '管理学院', teacher: '段秀英', date: '2026-06-12', period: '第三节', status: 'finished' },
  { id: 37, course: '会计学', classroom: 'F-102', classroomType: '多媒体教室', courseType: 'theory', college: '管理学院', teacher: '魏国斌', date: '2026-06-12', period: '第四节', status: 'finished' },
  { id: 38, course: '法律基础', classroom: 'A-202', classroomType: '多媒体教室', courseType: 'public', college: '马克思学院', teacher: '苏丽红', date: '2026-06-11', period: '第二节', status: 'finished' },
  { id: 39, course: '化学实验', classroom: 'E-103', classroomType: '实验室', courseType: 'experiment', college: '化工学院', teacher: '吴桂兰', date: '2026-06-11', period: '第二节', status: 'finished' },
  { id: 40, course: '机械制图', classroom: 'D-401', classroomType: '绘图教室', courseType: 'practice', college: '机械学院', teacher: '赵海峰', date: '2026-06-10', period: '第三节', status: 'finished' }
]

// ==================== 教学楼配置 ====================
export interface BuildingItem {
  id: number
  name: string
  prefix: string
  updateTime: string
}

export const buildingList: BuildingItem[] = [
  { id: 1, name: '1号教学楼', prefix: 'A', updateTime: '2026-06-18 09:32' },
  { id: 2, name: '2号教学楼', prefix: 'B', updateTime: '2026-06-18 09:30' },
  { id: 3, name: '3号教学楼', prefix: 'C', updateTime: '2026-06-18 09:28' },
  { id: 4, name: '4号教学楼', prefix: 'D', updateTime: '2026-06-18 09:25' },
  { id: 5, name: '5号教学楼', prefix: 'E', updateTime: '2026-06-18 09:20' },
  { id: 6, name: '6号教学楼', prefix: 'F', updateTime: '2026-06-18 09:18' }
]

// ==================== 教室巡课数据 ====================
export interface PatrolClassroomItem {
  id: string
  classroom: string
  status: 'ongoing' | 'idle'
  course?: string
  teacher?: string
  period?: string
}

export const getPatrolClassroomsByPrefix = (prefix: string): PatrolClassroomItem[] => {
  const seen = new Map<string, PatrolClassroomItem>()

  // 先收集所有教室，优先取 ongoing 状态
  for (const record of supervisionTableData) {
    if (!record.classroom.startsWith(`${prefix}-`)) continue

    const existing = seen.get(record.classroom)

    // 如果是 ongoing 状态，直接设置或覆盖
    if (record.status === 'ongoing') {
      seen.set(record.classroom, {
        id: record.classroom,
        classroom: record.classroom,
        status: 'ongoing',
        course: record.course,
        teacher: record.teacher,
        period: record.period
      })
    } else if (!existing) {
      // 只有在不存在时才设置为 idle（避免覆盖 ongoing）
      seen.set(record.classroom, {
        id: record.classroom,
        classroom: record.classroom,
        status: 'idle'
      })
    }
  }

  return Array.from(seen.values()).sort((a, b) => a.classroom.localeCompare(b.classroom))
}

// ==================== 统计数据 ====================
export const statsData = [
  {
    id: 1,
    label: '巡课次数',
    count: 156,
    bgStyle: 'border-radius: 12px; background: linear-gradient(165deg, #D1DCFD 12%, #E5ECFF 50%, #D1DCFD 88%); box-shadow: 0px 4px 10px 0px rgba(0, 49, 185, 0.0359), inset 0px 1px 20px 0px rgba(181, 189, 247, 0.2544);',
    iconSrc: patrolCountIcon
  },
  {
    id: 2,
    label: '评价次数',
    count: 108,
    bgStyle: 'border-radius: 12px; background: linear-gradient(165deg, #D5F1FA 12%, #E8F9FF 50%, #D5F1FA 88%); box-shadow: 0px 4px 10px 0px rgba(0, 49, 185, 0.0359), inset 0px 1px 20px 0px rgba(150, 205, 223, 0.3344);',
    iconSrc: evalCountIcon
  },
  {
    id: 3,
    label: '评价教员数量',
    count: 42,
    bgStyle: 'border-radius: 12px; background: linear-gradient(165deg, #DFDBFE 12%, #F1EFFF 50%, #DFDBFE 88%); box-shadow: 0px 4px 10px 0px rgba(0, 49, 185, 0.0359);',
    iconSrc: evalTeacherIcon
  }
]

// ==================== 课堂留言数据 ====================
export interface MessageItem {
  name: string
  time: string
  content: string
}

export const classroomMessagesMap: Record<string, MessageItem[]> = {
  'A-101': [
    { name: '张明', time: '2026-06-18 09:15', content: '今天的高等数学课程内容非常清晰，刘老师讲解得很详细，特别是对微积分的应用部分。' },
    { name: '李红', time: '2026-06-18 09:20', content: '课堂互动环节很棒，同学们参与度很高，气氛活跃。' },
    { name: '王强', time: '2026-06-18 09:25', content: '建议增加一些实际案例分析，帮助我们更好地理解抽象的数学概念。' },
    { name: '赵敏', time: '2026-06-18 09:30', content: '课件制作精美，重点突出，复习起来很方便。' },
    { name: '孙丽', time: '2026-06-18 09:35', content: '老师对难点的剖析非常到位，解决了我很久以来的疑惑。' },
    { name: '周杰', time: '2026-06-18 09:40', content: '希望下节课能多留一些练习时间，巩固今天学的知识。' },
    { name: '吴晨', time: '2026-06-18 09:45', content: '课堂氛围很好，学习效率很高，期待下次课程。' }
  ],
  'A-102': [
    { name: '陈婷', time: '2026-06-18 08:50', content: '英语课堂上陈老师的发音很标准，听力练习的素材也很贴近实际应用。' },
    { name: '林峰', time: '2026-06-18 08:55', content: '小组讨论环节设计得很好，让每个人都有机会开口练习。' },
    { name: '黄莉', time: '2026-06-18 09:00', content: '建议增加一些商务英语的内容，对我们未来工作会很有帮助。' }
  ],
  'B-201': [
    { name: '郑伟', time: '2026-06-18 09:05', content: '数据结构课程的代码演示很清晰，王老师的讲解思路也很好。' },
    { name: '刘洋', time: '2026-06-18 09:10', content: '实验环节时间有点紧张，希望能多给一些时间调试代码。' }
  ],
  'B-302': []
}

export const getMessagesByClassroom = (classroom: string): MessageItem[] =>
  classroomMessagesMap[classroom] ?? []

// ==================== 在线评价模板 ====================
export interface EvaluateTemplate {
  id: string
  label: string
  sections: {
    title: string
    items: {
      key: string
      label: string
      type: 'input' | 'number' | 'select' | 'radio' | 'checkbox' | 'rate' | 'textarea'
      required?: boolean
      placeholder?: string
      options?: { value: string; label: string }[]
    }[]
  }[]
}

export const evaluateTemplates: EvaluateTemplate[] = [
  {
    id: 'classroom',
    label: '课堂评价',
    sections: [
      {
        title: '教学态度',
        items: [
          { key: 'teaching_prep', label: '备课充分程度', type: 'rate', required: true },
          { key: 'teaching_passion', label: '教学热情', type: 'rate', required: true },
          { key: 'student_care', label: '关心学生学习情况', type: 'rate' }
        ]
      },
      {
        title: '教学内容',
        items: [
          { key: 'content_clear', label: '内容讲解清晰度', type: 'rate', required: true },
          { key: 'content_difficulty', label: '难度适中', type: 'rate' },
          { key: 'key_point', label: '重点突出', type: 'radio', options: [
            { value: 'yes', label: '是' },
            { value: 'no', label: '否' }
          ]}
        ]
      },
      {
        title: '教学方法',
        items: [
          { key: 'interaction', label: '课堂互动情况', type: 'rate' },
          { key: 'teaching_methods', label: '采用的教学方法', type: 'checkbox', options: [
            { value: 'lecture', label: '讲授法' },
            { value: 'discussion', label: '讨论法' },
            { value: 'practice', label: '实践法' },
            { value: 'case', label: '案例法' },
            { value: 'group', label: '分组教学' }
          ]},
          { key: 'multimedia_usage', label: '多媒体使用情况', type: 'select', options: [
            { value: 'excellent', label: '优秀' },
            { value: 'good', label: '良好' },
            { value: 'average', label: '一般' },
            { value: 'poor', label: '较差' }
          ]}
        ]
      },
      {
        title: '综合评价',
        items: [
          { key: 'overall_score', label: '总体评分', type: 'rate', required: true },
          { key: 'student_count', label: '到课人数', type: 'number', placeholder: '请输入到课人数' },
          { key: 'suggestions', label: '改进建议', type: 'textarea', placeholder: '请输入改进建议' }
        ]
      }
    ]
  },
  {
    id: 'experiment',
    label: '实验课评价',
    sections: [
      {
        title: '实验准备',
        items: [
          { key: 'lab_prep', label: '实验器材准备', type: 'rate', required: true },
          { key: 'lab_env', label: '实验环境整洁', type: 'rate' },
          { key: 'safety_intro', label: '安全注意事项说明', type: 'radio', options: [
            { value: 'yes', label: '已说明' },
            { value: 'no', label: '未说明' }
          ]}
        ]
      },
      {
        title: '实验指导',
        items: [
          { key: 'demo_clear', label: '操作示范清晰', type: 'rate', required: true },
          { key: 'guide_patient', label: '指导耐心程度', type: 'rate' },
          { key: 'problem_solve', label: '问题解决能力', type: 'rate' }
        ]
      },
      {
        title: '综合评价',
        items: [
          { key: 'overall_score', label: '总体评分', type: 'rate', required: true },
          { key: 'completion_rate', label: '实验完成率(%)', type: 'number', placeholder: '请输入完成率' },
          { key: 'feedback', label: '实验反馈', type: 'textarea', placeholder: '请输入实验课反馈意见' }
        ]
      }
    ]
  },
  {
    id: 'pe',
    label: '体育课评价',
    sections: [
      {
        title: '教学组织',
        items: [
          { key: 'warmup', label: '热身活动组织', type: 'rate', required: true },
          { key: 'teaching_order', label: '教学秩序', type: 'rate' },
          { key: 'time_control', label: '时间把控', type: 'rate' }
        ]
      },
      {
        title: '教学效果',
        items: [
          { key: 'skill_teach', label: '技能教学效果', type: 'rate', required: true },
          { key: 'exercise_intensity', label: '运动强度适中', type: 'rate' },
          { key: 'student_participation', label: '学生参与度', type: 'rate' }
        ]
      },
      {
        title: '综合评价',
        items: [
          { key: 'overall_score', label: '总体评分', type: 'rate', required: true },
          { key: 'injury_risk', label: '安全隐患', type: 'checkbox', options: [
            { value: 'none', label: '无' },
            { value: 'minor', label: '轻微' },
            { value: 'serious', label: '严重' }
          ]},
          { key: 'feedback', label: '课堂反馈', type: 'textarea', placeholder: '请输入体育课反馈意见' }
        ]
      }
    ]
  }
]

// ==================== 消息通知 ====================
export interface NotificationMessageItem {
  title: string
  isRead: boolean
  content: string
}

export const notificationList: NotificationMessageItem[] = [
  {
    title: '你有一条新的督导任务待处理',
    isRead: false,
    content: '您有一条新的教学督导任务已分配，请尽快查看任务详情并安排巡课计划。任务编号：DS-20260618-001，督导课程：高等数学，授课教师：刘丽娟，上课地点：A-101教室，上课时间：2026-06-18 第一、二节。'
  },
  {
    title: '教学评价结果已发布',
    isRead: false,
    content: '2026年春季学期第二轮教学评价结果已发布。本次评价共涉及18门课程，整体满意度为94.2%，较上一轮提升1.7个百分点。您可在评价管理页面查看详细报告和各课程评价明细。'
  },
  {
    title: '本周巡课计划已更新',
    isRead: true,
    content: '本周（6月17日-6月21日）巡课计划已更新，共安排12次巡课任务，涵盖A、B、C、D、E、F六栋教学楼。请各位督导员及时查看个人巡课安排，确保按时完成巡课工作。如有时间冲突，请及时联系教务处调整。'
  },
  {
    title: '系统维护通知',
    isRead: true,
    content: '系统将于2026年6月20日（周六）凌晨2:00-6:00进行例行维护升级，届时系统将暂停服务。本次升级将优化系统性能，修复已知问题，并新增课堂数据统计分析功能。请提前做好相关工作安排。'
  },
  {
    title: '优秀教学案例分享会通知',
    isRead: true,
    content: '学校将于2026年6月25日下午14:00在行政楼会议室举办本学期优秀教学案例分享会。本次分享会将邀请5位教学评价优秀的教师分享教学经验和方法，欢迎各位督导员参加学习交流。'
  }
]

