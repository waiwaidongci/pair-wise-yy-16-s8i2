import { getPhoto } from "../data/photos";
import { PhotoImage } from "../components/PhotoImage";

const TIMELINE = [
  { year: "2014", text: "第一次上高原，开始用相机记录沿途的牧场与人。" },
  { year: "2016", text: "辞去工作成为自由摄影师，长期驻扎高海拔地区拍摄。" },
  { year: "2018", text: "开始黑白人像计划《凝视》，聚焦镜头前的坦露与防备。" },
  { year: "2021", text: "《无人之境》系列成形，持续记录纯粹地貌的四季光线。" },
  { year: "2023", text: "深入牧场跟拍游牧日常，积累《高原牧歌》系列素材。" },
];

export function About() {
  const portrait = getPhoto("portrait-01");

  return (
    <main className="page-about">
      <div className="about-layout">
        <div className="about-photo">
          <PhotoImage photo={portrait} eager />
        </div>
        <div className="about-body">
          <h1 className="page-title">简介</h1>
          <p>
            林澜，高原纪实自由摄影师。她的拍摄分两条线索：一条是黑白人像特写，
            在极近的距离里记录眼神、皮肤与一瞬间的防备；另一条是高原——
            无人区的山脊与雾气，以及牧场上牛群与人的共生日常。
          </p>
          <p>
            她相信慢下来的观看：同一片坡地等一场光，同一张脸等一次松弛。
            作品以自然光拍摄为主，常年在海拔四千米以上的地区工作。
          </p>

          <h2 className="about-timeline-title">经历</h2>
          <ol className="timeline">
            {TIMELINE.map((item) => (
              <li key={item.year} className="timeline-item">
                <span className="timeline-dot" aria-hidden="true" />
                <span className="timeline-year">{item.year}</span>
                <span className="timeline-text">{item.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}
