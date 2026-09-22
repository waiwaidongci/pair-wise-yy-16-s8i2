import data from "./photos.json";

export interface Category {
  id: string;
  label: string;
}

export interface Series {
  id: string;
  title: string;
  category: string;
  summary: string;
  photoIds: string[];
}

export interface Photo {
  id: string;
  category: string;
  seriesId: string;
  file: string;
  title: string;
  altText: string;
  caption: string;
  width: number;
  height: number;
  order: number;
}

export const categories: Category[] = data.categories;
export const seriesList: Series[] = data.series;
export const photos: Photo[] = data.photos;

const photoById = new Map<string, Photo>(photos.map((p) => [p.id, p]));

export function getPhoto(id: string): Photo {
  const photo = photoById.get(id);
  if (!photo) throw new Error(`Unknown photo id: ${id}`);
  return photo;
}

/** 某一系列的全部照片，按 order 字段排序（系列页与 /work 共用同一份数据模型） */
export function photosForSeries(series: Series): Photo[] {
  return series.photoIds.map(getPhoto).sort((a, b) => a.order - b.order);
}

export function getSeries(id: string): Series | undefined {
  return seriesList.find((s) => s.id === id);
}

export function categoryLabel(categoryId: string): string {
  return categories.find((c) => c.id === categoryId)?.label ?? categoryId;
}

/** 按分类筛选；"all" 返回全部（保持 photos.json 原始顺序） */
export function filterByCategory(categoryId: string): Photo[] {
  if (categoryId === "all") return photos;
  return photos.filter((p) => p.category === categoryId);
}
