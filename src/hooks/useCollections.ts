import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Collection } from '../types/motif.types'
import { Asset } from '../types/types'

export function useCollections() {
  return useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data: collections, error: collectionsError } = await supabase
        .from('collections')
        .select(`
          *,
          assets (
            id,
            name,
            image_url,
            is_premium
          )
        `)
        .order('created_at', { ascending: false })

      if (collectionsError) {
        console.error('Error loading collections:', collectionsError)
        throw collectionsError
      }

      if (!collections) return []

      return collections.map(collection => ({
        ...collection,
        assets: collection.assets || [],
        preview_images: collection.assets?.map((asset: Asset) => asset.image_url) || []
      }))
    }
  })
} 