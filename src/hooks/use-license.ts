import { useState, useEffect } from 'react'
import { LicenseService } from '../services/license-service'

interface LicenseState {
  isValid: boolean
  isLoading: boolean
  customerName: string
  customerEmail: string | null
  licenseKey: string | null
}

export function useLicense() {
  // Initialisiere den State mit gespeicherten Werten
  const [state, setState] = useState<LicenseState>(() => {
    const savedKey = localStorage.getItem('license_key')
    const savedName = localStorage.getItem('customer_name')
    const savedEmail = localStorage.getItem('customer_email')
    const savedValid = localStorage.getItem('is_valid') === 'true'
    
    return {
      isValid: savedValid,
      isLoading: !!savedKey,
      customerName: savedName || 'User',
      customerEmail: savedEmail,
      licenseKey: savedKey
    }
  })

  // Validiere die Lizenz beim Start und bei Änderungen
  useEffect(() => {
    const validateSavedLicense = async () => {
      const savedKey = localStorage.getItem('license_key')
      const savedEmail = localStorage.getItem('customer_email')
      if (!savedKey || !savedEmail) {
        setState(prev => ({ ...prev, isLoading: false }))
        return
      }

      try {
        console.log('Validiere gespeicherte Lizenz:', savedKey)
        const result = await LicenseService.validateLicense(savedKey)
        console.log('Validierungsergebnis:', result)

        // Überprüfe, ob die E-Mail-Adresse übereinstimmt
        if (result.valid && result.meta && result.meta.customer_email === savedEmail) {
          console.log('Lizenz ist gültig und E-Mail stimmt überein:', result)
          setState({
            isValid: true,
            isLoading: false,
            customerName: result.meta.customer_name || 'User',
            customerEmail: result.meta.customer_email,
            licenseKey: savedKey
          })
        } else {
          console.log('Lizenz ist ungültig oder E-Mail stimmt nicht überein:', result)
          localStorage.removeItem('license_key')
          localStorage.removeItem('is_valid')
          localStorage.removeItem('customer_name')
          localStorage.removeItem('customer_email')
          setState({
            isValid: false,
            isLoading: false,
            customerName: 'User',
            customerEmail: null,
            licenseKey: null
          })
        }
      } catch (err) {
        console.error('Fehler bei der Lizenzvalidierung:', err)
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    validateSavedLicense()
  }, [])

  const activateLicense = async (key: string, email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      console.log('Aktiviere Lizenz:', key, 'für E-Mail:', email)
      
      // Speichere die E-Mail für die Validierung
      localStorage.setItem('activation_email', email)
      
      const result = await LicenseService.activateLicense(key)
      console.log('Aktivierungsergebnis:', result)

      // Überprüfe, ob die E-Mail-Adresse übereinstimmt
      if (result.valid && result.meta && result.meta.customer_email === email) {
        console.log('Aktivierung erfolgreich und E-Mail stimmt überein:', result)
        
        // Speichere alle notwendigen Daten
        localStorage.setItem('license_key', key)
        localStorage.setItem('is_valid', 'true')
        localStorage.setItem('customer_name', result.meta.customer_name || 'User')
        localStorage.setItem('customer_email', email)
        
        // Wenn wir eine instance_id haben, speichere sie auch
        if (result.meta.instance_id) {
          localStorage.setItem('instance_id', result.meta.instance_id)
        }
        
        setState({
          isValid: true,
          isLoading: false,
          customerName: result.meta.customer_name || 'User',
          customerEmail: email,
          licenseKey: key
        })
        return { success: true }
      }

      console.log('Aktivierung fehlgeschlagen oder E-Mail stimmt nicht überein:', result)
      setState(prev => ({ ...prev, isLoading: false }))
      return { 
        success: false, 
        error: result.meta?.customer_email !== email 
          ? 'Die E-Mail-Adresse stimmt nicht mit der Lizenz überein' 
          : result.error || 'Aktivierung fehlgeschlagen'
      }
    } catch (err) {
      console.error('Aktivierungsfehler:', err)
      setState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Aktivierung fehlgeschlagen' }
    }
  }

  const deactivateLicense = async () => {
    console.log('Deaktiviere Lizenz')
    
    // Hole die gespeicherten Daten
    const licenseKey = localStorage.getItem('license_key')
    const instanceId = localStorage.getItem('instance_id')
    
    // Wenn wir eine instance_id haben, deaktivieren wir sie bei Lemon Squeezy
    if (licenseKey && instanceId) {
      await LicenseService.deactivateInstance(licenseKey, instanceId)
    }
    
    // Lösche alle lokalen Daten
    localStorage.removeItem('license_key')
    localStorage.removeItem('is_valid')
    localStorage.removeItem('customer_name')
    localStorage.removeItem('customer_email')
    localStorage.removeItem('activation_email')
    localStorage.removeItem('instance_id')
    
    setState({
      isValid: false,
      isLoading: false,
      customerName: 'User',
      customerEmail: null,
      licenseKey: null
    })
  }

  return {
    ...state,
    activateLicense,
    deactivateLicense
  }
} 