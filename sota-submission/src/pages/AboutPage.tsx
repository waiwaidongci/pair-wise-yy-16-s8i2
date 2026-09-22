import { photoUrl, photosForSeries } from '../data/photos'

const portrait = photosForSeries('gaze')[3] // 《侧光》

const TIMELINE: { year: string; text: string }[] = [
  { year: '2016', text: '辞去设计工作，第一次独自进入青南高原，开始长期纪实拍摄。' },
  { year: '2018', text: '开始黑白肖像系列《凝视》，在帐篷与屋檐下为牧民拍下特写。' },
  { year: '2020', text: '与三个牧民家庭同住四季，记录迁徙与牧场日常，《高原牧歌》由此开始。' },
  { year: '2022', text: '完成风光系列《无人之境》第一阶段拍摄，走遍无人区的山脊与雾谷。' },
  { year: '2024', text: '作品在西宁、成都两地展出；三个系列至今仍在持续拍摄。' },
]

export function AboutPage() {
  return (
    <div className="container about">
      <div className="about-media">
        <span
          className="ratio-box"
          style={{ aspectRatio: `${portrait.width} / ${portrait.height}` }}
        >
          <img
            src={photoUrl(portrait)}
            alt={portrait.altText}
            width={portrait.width}
            height={portrait.height}
          />
        </span>
        <p className="about-media-note">《{portrait.title}》，选自系列《凝视》。</p>
      </div>

      <div className="about-body">
        <p className="eyebrow gold">About</p>
        <h1>简介</h1>
        <p>
          林牧，自由摄影师，现居西宁。过去十年里，她的大部分时间花在海拔三千米以上的地区——拍牧民的日常，也拍没有人的山谷。
        </p>
        <p>
          她相信照片应该比现场更安静。镜头退后一步，让光线、坡度与停顿自己说话。《凝视》《无人之境》《高原牧歌》三个系列，分别对应她反复回到的三件事：人、地貌，以及二者相处的方式。
        </p>

        <section className="timeline" aria-label="经历时间线">
          <h2>经历</h2>
          <ol>
            {TIMELINE.map(item => (
              <li key={item.year}>
                <span className="year">{item.year}</span>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
