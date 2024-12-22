// Exakte Abbildung der Supabase Tabellen
export interface DatabaseAsset {
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

export interface DatabaseCollection {
  id: string
  name: string
  category_id: string
  created_at: string
}

export interface DatabaseCategory {
  id: string
  name: string
  slug: string
  active_gradient: string | null
  text_color: string | null
  label: string
  created_at: string
} 