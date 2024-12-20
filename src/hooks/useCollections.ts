import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Collection, Asset } from '../types/ui.types'

export function useCollections() {
  return useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: async () => {
      // Lade Collections mit ihren Assets
      const { data: collections, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: true })

      if (collectionsError) throw collectionsError

      // Lade alle Assets für die Collections
      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .in('collection_id', collections.map(c => c.id))
        .order('created_at', { ascending: true })

      if (assetsError) throw assetsError

      // Gruppiere Assets nach collection_id
      const assetsByCollection = assets.reduce((acc, asset) => {
        if (!acc[asset.collection_id]) {
          acc[asset.collection_id] = []
        }
        acc[asset.collection_id].push(asset)
        return acc
      }, {} as Record<string, Asset[]>)

      // Füge Assets zu den Collections hinzu
      return collections.map(collection => ({
        ...collection,
        assets: assetsByCollection[collection.id] || []
      }))
    }
  })
} 