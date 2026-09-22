import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { categoryLabel, photoUrl, type Photo } from '../data/photos'

/**
 * 全局共享灯箱。任何页面通过 useLightbox() 拿到的 open(photos, index)
 * 打开的都是这同一个组件实例；每次打开时只接收调用方当前展示的那一组
 * 照片（例如 /work 筛选后的子集），上一张/下一张只在这组照片内循环，
 * 不会越界进入其它分组。
 */
type OpenLightbox = (photos: Photo[], index: number) => void

const LightboxContext = createContext<OpenLightbox | null>(null)

export function useLightbox(): OpenLightbox {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox 必须在 LightboxProvider 内使用')
  return ctx
}

interface LightboxState {
  photos: Photo[]
  index: number
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState | null>(null)

  const open = useCallback<OpenLightbox>((photos, index) => {
    if (photos.length === 0) return
    setState({ photos, index: Math.min(Math.max(index, 0), photos.length - 1) })
  }, [])

  const close = useCallback(() => setState(null), [])

  const step = useCallback((delta: number) => {
    setState(s => {
      if (!s || s.photos.length === 0) return s
      const next = (s.index + delta + s.photos.length) % s.photos.length
      return { ...s, index: next }
    })
  }, [])

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {state && <Lightbox state={state} onClose={close} onStep={step} />}
    </LightboxContext.Provider>
  )
}

function Lightbox({
  state,
  onClose,
  onStep,
}: {
  state: LightboxState
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const { photos, index } = state
  const photo = photos[index]
  const closeRef = useRef<HTMLButtonElement>(null)

  // 打开时锁定页面滚动、接管键盘，并把焦点移入对话框；关闭时还原焦点。
  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowLeft') onStep(-1)
      else if (event.key === 'ArrowRight') onStep(1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose, onStep])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.title}>
      <div className="lightbox-backdrop" onClick={onClose} />
      <button
        ref={closeRef}
        type="button"
        className="lightbox-close"
        aria-label="关闭"
        onClick={onClose}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <div className="lightbox-body">
        <div className="lightbox-stage">
          <img
            key={photo.id}
            className="lightbox-image"
            src={photoUrl(photo)}
            alt={photo.altText}
            width={photo.width}
            height={photo.height}
          />
          <button
            type="button"
            className="lightbox-arrow prev"
            aria-label="上一张"
            onClick={() => onStep(-1)}
          >
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="lightbox-arrow next"
            aria-label="下一张"
            onClick={() => onStep(1)}
          >
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="lightbox-info">
          <div className="lightbox-info-main">
            <p className="eyebrow">
              {categoryLabel(photo.category)} · {index + 1} / {photos.length}
            </p>
            <h2>{photo.title}</h2>
          </div>
          <p className="lightbox-caption">{photo.caption}</p>
        </div>
      </div>
    </div>
  )
}
