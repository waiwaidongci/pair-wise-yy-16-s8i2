import { Link } from 'react-router-dom'
import {
  allPhotos,
  categories,
  photosForCategory,
  photosForSeries,
  seriesList,
} from '../data/photos'
import { PhotoCard } from '../components/PhotoCard'
import { useLightbox } from '../state/lightbox'
import { useWorkFilter } from '../state/workFilter'

export function WorkPage() {
  // 筛选状态保存在路由之外的 WorkFilterProvider 中，
  // 进入系列详情页再返回时不会重置。
  const { category, setCategory } = useWorkFilter()
  const open = useLightbox()
  const visible = photosForCategory(category)

  return (
    <div className="work-page">
      <header className="container page-head">
        <p className="eyebrow gold">Works</p>
        <h1>全部作品</h1>
        <p className="page-sub">
          {visible.length} / {allPhotos.length} 张 · 三个长期系列
        </p>
      </header>

      <div className="container filters" role="group" aria-label="按分类筛选">
        <button
          type="button"
          aria-pressed={category === 'all'}
          onClick={() => setCategory('all')}
        >
          全部
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            type="button"
            aria-pressed={category === c.id}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="container masonry">
        {visible.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            // 灯箱只接收当前筛选出的这一组照片，导航不会越界
            onOpen={() => open(visible, index)}
          />
        ))}
      </div>

      <section className="container series-links">
        <div className="section-head">
          <h2>系列长页</h2>
          <span className="rule" aria-hidden="true" />
        </div>
        <ul>
          {seriesList.map(series => (
            <li key={series.id}>
              <Link to={`/work/${series.id}`}>
                <span className="t">{series.title}</span>
                <span className="n">{photosForSeries(series.id).length} 张</span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
