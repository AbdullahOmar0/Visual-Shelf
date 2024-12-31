import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { StarIcon, ArrowLeftIcon, StarFilledIcon } from '@radix-ui/react-icons'


export function PrimeDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const features = [
    [
      {
        title: "Unlimited access for lifetime",
        subtitle: "Zugang zu allen Premium-Assets",
        gradient: "from-[#FDF1C5] to-[#FAE79A]",
        iconColor: "#763612"
      },
     
      {
        title: "Highest quality 4K Resolutions",
        subtitle: "Werbefreie Nutzung",
        gradient: "from-[#ECFFC6] to-[#E1FEA9]",
        iconColor: "#365710"
      }
    ],
    [
      {
        title: "Access all Assets",
        subtitle: "Sehen Sie neue Assets zuerst",
        gradient: "from-[#F3EAFD] to-[#E7D9FC]",
        iconColor: "#8047C8"
      },
      {
        title: "Commercial license",
        subtitle: "Schnelle Hilfe bei Fragen",
        gradient: "from-[#4E93FF] to-[#0063FF]",
        iconColor: "#ffffff"
      }
    ]
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-fit h-fit inline-flex items-center shadow-sm rounded-md px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-t from-[#0063FF] to-[#4E93FF] "
      >
        Upgrade to Prime
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
          
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 w-full">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-full h-full bg-white px-8">
                   {/* Back Button */}
                   <div className=" h-fit w-fit px-4 cursor-pointer pt-4 hover:px-0 transition-all duration-300">
                  <a
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-black hover:text-gray-900 transition-all duration-300 "
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">back</span>
                  </a>
                </div>
                {/* Premium Banner */}
                <div className="py-4 px-4 h-fit">
                  <div className="h-[170px] rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 text-white flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <h3 className="text-2xl font-light mb-2">You only pay once &</h3>
                      <p className="text-3xl text-white font-bold mb-4"> it's forever yours</p>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4">
                      <span className="text-5xl text-white font-bold">$20</span>
                      <button 
                        onClick={() => {
                          console.log('Upgrade clicked')
                        }}
                        className="bg-gradient-to-t from-[#E9E9E9] to-white text-black px-4 py-3 h-fit rounded-lg font-medium text-sm shadow-md"
                      >
                        Access For Lifetime
                      </button>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="px-4 space-y-2.5 max-w-[481px] mx-auto mt-4">
                  {features.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2.5">
                      {row.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex-1 h-[120px] p-2.5"
                        >
                          <div className="flex flex-col gap-2.5 h-fit justify-center items-center ">
                            <div className="w-fit h-fit rounded-[5.5px] bg-gradient-to-b relative flex items-center justify-center">
                              <div className={`w-[40px] h-[40px] rounded-lg bg-gradient-to-b ${feature.gradient}`}>
                                <StarFilledIcon className="w-[20px] h-[20px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ color: feature.iconColor }} />
                              </div>
                            </div>
                            <div>
                              <div className="text-[15px] font-semibold text-gray-900 text-center">{feature.title}</div>
                              {/* <div className="text-[13px] text-gray-500/80  text-center">{feature.subtitle}</div>*/}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
               {/*  <div className="absolute bottom-8 left-8 right-8 ">
                  <button
                    onClick={() => {
                      console.log('Bottom upgrade clicked')
                    }}
                    className="w-full h-fit py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
                  >
                    Jetzt upgraden
                  </button>
                </div> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
} 