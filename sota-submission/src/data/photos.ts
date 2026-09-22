import data from './photos.json'

export type CategoryId = 'portrait' | 'landscape' | 'pastoral'

export interface Photo {
  id: string
  category: CategoryId
  seriesId: string
  file: string
  title: string
  altText: string
  caption: string
  width: number
  height: number
  order: number
}

export interface Series {
  id: string
  title: string
  category: string
  summary: string
  photoIds: string[]
}

export interface Category {
  id: string
  label: string
}

export interface PhotoData {
  categories: Category[]
  series: Series[]
  photos: Photo[]
}

/** mock-data/photos.json 的唯一应用内入口，所有页面共享同一份数据模型。 */
export const photoData = data as PhotoData

export const allPhotos: Photo[] = photoData.photos
export const categories: Category[] = photoData.categories
export const seriesList: Series[] = photoData.series

export function photosForCategory(category: string): Photo[] {
  return category === 'all' ? allPhotos : allPhotos.filter(p => p.category === category)
}

export function photosForSeries(seriesId: string): Photo[] {
  return allPhotos.filter(p => p.seriesId === seriesId).sort((a, b) => a.order - b.order)
}

export function seriesById(seriesId: string): Series | undefined {
  return seriesList.find(s => s.id === seriesId)
}

export function categoryLabel(categoryId: string): string {
  return categories.find(c => c.id === categoryId)?.label ?? categoryId
}

export function photoUrl(photo: Photo): string {
  return `/${photo.file}`
}
