import { CollectionCardProps } from '../../types/ui.types'

export function CollectionCard({ title, images, onClick }: CollectionCardProps) {
  const placeholderImages = [
    'https://via.placeholder.com/120',
    'https://via.placeholder.com/120'
  ]
  
  const displayImages = images.length > 0 
    ? images.slice(0, 2) 
    : placeholderImages

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
              boxShadow: '0px 4px 13.6px rgba(0, 0, 0, 0.25)',
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
      <h3 className=" text-center font-serif text-[#111111] text-xl">
        {title}
      </h3>
    </div>
  )
}