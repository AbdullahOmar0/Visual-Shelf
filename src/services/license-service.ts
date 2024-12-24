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
    customer_name?: string
    customer_email?: string
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

      // Überprüfe Store und Produkt ID
      if (data.meta.store_id !== Number(import.meta.env.VITE_LEMON_SQUEEZY_STORE_ID)) {
        return {
          valid: false,
          error: 'Dieser Lizenzschlüssel gehört nicht zu unserem Store'
        }
      }

      if (data.meta.product_id !== Number(import.meta.env.VITE_LEMON_SQUEEZY_PRODUCT_ID)) {
        return {
          valid: false,
          error: 'Dieser Lizenzschlüssel ist für ein anderes Produkt'
        }
      }

      // Überprüfe den Status der Lizenz
      if (data.license_key.status === 'expired') {
        return {
          valid: false,
          error: 'Diese Lizenz ist abgelaufen'
        }
      }

      if (data.license_key.status === 'disabled') {
        return {
          valid: false,
          error: 'Diese Lizenz wurde deaktiviert'
        }
      }

      // Prüfe das Aktivierungslimit
      if (data.license_key.activation_limit && 
          data.license_key.activation_usage > data.license_key.activation_limit) {
        return {
          valid: false,
          error: 'Das Aktivierungslimit wurde erreicht'
        }
      }

      // Prüfe, ob es sich um eine gespeicherte Lizenz handelt
      const savedKey = localStorage.getItem('license_key')
      const isStoredLicense = savedKey === licenseKey

      // Wenn es die gespeicherte Lizenz ist, akzeptiere sie auch wenn sie aktiv ist
      if (isStoredLicense) {
        return {
          valid: true,
          meta: {
            store_id: data.meta.store_id,
            product_id: data.meta.product_id,
            status: data.license_key.status,
            activation_limit: data.license_key.activation_limit,
            activation_usage: data.license_key.activation_usage,
            customer_name: data.meta.customer_name,
            customer_email: data.meta.customer_email
          }
        }
      }

      // Für neue Aktivierungen: Prüfe, ob die Lizenz bereits aktiviert wurde
      if (data.license_key.status === 'active' && data.license_key.activation_usage > 0) {
        return {
          valid: false,
          error: 'Diese Lizenz wurde bereits aktiviert'
        }
      }

      // Wenn die Lizenz gültig ist, geben wir sie zurück
      return {
        valid: true,
        meta: {
          store_id: data.meta.store_id,
          product_id: data.meta.product_id,
          status: data.license_key.status,
          activation_limit: data.license_key.activation_limit,
          activation_usage: data.license_key.activation_usage,
          customer_name: data.meta.customer_name,
          customer_email: data.meta.customer_email
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
      // Erst validieren
      const validationResult = await this.validateLicense(licenseKey)
      if (!validationResult.valid) {
        return validationResult
      }

      // Wenn die Lizenz bereits aktiv ist, speichern und zurückgeben
      if (validationResult.meta?.status === 'active') {
        localStorage.setItem('license_key', licenseKey)
        localStorage.setItem('customer_name', validationResult.meta.customer_name || '')
        localStorage.setItem('customer_email', validationResult.meta.customer_email || '')
        return validationResult
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

      // Speichere die erfolgreiche Aktivierung
      localStorage.setItem('license_key', licenseKey)
      localStorage.setItem('customer_name', data.meta.customer_name)
      localStorage.setItem('customer_email', data.meta.customer_email)

      return {
        valid: true,
        meta: {
          store_id: data.meta.store_id,
          product_id: data.meta.product_id,
          status: 'active',
          activation_limit: data.license_key.activation_limit,
          activation_usage: data.license_key.activation_usage,
          customer_name: data.meta.customer_name,
          customer_email: data.meta.customer_email
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