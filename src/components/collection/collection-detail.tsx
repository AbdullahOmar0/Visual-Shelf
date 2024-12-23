import { Collection } from '../../types/motif.types'
import { useState, useEffect } from 'react'
import { framer } from 'framer-plugin'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'

interface CollectionDetailProps {
  collection: Collection
  onInsert: (assetId: string) => void
  onBack: () => void
}

const getFormatColor = (format: string) => {
  const colors: { [key: string]: string } = {
    'jpg': 'bg-blue-100 text-blue-700',
    'jpeg': 'bg-blue-100 text-blue-700',
    'png': 'bg-green-100 text-green-700',
    'svg': 'bg-purple-100 text-purple-700',
    'webp': 'bg-orange-100 text-orange-700'
  }
  return colors[format.toLowerCase()] || 'bg-gray-100 text-gray-700'
}

export function CollectionDetail({ collection, onInsert, onBack }: CollectionDetailProps) {
  const [selectedAsset, setSelectedAsset] = useState(collection.assets?.[0])
  const [isInserting, setIsInserting] = useState(false)
  const [imageMetadata, setImageMetadata] = useState<{width: number, height: number}>()

  useEffect(() => {
    if (selectedAsset?.image_url) {
      const img = new Image()
      img.src = selectedAsset.image_url
      img.onload = () => {
        setImageMetadata({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }
    }
  }, [selectedAsset?.image_url])

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
        {/* Hauptbild-Container mit mehr Breite */}
        <div className="w-2/3">
          <div className="relative aspect-[16/9] mb-4">
            <img 
              src={selectedAsset?.image_url} 
              alt={selectedAsset?.name}
              className="absolute inset-0 w-full h-full object-contain bg-gray-50 rounded-lg shadow-lg"
            />
            {selectedAsset?.is_premium && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                Premium
              </div>
            )}
          </div>
          
          {/* Asset Name mit Info-Popover */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-medium text-gray-900 mb-1">
              {selectedAsset?.name || 'Untitled Motif'}
            </h3>
            
            <Popover.Root>
              <Popover.Trigger asChild>
                <a className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                  <InfoCircledIcon className="w-5 h-5" />
                </a>
              </Popover.Trigger>
              
              <Popover.Portal>
                <Popover.Content
                  className="rounded-lg bg-white p-5 shadow-xl border border-gray-200 w-72 animate-slideDownAndFade  font-mono"
                  side="top"
                  align="end"
                  sideOffset={5}
                >
                  <div className="space-y-3">
                    <h4 className="font-medium text-lg text-gray-900 border-b border-gray-200 pb-2 font-mono  ">Asset Information</h4>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        {selectedAsset?.format && (
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${getFormatColor(selectedAsset.format)}`}>
                            {selectedAsset.format}
                          </span>
                        )}
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                          selectedAsset?.is_premium 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {selectedAsset?.is_premium ? 'Premium' : 'Free'}
                        </span>
                      </div>

                      {(imageMetadata?.width || selectedAsset?.width) && (
                        <div className="flex items-center justify-between text-sm bg-gray-50 p-2.5 rounded-lg">
                          <span className="text-gray-500">Dimensions</span>
                          <span className="text-gray-900 font-medium">
                            {imageMetadata?.width || selectedAsset?.width} × {imageMetadata?.height || selectedAsset?.height}px
                          </span>
                        </div>
                      )}

                      
                     
                    </div>
                  </div>
                  
                  <Popover.Arrow className="fill-white w-4 h-2" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>

          <button 
            onClick={handleInsert}
            disabled={isInserting}
            className={`w-full h-fit py-3 px-4 bg-black text-white rounded-lg transition-colors
              ${isInserting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}
              font-medium
            `}
          >
            {isInserting ? 'Inserting...' : 'Insert Motif'}
          </button>
        </div>

        {/* Thumbnail-Grid mit weniger Breite */}
        <div className="w-1/3 grid grid-cols-2 gap-2  h-[370px] ">
          {collection.assets?.map(asset => (
            <div 
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="relative aspect-[16/9] cursor-pointer rounded-lg overflow-hidden group"
            >
              <img 
                src={asset.image_url} 
                alt={asset.name}
                className={`absolute inset-0 w-full h-full object-contain bg-gray-50 transition-transform duration-200
                  ${selectedAsset?.id === asset.id ? 'ring-2 ring-blue-500' : ''}
                  group-hover:scale-105
                `}
              />
              {asset.is_premium && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                  Premium
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 