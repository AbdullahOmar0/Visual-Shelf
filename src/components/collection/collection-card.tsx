import { CollectionCardProps } from '../../types/ui.types'

export function CollectionCard({ title, images, onClick, isPremium }: CollectionCardProps) {
  const placeholderImages = [
    'https://via.placeholder.com/120',
    'https://via.placeholder.com/120'
  ]
  
  const displayImages = images.length > 0 
    ? images.slice(0, 2) 
    : placeholderImages

  const isSingleAsset = images.length === 1

  if (isSingleAsset) {
    return (
      <div 
        onClick={onClick}
        className="flex flex-col items-center cursor-pointer group"
      >
        <div className="relative w-[220px] h-[145px] transition-transform duration-300 group-hover:scale-105 -top-[5px]">
          {isPremium && (
            <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
              Premium
            </div>
          )}
          <div
            className="w-full h-full rounded-xl overflow-hidden shadow-lg"
            style={{
              border: '2px solid #FFFFFF',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
            }}
          >
            <img 
              src={images[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h3 className="mt-2 text-center font-serif text-[#111111] text-xl">
          {title}
        </h3>
      </div>
    )
  }

  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer group"
    >
      <div className="relative w-[233px] h-[147px]">
        {displayImages.map((image, i) => (
          <div
            key={i}
            className={`
              absolute w-[135px] h-[135px] 
              rounded-[9px] shadow-lg 
              transition-transform duration-300
              ${i === 0 
                ? 'rotate-[15deg] translate-x-[90px] z-0' 
                : '-rotate-[15deg] translate-y-[0px] z-10'}
              group-hover:scale-105
            `}
            style={{
              border: '3px solid #EDEDED'
            }}
          >
            <img 
              src={image}
              alt=""
              className="w-full h-full object-cover rounded-[6px]"
            />
          </div>
        ))}
      </div>
      <h3 className="text-center font-serif text-[#111111] text-xl">
        {title}
      </h3>
    </div>
  )
}