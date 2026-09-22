import { categoryLabel, photoUrl, type Photo } from '../data/photos'

/**
 * 网格照片卡片。容器在图片加载完成前就按 photos.json 记录的
 * 真实宽高比撑开占位（aspect-ratio），避免布局抖动。
 */
export function PhotoCard({ photo, onOpen }: { photo: Photo; onOpen: () => void }) {
  return (
    <button type="button" className="photo-button" onClick={onOpen}>
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
      <span className="photo-meta">
        <strong>{photo.title}</strong>
        <span className="photo-cat" aria-hidden="true">
          {categoryLabel(photo.category)}
        </span>
      </span>
    </button>
  )
}
