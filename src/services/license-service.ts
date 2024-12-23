const LEMON_SQUEEZY_API = 'https://api.lemonsqueezy.com/v1'

interface LicenseValidateResponse {
  valid: boolean
  error?: string
  meta?: {
    store_id: number
    product_id: number
  }
}

export class LicenseService {
  static async validateLicense(licenseKey: string): Promise<LicenseValidateResponse> {
    try {
      const response = await fetch(`${LEMON_SQUEEZY_API}/licenses/validate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_LEMON_SQUEEZY_API_KEY}`
        },
        body: JSON.stringify({
          license_key: licenseKey
        })
      })

      const data = await response.json()

      // Überprüfe Store ID und Product ID
      if (data.meta?.store_id !== Number(import.meta.env.VITE_LEMON_SQUEEZY_STORE_ID) ||
          data.meta?.product_id !== Number(import.meta.env.VITE_LEMON_SQUEEZY_PRODUCT_ID)) {
        return {
          valid: false,
          error: 'Ungültiger Lizenzschlüssel für dieses Produkt'
        }
      }

      return {
        valid: data.valid,
        meta: data.meta
      }
    } catch (err) {
      return {
        valid: false,
        error: 'Validierung fehlgeschlagen'
      }
    }
  }

  static async activateLicense(licenseKey: string): Promise<LicenseValidateResponse> {
    // Erst validieren
    const validationResult = await this.validateLicense(licenseKey)
    if (!validationResult.valid) {
      return validationResult
    }

    // Wenn valid, dann aktivieren
    try {
      const response = await fetch(`${LEMON_SQUEEZY_API}/licenses/activate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_LEMON_SQUEEZY_API_KEY}`
        },
        body: JSON.stringify({
          license_key: licenseKey,
          instance_name: window.location.hostname
        })
      })

      const data = await response.json()
      return {
        valid: data.activated,
        error: data.error,
        meta: validationResult.meta
      }
    } catch (err) {
      return {
        valid: false,
        error: 'Aktivierung fehlgeschlagen'
      }
    }
  }
} 