export interface Asset {
  id: string
  name: string
  image_url: string
  is_premium: boolean
  width?: number
  height?: number
  file_size?: number
  format?: string
  created_at?: string
  collection_id?: string
}

export interface Collection {
  id: string
  name: string
  category_id: string
  created_at: string
  assets?: Asset[]
}

export interface Category {
  // Zusätzliche Geschäftslogik-Eigenschaften hier
} 