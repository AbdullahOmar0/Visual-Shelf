import { Collection } from '../../types/motif.types'
import { useState, useEffect } from 'react'
import { framer } from 'framer-plugin'
import { InfoCircledIcon, StarFilledIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import { useLicense } from '../../hooks/use-license'

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
  const { isValid: hasValidLicense } = useLicense()

  const handleInsert = async () => {
    if (!selectedAsset) return
    if (selectedAsset.is_premium && !hasValidLicense) return
    
    try {
      setIsInserting(true)

      await framer.addImage({
        image: selectedAsset.image_url,
        name: selectedAsset.name || 'Background Motif',
        resolution: selectedAsset.is_premium ? "full" : "medium"
      })

      onInsert(selectedAsset.id)
      
      framer.notify(selectedAsset.is_premium 
        ? "Premium motif added in full resolution!" 
        : "Motif added in standard resolution. Upgrade to premium for full quality!")
      
    } catch (error) {
      console.error('Failed to insert image:', error)
      framer.notify("Failed to add motif. Please try again.")
    } finally {
      setIsInserting(false)
    }
  }

  const getButtonText = () => {
    if (isInserting) return 'Inserting...'
    if (selectedAsset?.is_premium && !hasValidLicense) {
      return 'Upgrade to Premium '
    }
    return 'Insert Motif'
  }

  const getButtonStyle = () => {
    if (isInserting) {
      return 'opacity-50 cursor-not-allowed bg-black'
    }
    if (selectedAsset?.is_premium && !hasValidLicense) {
      return 'text-white bg-gradient-to-t from-[#0063FF] to-[#4E93FF] text-black font-semibold'
    }
    return 'bg-gradient-to-t from-[#000000] to-[#414141] hover:bg-gray-700 text-white'
  }

  // Vorschaubilder werden als Base64 Data URLs gespeichert
  const [previewDataUrls, setPreviewDataUrls] = useState<{[key: string]: string}>({})

  useEffect(() => {
    async function generatePreviews() {
      if (!collection.assets) return

      const newPreviews: {[key: string]: string} = {}
      
      for (const asset of collection.assets) {
        try {
          // Lade das Bild mit sehr niedriger Auflösung (10% der Originalgröße)
          const response = await fetch(`${asset.image_url}?width=100`)
          const blob = await response.blob()
          
          // Konvertiere zu Base64 Data URL mit zusätzlicher Komprimierung
          const img = new Image()
          img.src = URL.createObjectURL(blob)
          
          await new Promise((resolve) => {
            img.onload = () => {
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              
              // Setze eine sehr niedrige Auflösung für die Vorschau
              canvas.width = 900
              canvas.height = (img.height / img.width) * 900
              
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
              
              // Komprimiere stark für die Vorschau
              const dataUrl = canvas.toDataURL('image/jpeg',50)
              newPreviews[asset.id] = dataUrl
              setPreviewDataUrls(prev => ({...prev, [asset.id]: dataUrl}))
              
              URL.revokeObjectURL(img.src)
              resolve(null)
            }
          })
        } catch (error) {
          console.error('Failed to generate preview:', error)
        }
      }
    }

    generatePreviews()
  }, [collection.assets])

  return (
    <div className="w-full p-8 ">
      <div className="flex gap-8">
        <div className="w-2/3 ">
          <div className="relative aspect-[16/9] mb-4 bg-gray-50 rounded-lg shadow-lg overflow-hidden">
            {selectedAsset && previewDataUrls[selectedAsset.id] && (
              <img 
                src={previewDataUrls[selectedAsset.id]}
                alt={selectedAsset.name}
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
            {selectedAsset?.is_premium && !hasValidLicense && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-1.5">
                <StarFilledIcon className="w-4 h-4" />
                <span className="translate-y-[0.5px]">Premium</span>
              </div>
            )}
          </div>
          
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

          {selectedAsset?.is_premium && !hasValidLicense ? (
            <a 
              href="https://visualshelf.framer.website/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full h-fit py-3 px-4 rounded-lg transition-all text-center block text-base
                ${getButtonStyle()}
                font-medium
              `}
              
            >
              {getButtonText()}
            </a>
          ) : (
            <button 
              onClick={handleInsert}
              disabled={isInserting}
              className={`w-full h-fit py-3 px-4 rounded-lg transition-all text-base
                ${getButtonStyle()}
                font-medium
              `}
            >
              {getButtonText()}
            </button>
          )}
        </div>

        <div className="w-1/3 grid grid-cols-2 gap-2 h-[355px]">
          {collection.assets?.map(asset => (
            <div 
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="relative aspect-[16/9] cursor-pointer rounded-lg overflow-hidden group bg-gray-50"
            >
              {previewDataUrls[asset.id] && (
                <img 
                  src={previewDataUrls[asset.id]}
                  alt={asset.name}
                  className={`absolute inset-0 w-full h-full object-contain transition-transform duration-200
                    ${selectedAsset?.id === asset.id ? 'ring-2 ring-blue-500' : ''}
                    group-hover:scale-105
                  `}
                />
              )}
              {asset.is_premium && !hasValidLicense && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full shadow-sm">
                  <StarFilledIcon className="w-3.5 h-3.5 " />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 