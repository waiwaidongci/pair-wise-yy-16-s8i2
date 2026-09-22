import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * /work 页面的分类筛选状态。
 *
 * 提升并常驻在路由之外（App 根部），因此用户从 /work 进入
 * /work/:seriesId 再返回时，筛选条件不会随页面组件卸载而丢失，
 * 仍然是可回访的页面状态。
 */
interface WorkFilterContextValue {
  category: string;
  setCategory: (category: string) => void;
}

const WorkFilterContext = createContext<WorkFilterContextValue | null>(null);

export function WorkFilterProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<string>("all");
  const value = useMemo(() => ({ category, setCategory }), [category]);
  return <WorkFilterContext.Provider value={value}>{children}</WorkFilterContext.Provider>;
}

export function useWorkFilter(): WorkFilterContextValue {
  const ctx = useContext(WorkFilterContext);
  if (!ctx) throw new Error("useWorkFilter must be used within WorkFilterProvider");
  return ctx;
}
