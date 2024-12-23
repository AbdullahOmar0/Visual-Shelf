const LEMON_SQUEEZY_API = 'https://api.lemonsqueezy.com/v1'

interface LicenseValidateResponse {
  valid: boolean
  error?: string
  meta?: {
    store_id: number
    product_id: number
    status: string
    activation_limit?: number
    activation_usage?: number
    instances?: Array<Instance>
  }
}

interface Instance {
  id: string
  name: string
  created_at: string
}

interface LemonSqueezyResponse {
  valid?: boolean
  activated?: boolean
  error: string | null
  license_key: {
    id: number
    status: string
    key: string
    activation_limit: number
    activation_usage: number
    created_at: string
    expires_at: string | null
  }
  instance?: {
    id: string
    name: string
    created_at: string
  }
  meta: {
    store_id: number
    order_id: number
    order_item_id: number
    product_id: number
    product_name: string
    variant_id: number
    variant_name: string
    customer_id: number
    customer_name: string
    customer_email: string
  }
}

export class LicenseService {
  static async validateLicense(licenseKey: string): Promise<LicenseValidateResponse> {
    try {
      console.log('Validiere Lizenzschlüssel:', licenseKey)
      
      const formData = new URLSearchParams()
      formData.append('license_key', licenseKey)

      const response = await fetch(`${LEMON_SQUEEZY_API}/licenses/validate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${import.meta.env.VITE_LEMON_SQUEEZY_API_KEY}`
        },
        body: formData
      })

      console.log('Validate Response Status:', response.status)
      const data: LemonSqueezyResponse = await response.json()
      console.log('Validate Response Data:', data)

      if (!response.ok || data.error) {
        console.error('API-Fehler:', data)
        return {
          valid: false,
          error: data.error || 'API-Fehler'
        }
      }

      if (!data.valid) {
        return {
          valid: false,
          error: 'Ungültiger Lizenzschlüssel'
        }
      }

      // Überprüfe, ob der Lizenzschlüssel zu unserem Store gehört
      if (data.meta.store_id !== Number(import.meta.env.VITE_LEMON_SQUEEZY_STORE_ID)) {
        console.error('Store ID stimmt nicht überein:', {
          expected: import.meta.env.VITE_LEMON_SQUEEZY_STORE_ID,
          received: data.meta.store_id
        })
        return {
          valid: false,
          error: 'Dieser Lizenzschlüssel gehört nicht zu unserem Store'
        }
      }

      // Überprüfe, ob der Lizenzschlüssel zu unserem Produkt gehört
      if (data.meta.product_id !== Number(import.meta.env.VITE_LEMON_SQUEEZY_PRODUCT_ID)) {
        console.error('Product ID stimmt nicht überein:', {
          expected: import.meta.env.VITE_LEMON_SQUEEZY_PRODUCT_ID,
          received: data.meta.product_id
        })
        return {
          valid: false,
          error: 'Dieser Lizenzschlüssel ist für ein anderes Produkt'
        }
      }

      // Überprüfe den Status der Lizenz
      switch (data.license_key.status) {
        case 'inactive':
          // Prüfe das Aktivierungslimit
          if (data.license_key.activation_limit && 
              data.license_key.activation_usage >= data.license_key.activation_limit) {
            console.error('Aktivierungslimit erreicht:', {
              limit: data.license_key.activation_limit,
              usage: data.license_key.activation_usage
            })
            return {
              valid: false,
              error: 'Das Aktivierungslimit wurde erreicht'
            }
          }
          break
        case 'active':
          return {
            valid: false,
            error: 'Diese Lizenz wurde bereits aktiviert'
          }
        case 'expired':
          return {
            valid: false,
            error: 'Diese Lizenz ist abgelaufen'
          }
        case 'disabled':
          return {
            valid: false,
            error: 'Diese Lizenz wurde deaktiviert'
          }
        default:
          return {
            valid: false,
            error: 'Ungültiger Lizenzstatus'
          }
      }

      return {
        valid: true,
        meta: {
          store_id: data.meta.store_id,
          product_id: data.meta.product_id,
          status: data.license_key.status,
          activation_limit: data.license_key.activation_limit,
          activation_usage: data.license_key.activation_usage
        }
      }
    } catch (err) {
      console.error('Validierungsfehler:', err)
      return {
        valid: false,
        error: 'Verbindungsfehler. Bitte versuche es später erneut.'
      }
    }
  }

  static async activateLicense(licenseKey: string): Promise<LicenseValidateResponse> {
    try {
      console.log('Starte Lizenzaktivierung für:', licenseKey)

      // Erst validieren
      const validationResult = await this.validateLicense(licenseKey)
      console.log('Validierungsergebnis:', validationResult)

      if (!validationResult.valid) {
        return validationResult
      }

      // Prüfe den Status der Lizenz
      const status = validationResult.meta?.status
      if (status === 'expired') {
        return {
          valid: false,
          error: 'Diese Lizenz ist abgelaufen'
        }
      }
      if (status === 'disabled') {
        return {
          valid: false,
          error: 'Diese Lizenz wurde deaktiviert'
        }
      }
      if (status === 'active') {
        return {
          valid: false,
          error: 'Diese Lizenz wurde bereits aktiviert'
        }
      }

      // Aktivierung versuchen
      const formData = new URLSearchParams()
      formData.append('license_key', licenseKey)
      formData.append('instance_name', 'Framer Plugin')

      console.log('Sende Aktivierungsanfrage...')
      const response = await fetch(`${LEMON_SQUEEZY_API}/licenses/activate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${import.meta.env.VITE_LEMON_SQUEEZY_API_KEY}`
        },
        body: formData
      })

      console.log('Activate Response Status:', response.status)
      const data: LemonSqueezyResponse = await response.json()
      console.log('Activate Response Data:', data)

      if (!response.ok || data.error) {
        console.error('Aktivierungs-API-Fehler:', data)
        return {
          valid: false,
          error: data.error || 'Aktivierung fehlgeschlagen'
        }
      }

      if (!data.activated) {
        return {
          valid: false,
          error: 'Aktivierung wurde vom Server abgelehnt'
        }
      }

      // Erfolgreiche Aktivierung
      return {
        valid: true,
        meta: {
          store_id: data.meta.store_id,
          product_id: data.meta.product_id,
          status: 'active',
          activation_limit: data.license_key.activation_limit,
          activation_usage: data.license_key.activation_usage,
          instances: data.instance ? [data.instance] : undefined
        }
      }
    } catch (err) {
      console.error('Aktivierungsfehler:', err)
      return {
        valid: false,
        error: 'Aktivierung fehlgeschlagen: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler')
      }
    }
  }
} 