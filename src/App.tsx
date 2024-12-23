import { useState } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { Nav } from './components/navigation/nav'
import { Banner } from './components/banner/banner'
import { useCategories } from './hooks/useCategories'
import { useCollections } from './hooks/useCollections'
import { TabContent } from './components/tabs/tab-content'
import './styles/slider.css'
import { CollectionDetail } from './components/collection/collection-detail'

function CollectionRoute({ onInsert }: { onInsert: (assetId: string) => void }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: collections } = useCollections()
  
  const collection = collections?.find(c => c.id === id)
  if (!collection) return <div>Collection nicht gefunden</div>
  
  return (
    <CollectionDetail 
      collection={collection}
      onInsert={onInsert}
      onBack={() => navigate(-1)}
    />
  )
}

export function App() {
  const [activeCategory, setActiveCategory] = useState('')
  const navigate = useNavigate()
  
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: collections, isLoading: collectionsLoading } = useCollections()

  const collectionsWithPreviews = collections?.map(collection => ({
    ...collection,
    preview_images: collection.assets?.map((asset: { image_url: string }) => asset.image_url) || []
  }))

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category)
    if (category === '') {
      navigate('/')
    } else {
      const selectedCategory = categories?.find(c => c.slug === category)
      if (selectedCategory) {
        navigate(`/category/${selectedCategory.id}`)
      }
    }
  }

  try {
    const handleExplore = () => {
      console.log('Explore clicked')
    }

    const handleCollectionClick = (id: string) => {
      console.log('Collection clicked:', id)
    }

    const handleExploreAll = (categoryId?: string) => {
      if (categoryId) {
        const category = categories?.find(c => c.id === categoryId)
        if (category) {
          setActiveCategory(category.slug)
          navigate(`/category/${categoryId}`)
        }
      } else {
        // Normale "View All Assets" Logik
      }
    }

    const handleInsert = (assetId: string) => {
      console.log('Insert asset:', assetId)
    }

    if (categoriesLoading || collectionsLoading) {
      return <div>Loading...</div>
    }

    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-[700px] mx-auto">
          <Nav 
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
          />
          <div className="mt-4">
            <Routes>
              <Route path="/" element={
                <>
                  {!activeCategory && <Banner onExplore={handleExplore} />}
                  <TabContent 
                    activeCategory={activeCategory}
                    categories={categories}
                    collectionsWithPreviews={collectionsWithPreviews}
                    handleCollectionClick={handleCollectionClick}
                    handleExploreAll={handleExploreAll}
                  />
                </>
              } />
              <Route path="/category/:categoryId" element={
                <TabContent 
                  activeCategory={activeCategory}
                  categories={categories}
                  collectionsWithPreviews={collectionsWithPreviews}
                  handleCollectionClick={handleCollectionClick}
                  handleExploreAll={handleExploreAll}
                />
              } />
              <Route 
                path="/collection/:id" 
                element={<CollectionRoute onInsert={handleInsert} />} 
              />
            </Routes>
          </div>
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
