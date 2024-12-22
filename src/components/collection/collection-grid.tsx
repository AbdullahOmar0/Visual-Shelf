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
  activeGradient,
  text_color,
  isMainView = false
}: CollectionGridProps) {
  const settings = {
    dots: false,
    arrows: false,
    infinite: collections.length > 3,
    autoplay: collections.length > 3,
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
    ],
  }

  return (
    <section className="w-full px-8 py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif" style={{ color: text_color || '#365710' }}>{title}</h2>
        <button 
          onClick={onExploreAll}
          className="w-fit h-fit rounded-md px-4 py-2 text-sm shadow-sm transition-colors"
          style={{
            background: activeGradient || '#F8F8F8',
            color: text_color || '#111111'
          }}
        >
          {isMainView 
            ? `Explore All ${collections.length} Packs`
            : `View All ${collections[0].assets?.length || 0} Assets`
          }
        </button>
      </div>
      
      <div className="relative h-[200px] py-1">
        <div className="absolute inset-x-0 top-[0px] h-[215px] bg-[#F8F8F8] rounded-2xl" />
        <div className="relative z-10 -mx-20">
          <Slider {...settings}>
            {isMainView ? (
              // Hauptseiten-Ansicht: Collections als Karten
              collections.map(collection => (
                <div key={collection.id} className="px-8">
                  <CollectionCard
                    title={collection.name}
                    images={collection.assets?.map(asset => asset.image_url) || []}
                    onClick={() => onCollectionClick(collection.id)}
                  />
                </div>
              ))
            ) : (
              // Detailansicht: Assets der Collection
              collections[0].assets?.map((asset, index) => (
                <div key={asset.id || index} className="px-2">
                  <CollectionCard
                    title={asset.name || `${collections[0].name} - ${index + 1}`}
                    images={[asset.image_url]}
                    onClick={() => onCollectionClick(collections[0].id)}
                    isPremium={asset.is_premium}
                  />
                </div>
              ))
            )}
          </Slider>
        </div>
      </div>
    </section>
  )
}