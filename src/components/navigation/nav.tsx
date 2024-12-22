import { NavProps } from '../../types/ui.types'
import { useCategories } from '../../hooks/useCategories'

export function Nav({ activeCategory, onCategorySelect }: NavProps) {
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return <div className="p-4">Lade Kategorien...</div>
  }

  const getGradientStyle = (gradient: string | null | undefined) => {
    return gradient ? { background: gradient } : {}
  }

  const getTextColorStyle = (color: string | null | undefined) => {
    return color ? { color: color } : {}
  }

  // Standard styles für den "All" Tab
  const allTabStyle = !activeCategory ? {
    background: 'linear-gradient(to bottom right, #585858, #000000)',
    borderimage: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0) 10%, hsla(0, 0%, 100%, .3) 50%, hsla(0, 0%, 100%, 0) 90%) 1 / 2px',
    color: '#FFFFFF',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 0 6px rgba(0,0,0,0.02)'
  } : {
    color: '#333333'
  }

  return (
    <header className="w-full max-w-[700px] mx-auto py-3 border-b border-[#f8f8f8]">
      <nav className="flex gap-2.5 px-5">
        <div 
          onClick={() => onCategorySelect('')}
          className="cursor-pointer rounded-md px-3 py-1.5 text-sm"
          style={allTabStyle}
        >
          All
        </div>

        {categories?.map(category => (
          <div 
            key={category.id}
            onClick={() => onCategorySelect(category.slug)}
            className="cursor-pointer rounded-md px-3 py-1.5 text-sm"
            style={{
              ...(activeCategory === category.slug ? getGradientStyle(category.active_gradient) : {}),
              ...getTextColorStyle(category.text_color),
              ...(activeCategory === category.slug ? { boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 0 6px rgba(0,0,0,0.02)' } : {})
            }}
          >
            {category.label}
          </div>
        ))}
      </nav>
    </header>
  )
}
