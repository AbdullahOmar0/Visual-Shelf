import { Collection } from '../../types/motif.types'
import { useState } from 'react'
import { framer } from 'framer-plugin'

interface CollectionDetailProps {
  collection: Collection
  onInsert: (assetId: string) => void
  onBack: () => void
}

export function CollectionDetail({ collection, onInsert, onBack }: CollectionDetailProps) {
  const [selectedAsset, setSelectedAsset] = useState(collection.assets?.[0])
  const [isInserting, setIsInserting] = useState(false)

  const handleInsert = async () => {
    if (!selectedAsset) return
    
    try {
      setIsInserting(true)
      
      // Füge das Bild in Framer ein
      await framer.addImage({
        image: selectedAsset.image_url,
        name: selectedAsset.name || 'Background Motif',
      
        resolution: "full" // Höchste Qualität für Hintergrundmotive
      })

      // Benachrichtige den Parent über erfolgreichen Insert
      onInsert(selectedAsset.id)
      
      // Korrekte Verwendung der Framer UI API
      framer.notify("Motif successfully added!")
      
    } catch (error) {
      console.error('Failed to insert image:', error)
      framer.notify("Failed to add motif. Please try again.")
    } finally {
      setIsInserting(false)
    }
  }

  return (
    <div className="w-full p-8">
      <div className="flex gap-8">
        {/* Großes Hauptbild */}
        <div className="w-1/2">
          <img 
            src={selectedAsset?.image_url} 
            alt={selectedAsset?.name}
            className="w-full rounded-lg shadow-lg"
          />
          <button 
            onClick={handleInsert}
            disabled={isInserting}
            className={`mt-4 w-full py-2 bg-gray-800 text-white rounded-md
              ${isInserting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}
            `}
          >
            {isInserting ? 'Inserting...' : 'Insert'}
          </button>
        </div>

        {/* Grid mit Thumbnails */}
        <div className="w-1/2 grid grid-cols-2 gap-4">
          {collection.assets?.map(asset => (
            <div 
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`cursor-pointer rounded-lg overflow-hidden ${
                selectedAsset?.id === asset.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img 
                src={asset.image_url} 
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 