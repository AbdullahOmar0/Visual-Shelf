import type { Collection } from './motif.types'

export interface CollectionCardProps {
  title: string
  images: string[]
  onClick: () => void
  isPremium?: boolean
}

export interface CollectionGridProps {
  title: string
  collections: Collection[]
  onExploreAll: (categoryId?: string) => void
  onCollectionClick: (id: string) => void
  activeGradient?: string
  text_color?: string
  isMainView?: boolean
  categoryId?: string
}

export interface NavProps {
  activeCategory: string
  onCategorySelect: (category: string) => void
}

export interface BannerProps {
  onExplore: () => void
}

export interface Category {
  id: string
  label: string
  slug: string
  active_gradient?: string
  text_color?: string
} 