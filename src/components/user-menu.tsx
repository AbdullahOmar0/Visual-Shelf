import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { PersonIcon, GlobeIcon, QuestionMarkCircledIcon, ExitIcon, SunIcon } from '@radix-ui/react-icons'
import { LicenseService } from '../services/license-service'
import { useLicense } from '../hooks/use-license'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isValid, isLoading } = useLicense()
  const [isActivated, setIsActivated] = useState(false)

  useEffect(() => {
    // Aktualisiere den Aktivierungsstatus basierend auf der Lizenzvalidierung
    setIsActivated(isValid)
  }, [isValid])

  async function activateLicense(key: string) {
    try {
      const result = await LicenseService.activateLicense(key)

      if (result.valid) {
        setIsActivated(true)
        setError(null)
        localStorage.setItem('license_key', key)
        setIsOpen(false)
      } else {
        setError(result.error || 'Aktivierung fehlgeschlagen')
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    }
  }

  const handleActivateClick = () => {
    const dialog = document.createElement('dialog')
    dialog.className = 'rounded-xl bg-white p-6 shadow-xl max-w-sm w-full'
    
    const content = `
      <h2 class="text-lg font-medium mb-4">Lizenz aktivieren</h2>
      <div class="space-y-4">
        <div class="text-sm text-gray-600 mb-4">
          Gib deinen Lizenzschlüssel ein, den du nach dem Kauf erhalten hast.
        </div>
        <input
          type="text"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div class="error-container"></div>
        <button
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Aktivieren
        </button>
      </div>
    `
    
    dialog.innerHTML = content
    document.body.appendChild(dialog)
    dialog.showModal()

    const input = dialog.querySelector('input')
    const button = dialog.querySelector('button')
    const errorContainer = dialog.querySelector('.error-container')

    const showError = (message: string) => {
      if (errorContainer) {
        errorContainer.innerHTML = `
          <div class="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4M12 17h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            ${message}
          </div>
        `
      }
    }

    button?.addEventListener('click', async () => {
      if (!input?.value) {
        showError('Bitte gib einen Lizenzschlüssel ein')
        return
      }

      button.disabled = true
      button.innerHTML = `
        <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      `

      try {
        const result = await LicenseService.validateLicense(input.value)
        if (result.valid) {
          await activateLicense(input.value)
          dialog.close()
        } else {
          showError(result.error || 'Ungültiger Lizenzschlüssel')
        }
      } catch (err) {
        showError('Ein unerwarteter Fehler ist aufgetreten')
      } finally {
        button.disabled = false
        button.textContent = 'Aktivieren'
      }
    })

    // Format license key as user types
    input?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement
      let value = target.value.replace(/[^A-Za-z0-9-]/g, '')
      target.value = value
    })

    dialog.addEventListener('close', () => {
      dialog.remove()
    })
  }

  const menuItems = [
    {
      icon: isActivated ? <ExitIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />,
      title: isActivated ? "Logout" : "Activate License Key",
      subtitle: isActivated ? "Sign out from your account" : "Sign in to your account",
      onClick: isActivated ? () => {
        localStorage.removeItem('license_key')
        setIsActivated(false)
        setIsOpen(false)
        window.location.reload() // Seite neu laden um alle Zustände zurückzusetzen
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
      <a
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <PersonIcon className="w-6 h-6" />
      </a>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0">
          <Dialog.Panel className="w-full h-full bg-white">
            {/* Profile Header */}
            <div className="flex flex-col items-center py-8 px-4 border-b border-gray-100">
              <div className="w-20 h-20 mb-4">
                <img 
                  src="/path-to-your-avatar.png" 
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Abdullah</h2>
              <div className={`${isActivated ? 'bg-blue-500' : 'bg-gray-500'} text-white px-4 py-1.5 rounded-full text-sm`}>
                {isActivated ? 'Premium Member' : 'Free User'}
              </div>
            </div>

            {/* Menu Items */}
            <div className="px-4 py-2 space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 bg-gray-50/50 rounded-lg"
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
        </div>
      </Dialog>
    </>
  )
} 