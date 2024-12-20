import { CollectionGridProps } from '../../types/ui.types'
import { CollectionCard } from './collection-card'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export function CollectionGrid({ 
  title, 
  collections, 
  onExploreAll, 
  onCollectionClick,
  activeGradient 
}: CollectionGridProps) {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1000,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: true,
    swipeToSlide: true,
    waitForAnimate: false,
    useCSS: true,
    useTransform: true,
    variableWidth: false,
    centerMode: false,
    edgeFriction: 5.35,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
  }

  return (
    <section className="w-full px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif text-[#365710]">{title}</h2>
        <button 
          onClick={onExploreAll}
          className="w-fit h-fit text-[#111111] rounded-md px-4 py-2 text-sm shadow-sm transition-colors"
          style={{
            background: activeGradient || '#F8F8F8'
          }}
        >
          Explore All {collections.length} Packs
        </button>
      </div>
      
      <div className="relative h-[400px]">
        <div className="absolute inset-x-0 top-[100px] h-[200px] bg-[#F8F8F8] rounded-2xl" />
        <div className="relative z-10 -mx-20">
          <Slider {...settings}>
            {collections.map(collection => (
              <div key={collection.id} className="px-8 ">
                <CollectionCard
                  title={collection.name}
                  images={collection.assets?.map(asset => asset.image_url) || []}
                  onClick={() => onCollectionClick(collection.id)}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}