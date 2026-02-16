import { useEffect, useRef, useState } from 'react'
import Custcomp from './Custcomp.jsx'
import ViewCustcomp from './ViewCustcomp.jsx'

const HOME_ACTIVE_TAB_KEY = 'home_active_tab'
const HOME_THEME_KEY = 'home_theme'
const HOME_NAV_OPEN_KEY = 'home_nav_open'
const HOME_CUSTOMERS_CACHE_KEY = 'home_customers_cache'
const API_BASE_URLS = ['/api', 'http://localhost:4000/api']

const dashboardChildren = ['Customer Entry', 'Customer Details']
const defaultNavigation = [
  { label: 'Home' },
  { label: 'Dashboard', children: dashboardChildren },
  { label: 'Customer Company Details', children: ['View Customer Company Details'] },
  { label: 'Projects' },
  { label: 'Messages' },
  { label: 'Settings' },
]

const dashboardChildIcons = {
  'Customer Entry': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 4.5h12a1.8 1.8 0 0 1 1.8 1.8v11.4a1.8 1.8 0 0 1-1.8 1.8H6a1.8 1.8 0 0 1-1.8-1.8V6.3A1.8 1.8 0 0 1 6 4.5Z" />
      <path d="M8 9h8M8 13h5M12 2.8v3.3" />
    </svg>
  ),
  'Customer Details': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.1" />
      <path d="M5.5 19c1.6-3.3 4.4-5 6.5-5s4.9 1.7 6.5 5" />
      <path d="M3.8 4.8h3.2M17 4.8h3.2" />
    </svg>
  ),
}

const locationOptions = {
  'United States': {
    California: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco'],
    Texas: ['Houston', 'Dallas', 'Austin', 'San Antonio'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
  },
  India: {
    TamilNadu: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
    Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli'],
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  },
  Canada: {
    Ontario: ['Toronto', 'Ottawa', 'Hamilton', 'London'],
    Quebec: ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
    Alberta: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'],
  },
}

const defaultCustomers = [
  {
    id: 'c1',
    fullName: 'Ava Johnson',
    email: 'ava.johnson@gmail.com',
    phone: '+1 917 555 1287',
    company: 'Northline Foods',
    customerType: 'Business',
    gender: 'Female',
    dob: '1992-06-15',
    country: 'United States',
    state: 'New York',
    city: 'New York',
    zipCode: '10001',
    address: '45 Park Avenue',
    plan: 'Premium',
    status: 'Active',
    notes: 'Interested in monthly reporting.',
    newsletter: true,
    amount: '2450',
    paymentMethod: 'UPI',
    receiverName: '',
    cardLast6: '',
    cardExpiry: '',
    cardName: '',
    referenceNo: 'UPI-889201',
    trnNo: 'TRN-219004',
  },
  {
    id: 'c2',
    fullName: 'Liam Carter',
    email: 'liam.carter@gmail.com',
    phone: '+1 408 555 0834',
    company: 'Carter Logistics',
    customerType: 'Business',
    gender: 'Male',
    dob: '1988-11-03',
    country: 'United States',
    state: 'California',
    city: 'San Jose',
    zipCode: '95112',
    address: '202 Market Street',
    plan: 'Standard',
    status: 'Lead',
    notes: 'Requested onboarding call next week.',
    newsletter: false,
    amount: '1300',
    paymentMethod: 'Credit Card',
    receiverName: '',
    cardLast6: '002481',
    cardExpiry: '11/28',
    cardName: 'LIAM CARTER',
    referenceNo: '',
    trnNo: '',
  },
]

const emptyEntryForm = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  customerType: 'Individual',
  gender: 'Prefer not to say',
  dob: '',
  country: 'United States',
  state: '',
  city: '',
  zipCode: '',
  address: '',
  plan: 'Starter',
  status: 'Lead',
  notes: '',
  newsletter: false,
  customerPhotoName: '',
  customerPhotoData: '',
  customerDocName: '',
  customerDocData: '',
}

const paymentMethods = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Net Banking', 'Wallet']
const emptyTopUpForm = () => ({
  amount: '',
  paymentMethod: 'Cash',
  receiverName: '',
  cardLast6: '',
  cardExpiry: '',
  cardName: '',
  referenceNo: '',
  trnNo: '',
})

const topUpFieldMap = {
  topUpAmount: 'amount',
  topUpReceiver: 'receiverName',
  topUpCardLast6: 'cardLast6',
  topUpCardExpiry: 'cardExpiry',
  topUpCardHolder: 'cardName',
  topUpReference: 'referenceNo',
  topUpTrn: 'trnNo',
}
const paymentMethodOptionIcons = {
  Cash: '💵',
  UPI: '📱',
  'Credit Card': '💳',
  'Debit Card': '💳',
  'Bank Transfer': '🏦',
  'Net Banking': '🌐',
  Wallet: '👛',
}

const paymentMethodIcons = {
  Cash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M7 10.5h.01M17 13.5h.01" />
    </svg>
  ),
  UPI: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4v9" />
      <path d="m8.5 9.5 3.5-5.5 3.5 5.5" />
      <path d="M6 18h12" />
    </svg>
  ),
  'Credit Card': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M3.5 10.2h17M7.5 14.5h3.5" />
    </svg>
  ),
  'Debit Card': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M3.5 10.2h17M7.5 14.5h3.5" />
    </svg>
  ),
  'Bank Transfer': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3.5 9.5 12 4l8.5 5.5H3.5Z" />
      <path d="M6 10v7M10 10v7M14 10v7M18 10v7M4 17.5h16" />
    </svg>
  ),
  'Net Banking': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4.5" width="16" height="15" rx="2" />
      <path d="M8 8h8M8 12h5M8 16h3" />
    </svg>
  ),
  Wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="M14 12h6M17.2 12h.01" />
    </svg>
  ),
}

function readSavedValue(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ?? fallback
  } catch {
    return fallback
  }
}

function readSavedJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : fallback
  } catch {
    return fallback
  }
}

function readCustomerIdFromUrl() {
  try {
    const url = new URL(window.location.href)
    return url.searchParams.get('customerId')
  } catch {
    return null
  }
}

function buildInitialOpenGroups(navItems, activeItem) {
  return navItems.reduce((acc, item) => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      acc[item.label] = activeItem === item.label || item.children.includes(activeItem)
    }
    return acc
  }, {})
}

function getCountries() {
  return Object.keys(locationOptions)
}

function getStates(country) {
  if (!country || !locationOptions[country]) return []
  return Object.keys(locationOptions[country])
}

function getCities(country, state) {
  if (!country || !state || !locationOptions[country] || !locationOptions[country][state]) return []
  return locationOptions[country][state]
}

function isCardPayment(method) {
  return method === 'Credit Card' || method === 'Debit Card'
}

function isCashPayment(method) {
  return method === 'Cash'
}

function isValidIndiaPhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 12
}

function PaymentMethodDisplay({ method }) {
  if (!method) return '-'
  return (
    <span className="payment-method-inline">
      <span className="payment-method-icon" aria-hidden>
        {paymentMethodIcons[method] || paymentMethodIcons.Cash}
      </span>
      <span>{method}</span>
    </span>
  )
}

function getPaymentDetailPatch(data) {
  const base = {
    paymentMethod: data.paymentMethod,
    receiverName: '',
    cardLast6: '',
    cardExpiry: '',
    cardName: '',
    referenceNo: '',
    trnNo: '',
  }

  if (isCashPayment(data.paymentMethod)) {
    return {
      ...base,
      receiverName: data.receiverName?.trim() || '',
    }
  }

  if (isCardPayment(data.paymentMethod)) {
    return {
      ...base,
      cardLast6: data.cardLast6?.trim() || '',
      cardExpiry: data.cardExpiry?.trim() || '',
      cardName: data.cardName?.trim() || '',
    }
  }

  return {
    ...base,
    referenceNo: data.referenceNo?.trim() || '',
    trnNo: data.trnNo?.trim() || '',
  }
}

const navIcons = {
  Home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3.5 10.2 12 3l8.5 7.2" />
      <path d="M6.5 9.8V20h11V9.8" />
    </svg>
  ),
  Dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.2" />
      <rect x="13" y="3.5" width="7.5" height="5.2" rx="1.2" />
      <rect x="13" y="10.8" width="7.5" height="9.7" rx="1.2" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.2" />
    </svg>
  ),
  'Customer Company Details': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4.5 20h15" />
      <path d="M6.5 20V7.8h11V20" />
      <path d="M9 11h2M13 11h2M9 14.2h2M13 14.2h2" />
      <path d="M9.5 4h5l1 3.8h-7L9.5 4Z" />
    </svg>
  ),
  'Company Customer Details': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4.5 20h15" />
      <path d="M6.5 20V7.8h11V20" />
      <path d="M9 11h2M13 11h2M9 14.2h2M13 14.2h2" />
      <path d="M9.5 4h5l1 3.8h-7L9.5 4Z" />
    </svg>
  ),
  'View Customer Company Details': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2.8 12s3.4-5.8 9.2-5.8 9.2 5.8 9.2 5.8-3.4 5.8-9.2 5.8-9.2-5.8-9.2-5.8Z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  ),
  Projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7.5h16" />
      <path d="M9 4.5h6l1 3H8l1-3Z" />
      <rect x="4" y="7.5" width="16" height="12" rx="2" />
    </svg>
  ),
  Messages: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5" width="17" height="12" rx="2" />
      <path d="m4.5 6 7.5 6L19.5 6" />
    </svg>
  ),
  Settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4.8a7.6 7.6 0 0 0-2-.9L14 3h-4l-.5 2.7a7.6 7.6 0 0 0-2 .9l-2.4-.8-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-.8c.6.4 1.3.7 2 .9L10 21h4l.5-2.7c.7-.2 1.4-.5 2-.9l2.4.8 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" />
    </svg>
  ),
}

function initials(name) {
  if (!name) return 'JD'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
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

async function fetchCustomersFromDb() {
  try {
    const response = await requestWithFallback('/customers')
    const data = await response.json()
    const normalized = Array.isArray(data) ? data : []
    localStorage.setItem(HOME_CUSTOMERS_CACHE_KEY, JSON.stringify(normalized))
    return normalized
  } catch {
    const cached = readSavedJson(HOME_CUSTOMERS_CACHE_KEY, [])
    if (Array.isArray(cached) && cached.length > 0) return cached
    throw new Error('Customer API unavailable and cache is empty.')
  }
}

async function createCustomerInDb(customer) {
  try {
    const response = await requestWithFallback('/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    })
    const created = await response.json()
    const cached = readSavedJson(HOME_CUSTOMERS_CACHE_KEY, [])
    const next = [created, ...cached.filter((item) => item.id !== created.id)]
    localStorage.setItem(HOME_CUSTOMERS_CACHE_KEY, JSON.stringify(next))
    return created
  } catch {
    const created = {
      ...customer,
      id: customer.id || `c_${Date.now()}`,
    }
    const cached = readSavedJson(HOME_CUSTOMERS_CACHE_KEY, [])
    const next = [created, ...cached.filter((item) => item.id !== created.id)]
    localStorage.setItem(HOME_CUSTOMERS_CACHE_KEY, JSON.stringify(next))
    return created
  }
}

async function updateCustomerInDb(id, customer) {
  try {
    const response = await requestWithFallback(`/customers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    })
    const updated = await response.json()
    const cached = readSavedJson(HOME_CUSTOMERS_CACHE_KEY, [])
    const next = cached.map((item) => (item.id === id ? updated : item))
    localStorage.setItem(HOME_CUSTOMERS_CACHE_KEY, JSON.stringify(next))
    return updated
  } catch {
    const cached = readSavedJson(HOME_CUSTOMERS_CACHE_KEY, [])
    const existing = cached.find((item) => item.id === id) || { id }
    const updated = { ...existing, ...customer, id }
    const next = cached.some((item) => item.id === id)
      ? cached.map((item) => (item.id === id ? updated : item))
      : [updated, ...cached]
    localStorage.setItem(HOME_CUSTOMERS_CACHE_KEY, JSON.stringify(next))
    return updated
  }
}

async function deleteCustomerFromDb(id) {
  try {
    await requestWithFallback(`/customers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  } catch {
    // Ignore API delete failure; update local cache below.
  }

  const cached = readSavedJson(HOME_CUSTOMERS_CACHE_KEY, [])
  const next = cached.filter((item) => item.id !== id)
  localStorage.setItem(HOME_CUSTOMERS_CACHE_KEY, JSON.stringify(next))
}

async function fetchNavigationFromDb() {
  const response = await requestWithFallback('/navigation')
  const data = await response.json()
  return Array.isArray(data) ? data : defaultNavigation
}

function Home({ user, onSignOut }) {
  const [activeItem, setActiveItem] = useState(() => readSavedValue(HOME_ACTIVE_TAB_KEY, 'Home'))
  const [theme, setTheme] = useState(() => readSavedValue(HOME_THEME_KEY, 'dark'))
  const [navigation, setNavigation] = useState(defaultNavigation)
  const [openGroups, setOpenGroups] = useState(() => {
    const active = readSavedValue(HOME_ACTIVE_TAB_KEY, 'Home')
    const saved = readSavedJson(HOME_NAV_OPEN_KEY, null)
    if (saved && typeof saved === 'object') return saved
    return buildInitialOpenGroups(defaultNavigation, active)
  })
  const [customers, setCustomers] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState(() => readCustomerIdFromUrl() || null)
  const [isCustomersLoading, setIsCustomersLoading] = useState(true)
  const [customersError, setCustomersError] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')
  const [entryForm, setEntryForm] = useState(emptyEntryForm)
  const [editingCustomerId, setEditingCustomerId] = useState(null)
  const [editReturnContext, setEditReturnContext] = useState(null)
  const [entrySuccess, setEntrySuccess] = useState('')
  const [topUpForm, setTopUpForm] = useState(() => emptyTopUpForm())
  const [topUpMessage, setTopUpMessage] = useState('')
  const [topUpFieldNonce, setTopUpFieldNonce] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [isCompanyDetailOpen, setIsCompanyDetailOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const initialActiveItemRef = useRef(activeItem)
  const routeLabels = new Set(['Home', 'Customer Entry', 'Customer Details', 'Customer Company Details', 'View Customer Company Details'])

  const displayName = user?.name || 'admin'
  const displayEmail = user?.email || 'admin@gmail.com'
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) || null
  const countryList = getCountries()
  const stateList = getStates(entryForm.country)
  const cityList = getCities(entryForm.country, entryForm.state)
  const normalizedSearch = customerSearch.trim().toLowerCase()
  const navItems = navigation.map((item) => ({
    ...item,
    icon: navIcons[item.label] || navIcons.Home,
  }))
  const filteredCustomers = customers.filter((customer) => {
    if (!normalizedSearch) return true
    return Object.values(customer).join(' ').toLowerCase().includes(normalizedSearch)
  })

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(HOME_NAV_OPEN_KEY, JSON.stringify(openGroups))
  }, [openGroups])

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsCustomersLoading(true)
        setCustomersError('')
        const dbCustomers = await fetchCustomersFromDb()
        setCustomers(Array.isArray(dbCustomers) ? dbCustomers : [])
      } catch {
        setCustomers(defaultCustomers)
        setCustomersError('Using local backup data. Start API server to save to JSON DB.')
      } finally {
        setIsCustomersLoading(false)
      }
    }

    loadCustomers()
  }, [])

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        const data = await fetchNavigationFromDb()
        setNavigation(data)
        setOpenGroups((prev) => ({ ...buildInitialOpenGroups(data, initialActiveItemRef.current), ...prev }))
      } catch {
        setNavigation(defaultNavigation)
        setOpenGroups((prev) => ({ ...buildInitialOpenGroups(defaultNavigation, initialActiveItemRef.current), ...prev }))
      }
    }

    loadNavigation()
  }, [])

  useEffect(() => {
    setOpenGroups((prev) => {
      const opener = buildInitialOpenGroups(navigation, activeItem)
      const next = { ...prev }
      Object.keys(opener).forEach((groupLabel) => {
        if (opener[groupLabel]) next[groupLabel] = true
      })
      return next
    })
  }, [activeItem, navigation])

  useEffect(() => {
    if (isCustomersLoading) return
    if (selectedCustomerId && !customers.some((customer) => customer.id === selectedCustomerId)) {
      setSelectedCustomerId(null)
    }
  }, [customers, selectedCustomerId, isCustomersLoading])

  useEffect(() => {
    if (activeItem === 'Customer Entry') {
      if (!editingCustomerId) {
        setEntryForm(emptyEntryForm)
      }
    }
  }, [activeItem, editingCustomerId])

  useEffect(() => {
    if (!selectedCustomer) {
      setTopUpForm(emptyTopUpForm())
      setTopUpFieldNonce((prev) => prev + 1)
      setTopUpMessage('')
      return
    }

    // Keep top-up fields fresh; do not prefill with previous customer/payment data.
    setTopUpForm(emptyTopUpForm())
    setTopUpFieldNonce((prev) => prev + 1)
    setTopUpMessage('')
  }, [selectedCustomer])

  const saveActiveItem = (label) => {
    localStorage.setItem(HOME_ACTIVE_TAB_KEY, label)
    setActiveItem(label)
  }

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const openGroup = (label) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: true,
    }))
  }

  const handleEntryChange = (event) => {
    const { name, type, value, checked } = event.target
    setEntryForm((prev) => {
      const nextValue = type === 'checkbox' ? checked : value

      if (name === 'country') {
        return {
          ...prev,
          country: nextValue,
          state: '',
          city: '',
        }
      }

      if (name === 'state') {
        return {
          ...prev,
          state: nextValue,
          city: '',
        }
      }

      return {
        ...prev,
        [name]: nextValue,
      }
    })
    if (entrySuccess) setEntrySuccess('')
  }

  const pickFile = (accept, onPick) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) onPick(file)
      input.remove()
    }
    document.body.append(input)
    input.click()
  }

  const handleEntryFileSelected = (file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setEntryForm((prev) => ({
        ...prev,
        customerDocName: file.name,
        customerDocData: typeof reader.result === 'string' ? reader.result : '',
      }))
      setEntrySuccess('')
    }
    reader.readAsDataURL(file)
  }

  const handleCustomerPhotoSelected = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setEntryForm((prev) => ({
        ...prev,
        customerPhotoName: file.name,
        customerPhotoData: typeof reader.result === 'string' ? reader.result : '',
      }))
      setEntrySuccess('')
    }
    reader.readAsDataURL(file)
  }

  const openUploadedFile = (fileData) => {
    if (!fileData) return
    const anchor = document.createElement('a')
    anchor.href = fileData
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
  }

  const handleTopUpChange = (event) => {
    const { name, value } = event.target
    const normalizedName = name.split('__')[0]
    const fieldName = topUpFieldMap[normalizedName] || normalizedName
    setTopUpForm((prev) => {
      if (fieldName === 'paymentMethod') {
        if (isCashPayment(value)) {
          return {
            ...prev,
            paymentMethod: value,
            cardLast6: '',
            cardExpiry: '',
            cardName: '',
            referenceNo: '',
            trnNo: '',
          }
        }

        if (isCardPayment(value)) {
          return {
            ...prev,
            paymentMethod: value,
            receiverName: '',
            referenceNo: '',
            trnNo: '',
          }
        }

        return {
          ...prev,
          paymentMethod: value,
          receiverName: '',
          cardLast6: '',
          cardExpiry: '',
          cardName: '',
        }
      }

      return {
        ...prev,
        [fieldName]: value,
      }
    })
    if (topUpMessage) setTopUpMessage('')
  }

  const handleEntrySubmit = async (event) => {
    event.preventDefault()

    if (!entryForm.fullName.trim() || !entryForm.email.trim() || !entryForm.phone.trim()) {
      setEntrySuccess('Please fill name, email, and phone.')
      return
    }

    if (!isValidIndiaPhone(entryForm.phone)) {
      setEntrySuccess('Phone number must include 9 to 12 digits.')
      return
    }

    const profilePayload = {
      ...entryForm,
      fullName: entryForm.fullName.trim(),
      email: entryForm.email.trim().toLowerCase(),
    }

    try {
      if (editingCustomerId) {
        const current = customers.find((customer) => customer.id === editingCustomerId)
        const updatedCustomer = await updateCustomerInDb(editingCustomerId, {
          ...(current || {}),
          ...profilePayload,
        })
        setCustomers((prev) => prev.map((customer) => (customer.id === updatedCustomer.id ? updatedCustomer : customer)))
        setSelectedCustomerId(null)
        setEntrySuccess('Customer updated successfully.')
      } else {
        const createdCustomer = await createCustomerInDb({
          id: `c_${Date.now()}`,
          ...profilePayload,
          amount: '0.00',
          paymentMethod: 'Cash',
          receiverName: '',
          cardLast6: '',
          cardExpiry: '',
          cardName: '',
          referenceNo: '',
          trnNo: '',
        })
        setCustomers((prev) => [createdCustomer, ...prev])
        setSelectedCustomerId(null)
        setEntrySuccess('Customer saved successfully.')
      }

      setEntryForm(emptyEntryForm)
      setEditingCustomerId(null)
      openGroup('Dashboard')
      setCustomersError('')
    } catch {
      setEntrySuccess('Could not save to JSON DB. Please check API server.')
    }
  }

  const handleEditCustomer = (customer) => {
    setEditReturnContext({
      activeItem,
      selectedCustomerId,
      customerSearch,
    })
    setEntryForm({
      ...emptyEntryForm,
      ...customer,
    })
    setEditingCustomerId(customer.id)
    setEntrySuccess('')
    saveActiveItem('Customer Entry')
    openGroup('Dashboard')
  }

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteCustomerFromDb(customerId)
      setCustomers((prev) => prev.filter((customer) => customer.id !== customerId))
      if (selectedCustomerId === customerId) {
        setSelectedCustomerId(null)
      }
      if (editingCustomerId === customerId) {
        setEditingCustomerId(null)
        setEntryForm(emptyEntryForm)
      }
    } catch {
      setCustomersError('Delete failed. Please check API server.')
    }
  }

  const handleTopUpSubmit = async (event) => {
    event.preventDefault()
    if (!selectedCustomer) return

    const addAmount = Number(topUpForm.amount)
    if (!Number.isFinite(addAmount) || addAmount <= 0) {
      setTopUpMessage('Enter a valid amount to add.')
      return
    }

    const currentAmount = Number(selectedCustomer.amount || 0)
    const nextAmount = (currentAmount + addAmount).toFixed(2)
    const paymentPatch = getPaymentDetailPatch(topUpForm)
    const optimisticCustomer = {
      ...selectedCustomer,
      amount: nextAmount,
      ...paymentPatch,
    }

    setCustomers((prev) => prev.map((customer) => (customer.id === optimisticCustomer.id ? optimisticCustomer : customer)))
    setTopUpForm(emptyTopUpForm())
    setTopUpMessage('Money added successfully.')

    try {
      const updated = await updateCustomerInDb(selectedCustomer.id, {
        ...optimisticCustomer,
      })
      setCustomers((prev) => prev.map((customer) => (customer.id === updated.id ? updated : customer)))
      setCustomersError('')
    } catch {
      setCustomers((prev) => prev.map((customer) => (customer.id === selectedCustomer.id ? selectedCustomer : customer)))
      setTopUpMessage('Top up failed. Please check API server.')
    }
  }

  const renderDashboardPanel = () => {
    if (activeItem === 'Customer Entry') {
      return (
        <div className="dashboard-card">
          <div className="tab-head-row">
            <h2>Customer Entry</h2>
            <div className="tab-right-actions">
              <button type="button" className="top-btn photo-update-btn" onClick={() => pickFile('.png,.jpg,.jpeg,.webp', handleCustomerPhotoSelected)}>
                <span className="photo-update-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3.5" y="6.5" width="17" height="12" rx="2" />
                    <circle cx="12" cy="12.5" r="3" />
                    <path d="M8 6.5 9 4.8h6L16 6.5" />
                  </svg>
                </span>
                {entryForm.customerPhotoName ? 'Photo Selected' : 'Upload Photo'}
              </button>
              {entryForm.customerPhotoName ? (
                <button
                  type="button"
                  className="top-btn"
                  onClick={() => {
                    setEntryForm((prev) => ({ ...prev, customerPhotoName: '', customerPhotoData: '' }))
                  }}
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
          <p className="dash-subtitle">Enter all customer information below.</p>

          <form className="customer-form" onSubmit={handleEntrySubmit} autoComplete="off">
            <div className="form-grid-2">
              <label>
                Full Name
                <input name="fullName" type="text" value={entryForm.fullName} onChange={handleEntryChange} placeholder="Your name" />
              </label>
              <label>
                Email
                <input name="email" type="email" value={entryForm.email} onChange={handleEntryChange} placeholder="example@gmail.com" />
              </label>
              <label>
                Phone
                <input name="phone" type="tel" value={entryForm.phone} onChange={handleEntryChange} placeholder="Entre Phone Number" />
              </label>
              <label>
                Company
                <input name="company" type="text" value={entryForm.company} onChange={handleEntryChange} placeholder="Company name" />
              </label>
              <label>
                Customer Type
                <select name="customerType" value={entryForm.customerType} onChange={handleEntryChange}>
                  <option>Individual</option>
                  <option>Business</option>
                  <option>Enterprise</option>
                </select>
              </label>
              <label>
                Gender
                <select name="gender" value={entryForm.gender} onChange={handleEntryChange}>
                  <option>Prefer not to say</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Date of Birth
                <input name="dob" type="date" value={entryForm.dob} onChange={handleEntryChange} />
              </label>
              <label>
                Country
                <select name="country" value={entryForm.country} onChange={handleEntryChange}>
                  {countryList.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                State
                <select name="state" value={entryForm.state} onChange={handleEntryChange}>
                  <option value="">Select state</option> 
                  {stateList.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                City
                <select name="city" value={entryForm.city} onChange={handleEntryChange}>
                  <option value="">Select city</option>
                  {cityList.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Zip Code
                <input name="zipCode" type="text" value={entryForm.zipCode} onChange={handleEntryChange} />
              </label>
              <label>
                Address
                <input name="address" type="text" value={entryForm.address} onChange={handleEntryChange} placeholder="Street, Area" />
              </label>
              <label>
                Plan
                <select name="plan" value={entryForm.plan} onChange={handleEntryChange}>
                  <option>Starter</option>
                  <option>Standard</option>
                  <option>Premium</option>
                </select>
              </label>
              <label>
                Status
                <select name="status" value={entryForm.status} onChange={handleEntryChange}>
                  <option>Lead</option>
                  <option>Active</option>
                  <option>Paused</option>
                </select>
              </label>
            </div>

            <label className="full-row">
              Notes
              <textarea name="notes" rows="3" value={entryForm.notes} onChange={handleEntryChange} placeholder="Extra details about customer" />
            </label>

            <div className="full-row upload-row">
              <span>Customer Document</span>
              <div className="upload-control">
                <button type="button" className="upload-btn" onClick={() => pickFile('.pdf,.png,.jpg,.jpeg,.doc,.docx', handleEntryFileSelected)}>
                  <span className="upload-btn-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 16V5" />
                      <path d="m8.5 8.5 3.5-3.5 3.5 3.5" />
                      <path d="M4.5 15.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
                    </svg>
                  </span>
                  Upload File
                </button>
                <span className="upload-file-name">{entryForm.customerDocName || 'No file selected'}</span>
                {entryForm.customerDocData ? (
                  <button type="button" className="upload-view-btn" onClick={() => openUploadedFile(entryForm.customerDocData)}>
                    View
                  </button>
                ) : null}
                {entryForm.customerDocName ? (
                  <button
                    type="button"
                    className="upload-clear-btn"
                    onClick={() => {
                      setEntryForm((prev) => ({ ...prev, customerDocName: '', customerDocData: '' }))
                    }}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            {/* <label className="check-row">
              <input name="newsletter" type="checkbox" checked={entryForm.newsletter} onChange={handleEntryChange} />
              Subscribe to updates
            </label> */}

            <div className="form-actions">
              <button type="submit" className="submit-customer-btn">
                {editingCustomerId ? 'Update Customer' : 'Save Customer'}
              </button>
              {editingCustomerId ? (
                <button
                  type="button"
                  className="reset-customer-btn"
                  onClick={() => {
                    const returnContext = editReturnContext
                    setEditingCustomerId(null)
                    setEntryForm(emptyEntryForm)
                    setEntrySuccess('')
                    if (returnContext?.activeItem === 'Customer Details') {
                      saveActiveItem('Customer Details')
                    } else if (returnContext?.activeItem) {
                      saveActiveItem(returnContext.activeItem)
                    } else if (editingCustomerId) {
                      saveActiveItem('Customer Details')
                    } else {
                      saveActiveItem('Customer Details')
                    }
                    setEditReturnContext(null)
                  }}
                >
                  Cancel Edit
                </button>
              ) : null}
              {entrySuccess ? <span className="entry-success">{entrySuccess}</span> : null}
            </div>
          </form>
        </div>
      )
    }

    if (activeItem === 'Customer Details') {
      return (
        <div className="dashboard-card">
          <div className="tab-head-row">
            <h2>Customer Details</h2>
            {selectedCustomer ? (
              <div className="customer-passport-wrap" aria-label="Customer photo">
                {selectedCustomer.customerPhotoData ? (
                  <img src={selectedCustomer.customerPhotoData} alt={`${selectedCustomer.fullName || 'Customer'} passport`} className="customer-passport-photo" />
                ) : (
                  <span className="customer-passport-fallback">{initials(selectedCustomer.fullName)}</span>
                )}
              </div>
            ) : null}
          </div>
          {selectedCustomer ? (
            <div className="single-customer-view">
              <div className="single-customer-head">
                <h3>{selectedCustomer.fullName}</h3>
                <span className="amount-chip">Amount: ₹ {selectedCustomer.amount || '0.00'}</span>
              </div>

              <div className="single-customer-grid">
                <p><span>Email:</span> {selectedCustomer.email || '-'}</p>
                <p><span>Phone:</span> {selectedCustomer.phone || '-'}</p>
                <p><span>Company:</span> {selectedCustomer.company || '-'}</p>
                <p><span>Customer Type:</span> {selectedCustomer.customerType || '-'}</p>
                <p><span>Plan:</span> {selectedCustomer.plan || '-'}</p>
                <p><span>Status:</span> {selectedCustomer.status || '-'}</p>
                <p><span>Country:</span> {selectedCustomer.country || '-'}</p>
                <p><span>State:</span> {selectedCustomer.state || '-'}</p>
                <p><span>City:</span> {selectedCustomer.city || '-'}</p>
                <p><span>Zip Code:</span> {selectedCustomer.zipCode || '-'}</p>
                <p><span>Address:</span> {selectedCustomer.address || '-'}</p>
                <p><span>Date of Birth:</span> {selectedCustomer.dob || '-'}</p>
                <p>
                  <span>Uploaded Document:</span>{' '}
                  {selectedCustomer.customerDocName || '-'}
                  {selectedCustomer.customerDocData ? (
                    <button
                      type="button"
                      className="upload-view-btn inline-view-btn"
                      onClick={() => openUploadedFile(selectedCustomer.customerDocData)}
                    >
                      View
                    </button>
                  ) : null}
                </p>
                <p><span>Amount:</span> ₹ {selectedCustomer.amount || '0.00'}</p>
                <p><span>Payment Method:</span> <PaymentMethodDisplay method={selectedCustomer.paymentMethod} /></p>
                {isCashPayment(selectedCustomer.paymentMethod) ? (
                  <p><span>Receiver Name:</span> {selectedCustomer.receiverName || '-'}</p>
                ) : null}
                {isCardPayment(selectedCustomer.paymentMethod) ? (
                  <>
                    <p><span>Card Last 6:</span> {selectedCustomer.cardLast6 || '-'}</p>
                    <p><span>Card Expiry:</span> {selectedCustomer.cardExpiry || '-'}</p>
                    <p><span>Name Of Card Holder:</span> {selectedCustomer.cardName || '-'}</p>
                  </>
                ) : null}
                {!isCashPayment(selectedCustomer.paymentMethod) && !isCardPayment(selectedCustomer.paymentMethod) ? (
                  <>
                    <p><span>Reference No:</span> {selectedCustomer.referenceNo || '-'}</p>
                    <p><span>TRN No:</span> {selectedCustomer.trnNo || '-'}</p>
                  </>
                ) : null}
              </div>

              <form className="topup-form" onSubmit={handleTopUpSubmit} autoComplete="off">
                <h4>Top Up Money</h4>
                <div className="topup-grid">
                  <label>
                    Add Amount
                    <input
                      name="topUpAmount"
                      type="number"
                      autoComplete="off"
                      min="0"
                      step="0.01"
                      value={topUpForm.amount}
                      onChange={handleTopUpChange}
                      placeholder="Enter the Amount"
                    />
                  </label>
                  <label>
                    Payment Method
                    <select name="paymentMethod" value={topUpForm.paymentMethod} onChange={handleTopUpChange} autoComplete="off">
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {`${paymentMethodOptionIcons[method] || ''} ${method}`.trim()}
                        </option>
                      ))}
                    </select>
                  </label>
                  {isCashPayment(topUpForm.paymentMethod) ? (
                    <label>
                      Receiver Name
                      <input
                        name="topUpReceiver"
                        type="text"
                        autoComplete="off"
                        value={topUpForm.receiverName}
                        onChange={handleTopUpChange}
                        placeholder="Receiver name"
                      />
                    </label>
                  ) : null}
                  {isCardPayment(topUpForm.paymentMethod) ? (
                    <>
                      <label>
                        Card Last 6
                        <input
                          name="topUpCardLast6"
                          type="text"
                          autoComplete="off"
                          inputMode="numeric"
                          maxLength={6}
                          value={topUpForm.cardLast6}
                          onChange={handleTopUpChange}
                          placeholder="Last 6 digits of Your card"
                        />
                      </label>
                      <label>
                        Card Expiry
                        <input
                          name="topUpCardExpiry"
                          type="text"
                          autoComplete="off"
                          value={topUpForm.cardExpiry}
                          onChange={handleTopUpChange}
                          placeholder="MM/YY"
                        />
                      </label>
                      <label>
                        Name Of Card Holder
                        <input
                          name={`topUpCardHolder__${topUpFieldNonce}`}
                          type="text"
                          autoComplete="one-time-code"
                          value={topUpForm.cardName}
                          onChange={handleTopUpChange}
                          placeholder="Name Of Card Holder"
                        />
                      </label>
                    </>
                  ) : null}
                  {!isCashPayment(topUpForm.paymentMethod) && !isCardPayment(topUpForm.paymentMethod) ? (
                    <>
                      <label>
                        Reference No
                        <input
                          name="topUpReference"
                          type="text"
                          autoComplete="off"
                          value={topUpForm.referenceNo}
                          onChange={handleTopUpChange}
                          placeholder="Reference number"
                        />
                      </label>
                      <label>
                        TRN No
                        <input
                          name="topUpTrn"
                          type="text"
                          autoComplete="off"
                          value={topUpForm.trnNo}
                          onChange={handleTopUpChange}
                          placeholder="TRN number"
                        />
                      </label>
                    </>
                  ) : null}
                </div>
                <div className="topup-actions">
                  <button type="submit" className="submit-customer-btn">Add Money</button>
                  {topUpMessage ? <span className="entry-success">{topUpMessage}</span> : null}
                </div>
              </form>

              <div className="single-customer-actions">
                <button
                  type="button"
                  className="icon-action-btn"
                  aria-label="Edit customer"
                  title="Edit"
                  onClick={() => handleEditCustomer(selectedCustomer)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20h4.2L19 9.2l-4.2-4.2L4 15.8V20Z" />
                    <path d="m12.8 7 4.2 4.2" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="icon-action-btn delete-icon-btn"
                  aria-label="Delete customer"
                  title="Delete"
                  onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 7h14M9 7V4.8h6V7M8.2 7l.6 12h6.4l.6-12" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="icon-action-btn"
                  aria-label="Back to all customers"
                  title="Back"
                  onClick={() => {
                    setSelectedCustomerId(null)
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 6 4 12l6 6" />
                    <path d="M4.5 12H20" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="dash-subtitle">Select a customer to view complete details.</p>
              <div className="customer-search-wrap">
                <span className="customer-search-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="m16 16 4.2 4.2" />
                  </svg>
                </span>
                <input
                  type="search"
                  autoComplete="off"
                  value={customerSearch}
                  onChange={(event) => setCustomerSearch(event.target.value)}
                  placeholder="Search by name, email, phone, company, city, status, plan..."
                  className="customer-search-input"
                />
              </div>

              {customersError ? <p className="muted-text">{customersError}</p> : null}
              {isCustomersLoading ? <p className="muted-text">Loading customers...</p> : null}

              <div className="customer-table-wrap">
                <table className="customer-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Company</th>
                      <th>Type</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Country</th>
                      <th>State</th>
                      <th>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td className="no-result-cell" colSpan={12}>
                          No matching customer details found.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className={selectedCustomerId === customer.id ? 'table-row-selected' : ''}
                          onClick={() => {
                            setSelectedCustomerId(customer.id)
                          }}
                        >
                          <td>
                            <button
                              type="button"
                              className="customer-name-link"
                              onClick={(event) => {
                                event.stopPropagation()
                                setSelectedCustomerId(customer.id)
                              }}
                            >
                              {customer.fullName}
                            </button>
                          </td>
                          <td>{customer.email}</td>
                          <td>{customer.phone}</td>
                          <td>{customer.company || '-'}</td>
                          <td>{customer.customerType || '-'}</td>
                          <td>{customer.plan || '-'}</td>
                          <td>{customer.status || '-'}</td>
                          <td>₹{customer.amount || '0.00'}</td>
                          <td><PaymentMethodDisplay method={customer.paymentMethod} /></td>
                          <td>{customer.country || '-'}</td>
                          <td>{customer.state || '-'}</td>
                          <td>{customer.city || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )
    }

    if (activeItem === 'Customer Company Details') {
      return <Custcomp />
    }

    if (activeItem === 'View Customer Company Details') {
      return <ViewCustcomp onDetailViewChange={setIsCompanyDetailOpen} />
    }

    return (
      <div className="home-body">
        <h2>{activeItem}</h2>
        <p>Welcome to your home tab.</p>
      </div>
    )
  }

  const hideTopbar =
    (activeItem === 'Customer Details' && Boolean(selectedCustomer)) ||
    (activeItem === 'View Customer Company Details' && isCompanyDetailOpen)

  return (
    <main className={`home-layout ${theme === 'light' ? 'theme-light' : 'theme-dark'} ${isSidebarVisible ? '' : 'sidebar-collapsed'}`}>
      {isSidebarVisible ? (
      <aside className="home-sidebar">
        <h1 className="brand-title">Workspace</h1>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const hasChildren = Array.isArray(item.children)
            const isParentActive = activeItem === item.label || (hasChildren && item.children.includes(activeItem))
            const isGroupOpen = Boolean(openGroups[item.label])

            if (!hasChildren) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`side-link ${activeItem === item.label ? 'is-active' : ''}`}
                  onClick={() => saveActiveItem(item.label)}
                >
                  <span className="side-link-content">
                    <span className="side-icon" aria-hidden>
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <div className="nav-group" key={item.label}>
                <button
                  type="button"
                  className={`side-link ${isParentActive ? 'is-active' : ''}`}
                  aria-expanded={isGroupOpen}
                  onClick={() => {
                    toggleGroup(item.label)
                    if (routeLabels.has(item.label)) {
                      saveActiveItem(item.label)
                    } else if (Array.isArray(item.children) && item.children.length > 0) {
                      saveActiveItem(item.children[0])
                    } else {
                      saveActiveItem(item.label)
                    }
                  }}
                >
                  <span className="side-link-row">
                    <span className="side-link-content">
                      <span className="side-icon" aria-hidden>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <span className={`side-link-caret ${isGroupOpen ? 'open' : ''}`} aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6.5 9.5 12 15l5.5-5.5" />
                      </svg>
                    </span>
                  </span>
                </button>

                {isGroupOpen ? (
                  <div className="side-subnav" role="group" aria-label="Dashboard options">
                    {item.children.map((child) => (
                      <button
                        key={child}
                        type="button"
                        className={`side-sub-link ${activeItem === child ? 'is-active' : ''}`}
                        onClick={() => saveActiveItem(child)}
                      >
                        <span className="side-sub-link-content">
                          <span className="side-sub-icon" aria-hidden>
                            {dashboardChildIcons[child] || navIcons[child] || navIcons.Home}
                          </span>
                          {child}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>
      </aside>
      ) : null}

      <section className="home-content">
        <button
          type="button"
          className="top-btn icon-btn nav-toggle-btn nav-toggle-corner"
          onClick={() => setIsSidebarVisible((prev) => !prev)}
          aria-label={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
          title={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
        >
          {isSidebarVisible ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6.5h16M4 12h16M4 17.5h16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          )}
        </button>
        {!hideTopbar ? (
        <header className="home-topbar">
          <div className="search-wrap">
            <span className="search-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.2 4.2" />
              </svg>
            </span>
            <input type="search" autoComplete="off" placeholder="Search anything..." aria-label="Search" className="search-input" />
          </div>

          <div className="top-actions">
            <button
              type="button"
              className="top-btn theme-btn icon-btn"
              onClick={() =>
                setTheme((prev) => {
                  const nextTheme = prev === 'dark' ? 'light' : 'dark'
                  localStorage.setItem(HOME_THEME_KEY, nextTheme)
                  return nextTheme
                })
              }
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              <span className="theme-symbol" aria-hidden>
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="4.2" />
                    <path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7 17 17M7 7 5.3 5.3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 14.3A8.5 8.5 0 1 1 9.7 4a7 7 0 0 0 10.3 10.3Z" />
                  </svg>
                )}
              </span>
            </button>
            <button type="button" className="top-btn icon-btn" aria-label="Notifications">
              🔔
            </button>
            <div className="profile-menu" ref={profileMenuRef}>
              <button
                type="button"
                className="profile-btn"
                aria-label="Profile"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <span className="profile-trigger">
                  <span className="profile-avatar">
                    {initials(displayName)}
                  </span>
                  <span className="profile-trigger-name">{displayName}</span>
                  <span className={`side-link-caret profile-caret ${menuOpen ? 'open' : ''}`} aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6.5 9.5 12 15l5.5-5.5" />
                    </svg>
                  </span>
                </span>
              </button>

              {menuOpen ? (
                <div className="profile-dropdown" role="menu" aria-label="Profile menu">
                  <div className="profile-head">
                    <p className="profile-name">{displayName}</p>
                    <p className="profile-email">{displayEmail}</p>
                  </div>

                  <button type="button" className="profile-item" role="menuitem">
                    <span className="menu-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="12" cy="8" r="3.2" />
                        <path d="M5.5 19c1.5-3.2 4.3-5 6.5-5s5 1.8 6.5 5" />
                      </svg>
                    </span>
                    Edit profile
                  </button>

                  <button type="button" className="profile-item" role="menuitem">
                    <span className="menu-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4.8a7.6 7.6 0 0 0-2-.9L14 3h-4l-.5 2.7a7.6 7.6 0 0 0-2 .9l-2.4-.8-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-.8c.6.4 1.3.7 2 .9L10 21h4l.5-2.7c.7-.2 1.4-.5 2-.9l2.4.8 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" />
                      </svg>
                    </span>
                    Account settings
                  </button>

                  <button type="button" className="profile-item" role="menuitem">
                    <span className="menu-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="12" cy="12" r="8" />
                        <path d="M9 10.5a3 3 0 0 1 6 0c0 2-3 2.2-3 4" />
                        <circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                    Support
                  </button>

                  <button
                    type="button"
                    className="profile-item signout-item"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false)
                      if (typeof onSignOut === 'function') onSignOut()
                    }}
                  >
                    <span className="menu-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9 4H5v16h4" />
                        <path d="M13 8l4 4-4 4" />
                        <path d="M8 12h9" />
                      </svg>
                    </span>
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        ) : null}

        {renderDashboardPanel()}
      </section>
    </main>
  )
}

export default Home
