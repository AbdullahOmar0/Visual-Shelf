export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string
          collection_id: string
          name: string
          image_url: string
          width: number | null
          height: number | null
          is_premium: boolean | null
          created_at: string
          format: string | null
        }
      }
      collections: {
        Row: {
          id: string
          name: string
          category_id: string
          created_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          active_gradient: string | null
          text_color: string | null
          label: string
          created_at: string
        }
      }
    }
  }
} 