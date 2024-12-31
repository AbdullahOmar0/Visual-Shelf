import { useState, useCallback, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { PersonIcon, GlobeIcon, QuestionMarkCircledIcon, ExitIcon, SunIcon, ArrowLeftIcon } from '@radix-ui/react-icons'
import { useLicense } from '../hooks/use-license'
import ReactConfetti from 'react-confetti'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLicenseDialogOpen, setIsLicenseDialogOpen] = useState(false)
  const [licenseKey, setLicenseKey] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const { isValid, customerName, activateLicense, deactivateLicense } = useLicense()

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleActivateClick = () => {
    setIsLicenseDialogOpen(true)
  }

  const handleLicenseSubmit = async () => {
    if (!licenseKey) {
      setError('Bitte gib einen Lizenzschlüssel ein')
      return
    }

    if (!email) {
      setError('Bitte gib deine E-Mail-Adresse ein')
      return
    }

    if (!email.includes('@')) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await activateLicense(licenseKey, email)
      if (result.success) {
        setShowConfetti(true)
        // Warte kurz mit dem Schließen des Dialogs, damit der Benutzer die Konfetti sieht
        setTimeout(() => {
          setIsLicenseDialogOpen(false)
          setLicenseKey('')
          setEmail('')
          // Stoppe die Konfetti nach einer Weile
          setTimeout(() => setShowConfetti(false), 3500)
        }, 2000)
      } else {
        setError(result.error || 'Ungültiger Lizenzschlüssel')
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  const menuItems = [
    {
      icon: isValid ? <ExitIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />,
      title: isValid ? "Logout" : "Activate License Key",
      subtitle: isValid ? "Sign out from your account" : "Sign in to your account",
      onClick: isValid ? () => {
        deactivateLicense()
        setIsOpen(false)
      } : handleActivateClick
    },
    {
      icon: <GlobeIcon className="w-5 h-5" />,
      title: "Our Website",
      subtitle: "Visit our official website",
      onClick: () => window.open('https://your-website.com', '_blank')
    },
    {
      icon: <QuestionMarkCircledIcon className="w-5 h-5" />,
      title: "Get Support",
      subtitle: "Reach out for help and support",
      onClick: () => window.open('https://your-support.com', '_blank')
    }
  ]

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[200]">
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={1000}
            gravity={0.15}
            initialVelocityX={{ min: -15, max: 15 }}
            initialVelocityY={{ min: -45, max: -15 }}
            colors={[
              '#FF0000', // Rot
              '#FFD700', // Gold
              '#FF69B4', // Pink
              '#00FF00', // Hellgrün
              '#FFA500', // Orange
              '#4169E1', // Königsblau
              '#FF1493', // Deep Pink
              '#00FFFF', // Cyan
              '#FF4500', // Orange Rot
              '#32CD32', // Lime Grün
              '#FF00FF', // Magenta
              '#FFD700', // Gold
              '#FF8C00', // Dark Orange
              '#7FFF00'  // Chartreuse
            ]}
            tweenDuration={5000}
            friction={0.99}
            wind={0}
            confettiSource={{
              x: windowSize.width / 2,
              y: windowSize.height - 20,
              w: 0,
              h: 0
            }}
            opacity={1}
            run={true}
            drawShape={ctx => {
              const starPoints = 5;
              const outerRadius = 10;
              const innerRadius = 5;
              
              ctx.beginPath();
              for(let i = 0; i < starPoints * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / starPoints;
                if(i === 0) {
                  ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                } else {
                  ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                }
              }
              ctx.closePath();
              ctx.fill();
            }}
          />
        </div>
      )}

      <a
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <PersonIcon className="w-6 h-6" />
      </a>

      {/* Main Menu Dialog */}
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

          <div className="fixed inset-0 w-full ">
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
                {isValid && (
                  <div className="flex flex-col items-center  px-4 border-b border-gray-100 ">
                    <div className="w-20 h-20 mb-4">
                      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-semibold">
                        {customerName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">{customerName}</h2>
                    <div className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm">
                      Premium Member
                    </div>
                  </div>
                )}  
                {/* banner*/}
                {!isValid && (
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
                )}
                {/* Menu Items */}
                <div className="px-4 py-2 space-y-2 ">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="w-full h-fit flex items-center justify-between p-4 hover:bg-gray-50 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-gray-500">{item.icon}</div>
                        <div className="text-left">
                          <div className="text-[15px] font-semibold text-gray-900">{item.title}</div>
                          <div className="text-[13px] text-gray-500/80">{item.subtitle}</div>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* License Activation Dialog */}
      <Transition appear show={isLicenseDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100]"
          onClose={() => !isLoading && setIsLicenseDialogOpen(false)}
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
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                  <div className="absolute right-4 top-4">
                    <button
                      onClick={() => !isLoading && setIsLicenseDialogOpen(false)}
                      disabled={isLoading}
                      className="rounded-full p-1 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  <Dialog.Title className="text-lg font-medium mb-4">
                    Lizenz aktivieren
                  </Dialog.Title>
                  
                  <div className="space-y-4 relative">
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          <span className="text-sm text-gray-600">Aktiviere Lizenz...</span>
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-gray-600 mb-4">
                      Gib deinen Lizenzschlüssel und die E-Mail-Adresse ein, die du beim Kauf verwendet hast.
                    </div>
                    
                    <input
                      type="text"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value.replace(/[^A-Za-z0-9-]/g, ''))}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      disabled={isLoading}
                      className="w-full h-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    />
                    
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-Mail-Adresse"
                      disabled={isLoading}
                      className="w-full h-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    />

                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M12 9v4M12 17h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleLicenseSubmit}
                      disabled={isLoading}
                      className="w-full h-fit bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      Aktivieren
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
} 