import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
  active_gradient: string | null
  text_color: string | null
  label: string
  created_at: string
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    }
  })
} 