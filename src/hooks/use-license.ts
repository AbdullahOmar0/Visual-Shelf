import { useState, useEffect } from 'react'
import { LicenseService } from '../services/license-service'

export function useLicense() {
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateLicense = async () => {
      const licenseKey = localStorage.getItem('license_key')
      
      if (licenseKey) {
        const result = await LicenseService.validateLicense(licenseKey)
        setIsValid(result.valid)
      }
      
      setIsLoading(false)
    }

    validateLicense()
  }, [])

  return { isValid, isLoading }
} 