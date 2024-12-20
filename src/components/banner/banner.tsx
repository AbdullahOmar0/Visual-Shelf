import { BannerProps } from '../../types/ui.types'

export function Banner({ onExplore }: BannerProps) {
  return (
    <div className="relative w-[638px] h-[250px] mx-auto mt-8 rounded-2xl overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/banner.png')"
        }}
      />
      <div 
        className="absolute inset-0"
      
      />
      
      <div className="relative z-10 p-7 flex flex-col h-full">
        <h1 className="text-5xl font-serif text-[#f8f8f8] max-w-[376px]">
          Browse our collections
        </h1>
        <button 
          onClick={onExplore}
          className="w-fit h-fit self-start mt-8 bg-gradient-to-br from-white to-[#fafafa] text-[#111111] rounded-md px-4 py-1.5 text-sm shadow-md hover:opacity-90 transition-opacity"
        >
          explore now
        </button>
      </div>
    </div>
  )
}