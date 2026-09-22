import { Link, Navigate, useParams } from "react-router-dom";
import { categoryLabel, getSeries, photosForSeries } from "../data/photos";
import { useLightbox } from "../context/LightboxContext";
import { PhotoImage } from "../components/PhotoImage";

/**
 * 系列详情页：叙事式长图文排版。
 * 所有照片、标题、说明文字均来自与 /work 相同的 photos.json 数据模型，
 * 按 seriesId 过滤、按 order 排序，不在组件内重复硬编码。
 */
export function Series() {
  const { seriesId } = useParams<{ seriesId: string }>();
  const { open } = useLightbox();

  const series = seriesId ? getSeries(seriesId) : undefined;
  if (!series) return <Navigate to="/work" replace />;

  const seriesPhotos = photosForSeries(series);
  const hero = seriesPhotos[0];

  return (
    <main className="page-series">
      <nav className="series-breadcrumb" aria-label="返回">
        <Link to="/work" className="back-link">
          ← 返回全部作品
        </Link>
      </nav>

      <header className="series-hero">
        <PhotoImage photo={hero} className="series-hero-image" eager />
        <div className="series-hero-text">
          <p className="series-hero-category">{categoryLabel(series.category)}</p>
          <h1 className="series-hero-title">{series.title}</h1>
        </div>
      </header>

      {/* 系列摘要：Playfair Display 斜体引言 */}
      <blockquote className="series-pullquote">
        <p>“{series.summary}”</p>
      </blockquote>

      <div className="series-narrative">
        {seriesPhotos.map((photo, index) => (
          <section
            key={photo.id}
            className={`narrative-block${index % 2 === 1 ? " is-reversed" : ""}`}
          >
            <button
              type="button"
              className="narrative-image"
              onClick={() => open(seriesPhotos, index)}
              aria-label={`查看照片：${photo.title}`}
            >
              <PhotoImage photo={photo} />
            </button>
            <div className="narrative-text">
              <p className="narrative-index">
                {String(index + 1).padStart(2, "0")} / {String(seriesPhotos.length).padStart(2, "0")}
              </p>
              <h2 className="narrative-title">{photo.title}</h2>
              <div className="gold-rule gold-rule-short" aria-hidden="true" />
              <p className="narrative-caption">{photo.caption}</p>
            </div>
          </section>
        ))}
      </div>

      <footer className="series-footer">
        <Link to="/work" className="back-link">
          ← 返回全部作品
        </Link>
      </footer>
    </main>
  );
}
