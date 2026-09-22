import { Link, useParams } from 'react-router-dom'
import {
  categoryLabel,
  photoUrl,
  photosForSeries,
  seriesById,
  seriesList,
} from '../data/photos'
import { useLightbox } from '../state/lightbox'

/**
 * 系列详情页：照片、标题、说明文字全部派生自与 /work 相同的
 * 数据模型（mock-data/photos.json），按 order 排序，不另写副本。
 */
export function SeriesPage() {
  const { seriesId } = useParams()
  const open = useLightbox()
  const series = seriesId ? seriesById(seriesId) : undefined

  if (!series) {
    return (
      <div className="container page-head">
        <h1>未找到该系列</h1>
        <p className="page-sub">
          <Link to="/work">返回全部作品 →</Link>
        </p>
      </div>
    )
  }

  const photos = photosForSeries(series.id)
  const hero = photos[0]
  const seriesIndex = seriesList.findIndex(s => s.id === series.id)
  const nextSeries = seriesList[(seriesIndex + 1) % seriesList.length]

  return (
    <div className="series-page">
      <header className="series-hero">
        <img
          className="series-hero-img"
          src={photoUrl(hero)}
          alt=""
          width={hero.width}
          height={hero.height}
        />
        <div className="series-hero-scrim" aria-hidden="true" />
        <div className="container series-hero-content">
          <p className="eyebrow gold">系列 · {categoryLabel(series.category)}</p>
          <h1>{series.title}</h1>
          <p className="series-count">{photos.length} 张作品</p>
        </div>
      </header>

      <blockquote className="container pull-quote">
        <p>“{series.summary}”</p>
      </blockquote>

      <div className="container story">
        {photos.map((photo, index) => (
          <article className="story-block" key={photo.id}>
            <button
              type="button"
              className="photo-button story-photo"
              onClick={() => open(photos, index)}
            >
              <span
                className="ratio-box"
                style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
              >
                <img
                  src={photoUrl(photo)}
                  alt={photo.altText}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                />
              </span>
            </button>
            <div className="story-text">
              <p className="story-num">
                {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
              </p>
              <h2>{photo.title}</h2>
              <p className="story-caption">{photo.caption}</p>
            </div>
          </article>
        ))}
      </div>

      <nav className="container series-pager" aria-label="系列导航">
        <Link to="/work" className="pager-link">
          ← 全部作品
        </Link>
        <Link to={`/work/${nextSeries.id}`} className="pager-link">
          下一个系列：《{nextSeries.title}》→
        </Link>
      </nav>
    </div>
  )
}
