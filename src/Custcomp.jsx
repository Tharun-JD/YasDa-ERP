import { useMemo, useState } from 'react'
import { SelectField, TextField } from './components/customer-company/FormFields.jsx'
import {
  industryOptions,
  initialCompanyForm,
  requiredCompanyFields,
  validateCompanyField,
  validateCompanyForm,
} from './constants/companyDetails.js'
import { createCompanyDetailsInDb } from './services/companyDetailsApi.js'

function Custcomp() {
  const [form, setForm] = useState(initialCompanyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitMessage, setSubmitMessage] = useState('')

  const showErrors = useMemo(() => {
    return Object.keys(errors).reduce((acc, key) => {
      if (touched[key]) acc[key] = errors[key]
      return acc
    }, {})
  }, [errors, touched])

  const handleChange = (event) => {
    const { name, value } = event.target
    const nextValue = name === 'employees' ? value.replace(/[^\d]/g, '') : value

    setForm((prev) => ({ ...prev, [name]: nextValue }))
    setSubmitMessage('')
    setErrors((prev) => ({ ...prev, [name]: validateCompanyField(name, nextValue) }))
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateCompanyField(name, value) }))
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

  const handleCompanyFileSelected = (file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        companyDocName: file.name,
        companyDocData: typeof reader.result === 'string' ? reader.result : '',
      }))
      setSubmitMessage('')
    }
    reader.readAsDataURL(file)
  }

  const handleCompanyPhotoSelected = (file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        companyPhotoName: file.name,
        companyPhotoData: typeof reader.result === 'string' ? reader.result : '',
      }))
      setSubmitMessage('')
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateCompanyForm(form)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setTouched(requiredCompanyFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}))
      setSubmitMessage('Please fix validation errors before submitting.')
      return
    }

    const payload = {
      id: `cc_${Date.now()}`,
      companyName: form.companyName.trim(),
      contactPerson: form.contactPerson.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      industry: form.industry.trim(),
      employees: Number(form.employees),
      companyPhotoName: form.companyPhotoName || '',
      companyPhotoData: form.companyPhotoData || '',
      companyDocName: form.companyDocName || '',
      companyDocData: form.companyDocData || '',
    }

    try {
      await createCompanyDetailsInDb(payload)
      setSubmitMessage('Company details saved successfully.')
      setForm(initialCompanyForm)
      setTouched({})
      setErrors({})
    } catch {
      setSubmitMessage('Could not save company details. Please check API server.')
    }
  }

  return (
    <div className="dashboard-card">
      <div className="tab-head-row">
        <h2>Customer Company Details</h2>
        <div className="tab-right-actions">
          <button type="button" className="top-btn photo-update-btn" onClick={() => pickFile('.png,.jpg,.jpeg,.webp', handleCompanyPhotoSelected)}>
            <span className="photo-update-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3.5" y="6.5" width="17" height="12" rx="2" />
                <circle cx="12" cy="12.5" r="3" />
                <path d="M8 6.5 9 4.8h6L16 6.5" />
              </svg>
            </span>
            {form.companyPhotoName ? 'Photo Selected' : 'Upload Photo'}
          </button>
          {form.companyPhotoName ? (
            <button
              type="button"
              className="top-btn"
              onClick={() => setForm((prev) => ({ ...prev, companyPhotoName: '', companyPhotoData: '' }))}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <p className="dash-subtitle">Capture customer company information.</p>

      <form className="cc-form" onSubmit={handleSubmit} noValidate autoComplete="off">
        <div className="cc-grid">
          <TextField label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} onBlur={handleBlur} error={showErrors.companyName} placeholder="Enter Your Company Name" />
          <TextField label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={handleChange} onBlur={handleBlur} error={showErrors.contactPerson} placeholder="Enter Contact Person Name" />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} error={showErrors.email} placeholder="company@example.com" />
          <TextField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} onBlur={handleBlur} error={showErrors.phone} placeholder="Enter Phone Number" />
          <TextField label="Address" name="address" value={form.address} onChange={handleChange} onBlur={handleBlur} error={showErrors.address} placeholder="Street, city, state, zip" />
          <SelectField label="Industry" name="industry" value={form.industry} onChange={handleChange} onBlur={handleBlur} error={showErrors.industry} options={industryOptions} />
          <TextField label="Number of Employees" name="employees" type="text" inputMode="numeric" value={form.employees} onChange={handleChange} onBlur={handleBlur} error={showErrors.employees} placeholder="Enter Total Number of Employees" />
        </div>

        <div className="full-row upload-row">
          <span>Company Document</span>
          <div className="upload-control">
            <button type="button" className="upload-btn" onClick={() => pickFile('.pdf,.png,.jpg,.jpeg,.doc,.docx', handleCompanyFileSelected)}>
              <span className="upload-btn-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V5" />
                  <path d="m8.5 8.5 3.5-3.5 3.5 3.5" />
                  <path d="M4.5 15.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
                </svg>
              </span>
              Upload File
            </button>
            <span className="upload-file-name">{form.companyDocName || 'No file selected'}</span>
            {form.companyDocData ? (
              <button type="button" className="upload-view-btn" onClick={() => openUploadedFile(form.companyDocData)}>
                View
              </button>
            ) : null}
            {form.companyDocName ? (
              <button
                type="button"
                className="upload-clear-btn"
                onClick={() => setForm((prev) => ({ ...prev, companyDocName: '', companyDocData: '' }))}
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>

        <div className="cc-actions">
          <button type="submit" className="submit-customer-btn">
            Save Company Details
          </button>
          {submitMessage ? (
            <p className={`cc-message ${Object.keys(errors).length === 0 ? 'is-success' : 'is-error'}`}>{submitMessage}</p>
          ) : null}
        </div>
      </form>
    </div>
  )
}

export default Custcomp
