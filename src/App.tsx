import { useState } from 'react'
import { Nav } from './components/navigation/nav'
import { Banner } from './components/banner/banner'
import { useCategories } from './hooks/useCategories'
import { useCollections } from './hooks/useCollections'
import { TabContent } from './components/tabs/tab-content'
import './styles/slider.css'

export function App() {
  const [activeCategory, setActiveCategory] = useState('')
  
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: collections, isLoading: collectionsLoading } = useCollections()

  const collectionsWithPreviews = collections?.map(collection => ({
    ...collection,
    preview_images: collection.assets?.map((asset: { image_url: string }) => asset.image_url) || []
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

    return (
      <div className="w-full min-h-screen bg-white">
        <div className="w-full max-w-[700px] mx-auto">
          <Nav 
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
          />
          
          {!activeCategory && <Banner onExplore={handleExplore} />}
          
          <TabContent 
            activeCategory={activeCategory}
            categories={categories}
            collectionsWithPreviews={collectionsWithPreviews}
            handleExplore={handleExplore}
            handleCollectionClick={handleCollectionClick}
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
