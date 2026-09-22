import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

/**
 * /work 的分类筛选状态被提升到路由之外（App 根部），
 * 因此进入系列详情页再返回时筛选条件不会丢失。
 */
interface WorkFilterValue {
  category: string
  setCategory: (category: string) => void
}

const WorkFilterContext = createContext<WorkFilterValue | null>(null)

export function WorkFilterProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState('all')
  const value = useMemo(() => ({ category, setCategory }), [category])
  return <WorkFilterContext.Provider value={value}>{children}</WorkFilterContext.Provider>
}

export function useWorkFilter(): WorkFilterValue {
  const ctx = useContext(WorkFilterContext)
  if (!ctx) throw new Error('useWorkFilter 必须在 WorkFilterProvider 内使用')
  return ctx
}
