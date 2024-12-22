import { CollectionGrid } from '../collection/collection-grid'
import { Category } from '../../types/types'
import '../../styles/categories.css'

interface TabContentProps {
  activeCategory: string
  categories: Category[] | undefined
  collectionsWithPreviews: any[] | undefined
  handleExplore: () => void
  handleCollectionClick: (id: string) => void
}

export function TabContent({ 
  activeCategory, 
  categories, 
  collectionsWithPreviews,
  handleExplore,
  handleCollectionClick 
}: TabContentProps) {
  
  // Wenn keine Kategorie ausgewählt ist, zeige alle Kategorien
  if (!activeCategory && categories) {
    return (
      <div className="categories-container">
        {categories.map((category: Category) => {
          const categoryCollections = collectionsWithPreviews?.filter(
            c => c.category_id === category.id
          ) || []

          if (categoryCollections.length === 0) return null

          return (
            <section key={category.id} className="category-section">
              <CollectionGrid
                title={category.label}
                collections={categoryCollections}
                onExploreAll={handleExplore}
                onCollectionClick={handleCollectionClick}
                activeGradient={category.active_gradient}
                text_color={category.text_color}
                isMainView={true}
              />
            </section>
          )
        })}
      </div>
    )
  }

  // Wenn eine Kategorie ausgewählt ist
  const activeCateg = categories?.find(c => c.slug === activeCategory)
  if (!activeCateg) return null

  // Filtere Collections für die aktive Kategorie
  const filteredCollections = collectionsWithPreviews?.filter(
    c => c.category_id === activeCateg.id
  ) || []

  if (filteredCollections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Keine Collections in dieser Kategorie gefunden.</p>
      </div>
    )
  }

  return (
    <div className="categories-container">
      {filteredCollections.map((collection) => (
        <section key={collection.id} className="category-section">
          <CollectionGrid
            title={collection.name}
            collections={[collection]}
            onExploreAll={handleExplore}
            onCollectionClick={handleCollectionClick}
            activeGradient={activeCateg.active_gradient}
            text_color={activeCateg.text_color}
            isMainView={false}
          />
        </section>
      ))}
    </div>
  )
} 