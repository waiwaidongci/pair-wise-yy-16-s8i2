import { Link } from 'react-router-dom'
import {
  photoUrl,
  photosForSeries,
  seriesList,
  type Series,
} from '../data/photos'
import { useLightbox } from '../state/lightbox'

const heroPhoto = photosForSeries('wilderness')[0]

export function HomePage() {
  return (
    <>
      <section className="hero">
        <img
          className="hero-img"
          src={photoUrl(heroPhoto)}
          alt={heroPhoto.altText}
          width={heroPhoto.width}
          height={heroPhoto.height}
        />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="container hero-content">
          <p className="eyebrow gold">高原纪实摄影</p>
          <h1>林牧</h1>
          <p className="hero-lede">
            自由摄影师，长住高原。拍人，也拍人不在的地方。
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/work">
              查看全部作品
            </Link>
            <Link className="btn ghost" to="/contact">
              约拍洽谈
            </Link>
          </div>
        </div>
      </section>

      <section className="container featured">
        <div className="section-head">
          <h2>精选系列</h2>
          <span className="rule" aria-hidden="true" />
        </div>
        <div className="series-grid">
          {seriesList.map(series => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      </section>
    </>
  )
}

function SeriesCard({ series }: { series: Series }) {
  const open = useLightbox()
  const photos = photosForSeries(series.id)
  const cover = photos[0]

  return (
    <article
      className="series-card"
      role="button"
      tabIndex={0}
      aria-label={`打开系列《${series.title}》的照片`}
      onClick={() => open(photos, 0)}
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          open(photos, 0)
        }
      }}
    >
      <span className="ratio-box series-card-cover">
        <img
          src={photoUrl(cover)}
          alt={cover.altText}
          width={cover.width}
          height={cover.height}
          loading="lazy"
        />
      </span>
      <div className="series-card-meta">
        <h3>{series.title}</h3>
        <p className="series-card-summary">{series.summary}</p>
        <div className="series-card-foot">
          <span className="count">{photos.length} 张作品</span>
          <Link
            to={`/work/${series.id}`}
            onClick={event => event.stopPropagation()}
          >
            进入系列 →
          </Link>
        </div>
      </div>
    </article>
  )
}
