import { useState } from "react";
import type { Photo } from "../data/photos";

interface PhotoImageProps {
  photo: Photo;
  className?: string;
  eager?: boolean;
}

/**
 * 按照片真实宽高比提前占位：外层容器用 photos.json 提供的
 * width/height 计算 aspect-ratio，图片加载完成前布局已经稳定，
 * 加载后淡入，不产生 CLS。
 */
export function PhotoImage({ photo, className, eager }: PhotoImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`photo-frame${className ? ` ${className}` : ""}`}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <img
        src={`/${photo.file}`}
        alt={photo.altText}
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={loaded ? "is-loaded" : ""}
      />
    </div>
  );
}
