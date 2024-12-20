export interface Asset {
  id: string
  collection_id: string
  name: string
  image_url: string
  width: number
  height: number
  is_premium: boolean
  format: string
  created_at: string
}

export interface Collection {
  id: string
  name: string
  category_id: string
  created_at: string
  assets?: Asset[]
}

export interface Category {
  id: string
  name: string
  slug: string
  active_gradient: string | null
  text_color: string | null
  label: string
  created_at: string
}

export interface CollectionCardProps {
  title: string
  images: string[]
  onClick: () => void
}

export interface CollectionGridProps {
  title: string
  collections: Collection[]
  onExploreAll: () => void
  onCollectionClick: (id: string) => void
  activeGradient?: string | null
}

export interface NavProps {
  activeCategory: string
  onCategorySelect: (category: string) => void
}

export interface BannerProps {
  onExplore: () => void
} 