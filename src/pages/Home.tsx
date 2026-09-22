import { Link } from "react-router-dom";
import { photosForSeries, seriesList } from "../data/photos";
import { PhotoImage } from "../components/PhotoImage";

export function Home() {
  return (
    <main className="page-home">
      <section className="hero">
        <div className="hero-text">
          <p className="hero-eyebrow">高原纪实 · 自由摄影</p>
          <h1 className="hero-name">林&nbsp;澜</h1>
          <p className="hero-intro">
            独立摄影师，长期行走于高海拔地区。镜头一半对准黑白人像里眼神与皮肤的纹理，
            一半交给高原的山脊、草甸与牧场日常——在无人之境与炊烟之间，记录光线落下的样子。
          </p>
          <Link to="/work" className="hero-cta">
            查看全部作品
          </Link>
        </div>
      </section>

      <div className="gold-rule" aria-hidden="true" />

      <section className="featured" aria-label="精选系列">
        <h2 className="section-title">精选系列</h2>
        <div className="series-cards">
          {seriesList.map((series) => {
            const cover = photosForSeries(series)[0];
            return (
              <Link
                key={series.id}
                to={`/work/${series.id}`}
                className="series-card"
                aria-label={`进入系列：${series.title}`}
              >
                <PhotoImage photo={cover} className="series-card-cover" />
                <div className="series-card-body">
                  <h3 className="series-card-title">{series.title}</h3>
                  <p className="series-card-summary">{series.summary}</p>
                  <span className="series-card-more">
                    共 {series.photoIds.length} 张 · 进入系列 →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
