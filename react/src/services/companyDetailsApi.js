const API_BASE_URLS = ['/api', 'http://localhost:4000/api']
const COMPANY_DETAILS_CACHE_KEY = 'company_details_cache'

function readLocalCompanyDetails() {
  try {
    const raw = localStorage.getItem(COMPANY_DETAILS_CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalCompanyDetails(records) {
  try {
    localStorage.setItem(COMPANY_DETAILS_CACHE_KEY, JSON.stringify(records))
  } catch {
    // Ignore storage quota/private-mode write issues.
  }
}

async function requestWithFallback(path, options) {
  let lastError = null

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options)
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
      return response
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('API request failed')
}

export async function fetchCompanyDetailsFromDb() {
  try {
    const response = await requestWithFallback('/company-details')
    const data = await response.json()
    const normalized = Array.isArray(data) ? data : []
    writeLocalCompanyDetails(normalized)
    return normalized
  } catch {
    return readLocalCompanyDetails()
  }
}

export async function createCompanyDetailsInDb(payload) {
  try {
    const response = await requestWithFallback('/company-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const created = await response.json()
    const local = readLocalCompanyDetails()
    const next = [created, ...local.filter((item) => item.id !== created.id)]
    writeLocalCompanyDetails(next)
    return created
  } catch {
    const created = {
      ...payload,
      id: payload.id || `cc_${Date.now()}`,
    }
    const local = readLocalCompanyDetails()
    writeLocalCompanyDetails([created, ...local.filter((item) => item.id !== created.id)])
    return created
  }
}

export async function updateCompanyDetailsInDb(id, payload) {
  try {
    const response = await requestWithFallback(`/company-details/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const updated = await response.json()
    const local = readLocalCompanyDetails()
    writeLocalCompanyDetails(local.map((item) => (item.id === id ? updated : item)))
    return updated
  } catch {
    const local = readLocalCompanyDetails()
    const existing = local.find((item) => item.id === id) || { id }
    const updated = { ...existing, ...payload, id }
    writeLocalCompanyDetails(local.map((item) => (item.id === id ? updated : item)))
    return updated
  }
}

export async function deleteCompanyDetailsFromDb(id) {
  try {
    await requestWithFallback(`/company-details/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  } catch {
    // Ignore and still update local fallback cache.
  }

  const local = readLocalCompanyDetails()
  writeLocalCompanyDetails(local.filter((item) => item.id !== id))
}
