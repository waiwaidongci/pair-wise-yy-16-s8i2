import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { categoryLabel } from "../data/photos";
import { useLightbox } from "../context/LightboxContext";

/**
 * 全局灯箱：不是独立路由，任何页面都可以通过 useLightbox().open()
 * 把"当前这一组照片"交给它。导航只在这组照片内部取模循环。
 */
export function Lightbox() {
  const { state, close, next, prev } = useLightbox();
  const location = useLocation();

  // 路由切换时自动关闭灯箱
  useEffect(() => {
    close();
  }, [location.pathname, close]);

  // 键盘交互 + 锁定背景滚动
  useEffect(() => {
    if (!state) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [state, close, next, prev]);

  if (!state) return null;

  const { photos, index } = state;
  const photo = photos[index];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`查看照片：${photo.title}`}>
      <div className="lightbox-backdrop" onClick={close} />

      <button type="button" className="lightbox-close" aria-label="关闭" onClick={close}>
        ×
      </button>

      <button
        type="button"
        className="lightbox-arrow lightbox-arrow-prev"
        aria-label="上一张"
        onClick={prev}
      >
        ‹
      </button>

      <figure className="lightbox-stage">
        <div
          className="lightbox-image-frame"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        >
          <img src={`/${photo.file}`} alt={photo.altText} />
        </div>
      </figure>

      <button
        type="button"
        className="lightbox-arrow lightbox-arrow-next"
        aria-label="下一张"
        onClick={next}
      >
        ›
      </button>

      {/* 桌面端：右侧浮层；移动端：底部信息条（CSS 媒体查询切换） */}
      <aside className="lightbox-info">
        <p className="lightbox-counter">
          {index + 1} / {photos.length}
        </p>
        <h2 className="lightbox-title">{photo.title}</h2>
        <p className="lightbox-category">{categoryLabel(photo.category)}</p>
        <p className="lightbox-caption">{photo.caption}</p>
      </aside>
    </div>
  );
}
