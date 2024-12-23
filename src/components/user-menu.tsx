import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { PersonIcon } from '@radix-ui/react-icons'
import { LicenseService } from '../services/license-service'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [licenseKey, setLicenseKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isActivated, setIsActivated] = useState(false)

  async function activateLicense(key: string) {
    try {
      const result = await LicenseService.activateLicense(key)

      if (result.valid) {
        setIsActivated(true)
        setError(null)
        localStorage.setItem('license_key', key)
      } else {
        setError(result.error || 'Aktivierung fehlgeschlagen')
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    }
  }

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
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Lizenz aktivieren
            </Dialog.Title>

            {isActivated ? (
              <div className="text-green-600">
                Lizenz erfolgreich aktiviert!
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="Lizenzschlüssel eingeben"
                  className="w-full p-2 border rounded"
                />

                {error && (
                  <div className="text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={() => activateLicense(licenseKey)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Aktivieren
                </button>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
} 