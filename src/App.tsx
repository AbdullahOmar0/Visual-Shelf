import { useState } from 'react'
import { Nav } from './components/navigation/nav'
import { Banner } from './components/banner/banner'
import { CollectionGrid } from './components/collection/collection-grid'
import { useCategories } from './hooks/useCategories'
import { useCollections } from './hooks/useCollections'
import { Category } from './types/ui.types'
import './styles/slider.css'

export function App() {
  const [activeCategory, setActiveCategory] = useState('')
  
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: collections, isLoading: collectionsLoading } = useCollections()

  const collectionsWithPreviews = collections?.map(collection => ({
    ...collection,
    preview_images: collection.assets?.map(asset => asset.image_url) || []
  }))

  try {
    const handleExplore = () => {
      console.log('Explore clicked')
    }

    const handleCollectionClick = (id: string) => {
      console.log('Collection clicked:', id)
    }

    if (categoriesLoading || collectionsLoading) {
      return <div>Loading...</div>
    }

    // Wenn keine Kategorie ausgewählt ist, zeige alle Kategorien mit ihren Collections
    if (!activeCategory && categories) {
      return (
        <div className="w-full min-h-screen bg-white">
          <div className="w-full max-w-[700px] mx-auto">
            <Nav 
              activeCategory={activeCategory}
              onCategorySelect={setActiveCategory}
            />
            <Banner onExplore={handleExplore} />
            
            {categories.map((category: Category) => {
              const categoryCollections = collectionsWithPreviews?.filter(
                c => c.category_id === category.id
              ) || []

              return (
                <CollectionGrid
                  key={category.id}
                  title={category.label}
                  collections={categoryCollections}
                  onExploreAll={handleExplore}
                  onCollectionClick={handleCollectionClick}
                  activeGradient={category.active_gradient}
                />
              )
            })}
          </div>
        </div>
      )
    }

    // Wenn eine Kategorie ausgewählt ist, zeige nur deren Collections
    const filteredCollections = collections?.filter(
      c => c.category_id === activeCategory
    ) || []

    return (
      <div className="w-full min-h-screen bg-white">
        <div className="w-full max-w-[700px] mx-auto">
          <Nav 
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
          />
          <Banner onExplore={handleExplore} />
          <CollectionGrid
            title={categories?.find(c => c.id === activeCategory)?.label || 'All Collections'}
            collections={filteredCollections}
            onExploreAll={handleExplore}
            onCollectionClick={handleCollectionClick}
            activeGradient={categories?.find(c => c.id === activeCategory)?.active_gradient}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Plugin Error:', error)
    return (
      <div className="p-4">
        <h2 className="text-red-500 font-bold mb-2">Something went wrong</h2>
        <pre className="text-sm bg-gray-100 p-2 rounded">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    )
  }
}
