import { categories, categoryLabel, filterByCategory } from "../data/photos";
import { useWorkFilter } from "../context/WorkFilterContext";
import { useLightbox } from "../context/LightboxContext";
import { PhotoImage } from "../components/PhotoImage";

export function Work() {
  // 筛选状态来自路由之外的全局 context：进入系列页再返回时依然保持
  const { category, setCategory } = useWorkFilter();
  const { open } = useLightbox();

  const visible = filterByCategory(category);

  return (
    <main className="page-work">
      <h1 className="page-title">全部作品</h1>

      <div className="filter-bar" role="group" aria-label="按分类筛选">
        <button
          type="button"
          className={`filter-pill${category === "all" ? " is-active" : ""}`}
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          全部
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`filter-pill${category === c.id ? " is-active" : ""}`}
            aria-pressed={category === c.id}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="work-count" aria-live="polite">
        当前显示 {visible.length} 张
        {category === "all" ? "（全部）" : `（${categoryLabel(category)}）`}
      </p>

      <div className="masonry">
        {visible.map((photo, index) => (
          <figure key={photo.id} className="masonry-item">
            <button
              type="button"
              className="masonry-button"
              onClick={() => open(visible, index)}
              aria-label={`查看照片：${photo.title}`}
            >
              <PhotoImage photo={photo} />
              {/* 桌面端：hover 浮层；移动端：说明移到图片下方（CSS 切换） */}
              <span className="masonry-overlay" aria-hidden="true">
                <span className="masonry-overlay-title">{photo.title}</span>
                <span className="masonry-overlay-category">{categoryLabel(photo.category)}</span>
                <span className="masonry-overlay-view">查看</span>
              </span>
            </button>
            <figcaption className="masonry-caption">
              <span className="masonry-caption-title">{photo.title}</span>
              <span className="masonry-caption-category">{categoryLabel(photo.category)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
