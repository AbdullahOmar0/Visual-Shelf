import type { DatabaseAsset, DatabaseCollection, DatabaseCategory } from './database.types'

export interface Asset extends Omit<DatabaseAsset, 'width' | 'height' | 'format'> {
  width: number
  height: number
  format: string
}

export interface Collection extends Omit<DatabaseCollection, 'preview_images'> {
  preview_images?: string[]
  assets?: Asset[]
}

export interface Category extends DatabaseCategory {
  // Zusätzliche Geschäftslogik-Eigenschaften hier
} 