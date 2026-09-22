import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Photo } from "../data/photos";

/**
 * 全局灯箱状态。
 *
 * 关键设计：open() 接收的是"当前屏幕上这一组照片"的数组本身，
 * 而不是全量数据 + 过滤条件。因此无论是在 /work 的筛选结果里、
 * 还是在系列详情页里打开，灯箱的上一张/下一张都只会在这一个
 * 数组范围内循环，天然不可能越界到别的分组。
 */
interface LightboxState {
  photos: Photo[];
  index: number;
}

interface LightboxContextValue {
  state: LightboxState | null;
  open: (photos: Photo[], index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState | null>(null);

  const open = useCallback((photos: Photo[], index: number) => {
    if (photos.length === 0) return;
    setState({ photos, index });
  }, []);

  const close = useCallback(() => setState(null), []);

  // 取模循环：到达末尾后回到开头，且永远不会超出当前这一组照片的范围
  const next = useCallback(() => {
    setState((s) => (s ? { ...s, index: (s.index + 1) % s.photos.length } : s));
  }, []);

  const prev = useCallback(() => {
    setState((s) =>
      s ? { ...s, index: (s.index - 1 + s.photos.length) % s.photos.length } : s,
    );
  }, []);

  const value = useMemo(
    () => ({ state, open, close, next, prev }),
    [state, open, close, next, prev],
  );

  return <LightboxContext.Provider value={value}>{children}</LightboxContext.Provider>;
}

export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}
