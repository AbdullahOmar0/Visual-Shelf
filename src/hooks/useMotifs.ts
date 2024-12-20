import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Motif } from '../types/motif.types'

export function useMotifs(category?: string) {
  return useQuery<Motif[]>({
    queryKey: ['motifs', category],
    queryFn: async () => {
      let query = supabase
        .from('motifs')
        .select('*')
      
      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    }
  })
} 