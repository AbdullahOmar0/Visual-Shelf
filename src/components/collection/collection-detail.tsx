import { Collection } from '../../types/motif.types'
import { useState } from 'react'

interface CollectionDetailProps {
  collection: Collection
  onInsert: (assetId: string) => void
  onBack: () => void
}

export function CollectionDetail({ collection, onInsert, onBack }: CollectionDetailProps) {
  const [selectedAsset, setSelectedAsset] = useState(collection.assets?.[0])

  return (
    <div className="w-full p-8">
   {/*   <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          &lt; back to category
        </button>
        <h1 className="text-2xl font-serif">{collection.name}</h1>
      </div>*/}

      <div className="flex gap-8">
        {/* Großes Hauptbild */}
        <div className="w-1/2">
          <img 
            src={selectedAsset?.image_url} 
            alt={selectedAsset?.name}
            className="w-full rounded-lg shadow-lg"
          />
          <button 
            onClick={() => selectedAsset && onInsert(selectedAsset.id)}
            className="mt-4 w-full py-2 bg-gray-800 text-white rounded-md"
          >
            Insert
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