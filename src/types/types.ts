export interface Asset {
  id: string
  collection_id: string
  name: string
  image_url: string
  width: number | null
  height: number | null
  is_premium: boolean
  created_at: string
  format: string | null
}

export interface Collection {
  id: string
  name: string
  preview_images: string[]
  category_id: string
  created_at: string
  assets?: Array<{
    id: string
    image_url: string
    name?: string
    is_premium?: boolean
  }>
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