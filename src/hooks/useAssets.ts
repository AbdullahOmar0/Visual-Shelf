import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Asset } from '../types/types'

export function useAssets(collectionId?: string) {
  return useQuery<Asset[]>({
    queryKey: ['assets', collectionId],
    queryFn: async () => {
      let query = supabase
        .from('assets')
        .select('*')
      
      if (collectionId) {
        query = query.eq('collection_id', collectionId)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    }
  })
} 