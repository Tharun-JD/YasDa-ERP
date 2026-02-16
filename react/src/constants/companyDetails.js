export const industryOptions = [
  { value: '', label: 'Select industry' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
  { value: 'logistics', label: 'Logistics' },
]

export const initialCompanyForm = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  industry: '',
  employees: '',
  companyPhotoName: '',
  companyPhotoData: '',
  companyDocName: '',
  companyDocData: '',
}

export const requiredCompanyFields = ['companyName', 'contactPerson', 'email', 'phone', 'address', 'industry', 'employees']

export function validateCompanyField(name, value) {
  const trimmed = String(value ?? '').trim()

  if (!trimmed) return 'This field is required.'

  if (name === 'companyName' || name === 'contactPerson') {
    if (trimmed.length < 2) return 'Must be at least 2 characters.'
  }

  if (name === 'email') {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    if (!isValidEmail) return 'Enter a valid email address.'
  }

  if (name === 'phone') {
    const digits = trimmed.replace(/\D/g, '')
    const isValidPhone = digits.length >= 9 && digits.length <= 12
    if (!isValidPhone) return 'Enter a valid phone number.'
  }

  if (name === 'address' && trimmed.length < 8) {
    return 'Address must be at least 8 characters.'
  }

  if (name === 'employees') {
    const number = Number(trimmed)
    if (!Number.isInteger(number) || number <= 0) return 'Enter a valid employee count.'
  }

  return ''
}

export function validateCompanyForm(values) {
  return requiredCompanyFields.reduce((next, key) => {
    const error = validateCompanyField(key, values[key])
    if (error) next[key] = error
    return next
  }, {})
}
