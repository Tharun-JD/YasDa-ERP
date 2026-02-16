import { useEffect, useMemo, useState } from 'react'
import { SelectField, TextField } from './components/customer-company/FormFields.jsx'
import { industryOptions, requiredCompanyFields, validateCompanyField, validateCompanyForm } from './constants/companyDetails.js'
import { deleteCompanyDetailsFromDb, fetchCompanyDetailsFromDb, updateCompanyDetailsInDb } from './services/companyDetailsApi.js'

function industryLabel(value) {
  return industryOptions.find((option) => option.value === value)?.label || value || '-'
}

function readCompanyIdFromUrl() {
  try {
    const url = new URL(window.location.href)
    return url.searchParams.get('companyId')
  } catch {
    return null
  }
}

function toEditableForm(record) {
  return {
    companyName: record?.companyName || '',
    contactPerson: record?.contactPerson || '',
    email: record?.email || '',
    phone: record?.phone || '',
    address: record?.address || '',
    industry: record?.industry || '',
    employees: String(record?.employees ?? ''),
    companyPhotoName: record?.companyPhotoName || '',
    companyPhotoData: record?.companyPhotoData || '',
    companyDocName: record?.companyDocName || '',
    companyDocData: record?.companyDocData || '',
  }
}

function ViewCustcomp({ onDetailViewChange }) {
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [recordsError, setRecordsError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(() => readCompanyIdFromUrl() || null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(() => toEditableForm(null))
  const [editErrors, setEditErrors] = useState({})
  const [editTouched, setEditTouched] = useState({})
  const [editMessage, setEditMessage] = useState('')

  const selectedRecord = records.find((item) => item.id === selectedId) || null
  const normalizedSearch = search.trim().toLowerCase()
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      if (!normalizedSearch) return true
      return Object.values(item).join(' ').toLowerCase().includes(normalizedSearch)
    })
  }, [records, normalizedSearch])

  const visibleEditErrors = useMemo(() => {
    return Object.keys(editErrors).reduce((acc, key) => {
      if (editTouched[key]) acc[key] = editErrors[key]
      return acc
    }, {})
  }, [editErrors, editTouched])

  useEffect(() => {
    if (typeof onDetailViewChange === 'function') {
      onDetailViewChange(Boolean(selectedRecord))
    }
  }, [selectedRecord, onDetailViewChange])

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        setRecordsError('')
        const data = await fetchCompanyDetailsFromDb()
        setRecords(Array.isArray(data) ? data : [])
      } catch {
        setRecordsError('Unable to load company details. Start API server to use JSON DB.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    if (isLoading) return
    if (selectedId && !records.some((item) => item.id === selectedId)) {
      setSelectedId(null)
      setIsEditing(false)
    }
  }, [records, selectedId, isLoading])

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

  const handleDelete = async (id) => {
    try {
      await deleteCompanyDetailsFromDb(id)
      setRecords((prev) => prev.filter((item) => item.id !== id))
      if (selectedId === id) {
        setSelectedId(null)
        setIsEditing(false)
      }
      setRecordsError('')
    } catch {
      setRecordsError('Delete failed. Please check API server.')
    }
  }

  const handleEditStart = () => {
    if (!selectedRecord) return
    setEditForm(toEditableForm(selectedRecord))
    setEditErrors({})
    setEditTouched({})
    setEditMessage('')
    setIsEditing(true)
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target
    const nextValue = name === 'employees' ? value.replace(/[^\d]/g, '') : value
    setEditForm((prev) => ({ ...prev, [name]: nextValue }))
    setEditMessage('')
    setEditErrors((prev) => ({ ...prev, [name]: validateCompanyField(name, nextValue) }))
  }

  const handleEditBlur = (event) => {
    const { name, value } = event.target
    setEditTouched((prev) => ({ ...prev, [name]: true }))
    setEditErrors((prev) => ({ ...prev, [name]: validateCompanyField(name, value) }))
  }

  const handleEditPhotoSelected = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setEditForm((prev) => ({
        ...prev,
        companyPhotoName: file.name,
        companyPhotoData: typeof reader.result === 'string' ? reader.result : '',
      }))
      setEditMessage('')
    }
    reader.readAsDataURL(file)
  }

  const handleEditDocSelected = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setEditForm((prev) => ({
        ...prev,
        companyDocName: file.name,
        companyDocData: typeof reader.result === 'string' ? reader.result : '',
      }))
      setEditMessage('')
    }
    reader.readAsDataURL(file)
  }

  const handleEditSave = async (event) => {
    event.preventDefault()
    if (!selectedRecord) return

    const nextErrors = validateCompanyForm(editForm)
    if (Object.keys(nextErrors).length > 0) {
      setEditErrors(nextErrors)
      setEditTouched(requiredCompanyFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}))
      setEditMessage('Please fix validation errors before saving.')
      return
    }

    const payload = {
      ...selectedRecord,
      companyName: editForm.companyName.trim(),
      contactPerson: editForm.contactPerson.trim(),
      email: editForm.email.trim().toLowerCase(),
      phone: editForm.phone.trim(),
      address: editForm.address.trim(),
      industry: editForm.industry.trim(),
      employees: Number(editForm.employees),
      companyPhotoName: editForm.companyPhotoName || '',
      companyPhotoData: editForm.companyPhotoData || '',
      companyDocName: editForm.companyDocName || '',
      companyDocData: editForm.companyDocData || '',
    }

    try {
      const updated = await updateCompanyDetailsInDb(selectedRecord.id, payload)
      setRecords((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      setIsEditing(false)
      setEditMessage('Company details updated successfully.')
      setRecordsError('')
    } catch {
      setEditMessage('Update failed. Please check API server.')
    }
  }

  return (
    <div className="dashboard-card">
      <div className="tab-head-row">
        <h2>View Customer Company Details</h2>
      </div>
      <p className="dash-subtitle">Search and view saved customer company records.</p>

      {!selectedRecord ? (
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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by company, contact person, email, phone, or industry..."
            className="customer-search-input"
          />
        </div>
      ) : null}

      {recordsError ? <p className="muted-text">{recordsError}</p> : null}
      {isLoading ? <p className="muted-text">Loading company details...</p> : null}

      {selectedRecord ? (
        <div className="single-customer-view company-fullscreen-view">
          <div className="single-customer-head">
            <h3>{selectedRecord.companyName || '-'}</h3>
            <div className="customer-head-actions">
              <span className="amount-chip">{industryLabel(selectedRecord.industry)}</span>
              <span className="customer-passport-wrap" aria-label="Company photo">
                {selectedRecord.companyPhotoData ? (
                  <img
                    src={selectedRecord.companyPhotoData}
                    alt={`${selectedRecord.companyName || 'Company'} profile`}
                    className="customer-passport-photo"
                  />
                ) : (
                  <span className="customer-passport-fallback">CO</span>
                )}
              </span>
            </div>
          </div>

          {isEditing ? (
            <form className="cc-form" onSubmit={handleEditSave} noValidate autoComplete="off">
              <div className="cc-grid">
                <TextField label="Company Name" name="companyName" value={editForm.companyName} onChange={handleEditChange} onBlur={handleEditBlur} error={visibleEditErrors.companyName} placeholder="Enter company name" />
                <TextField label="Contact Person" name="contactPerson" value={editForm.contactPerson} onChange={handleEditChange} onBlur={handleEditBlur} error={visibleEditErrors.contactPerson} placeholder="Enter contact person" />
                <TextField label="Email" name="email" type="email" value={editForm.email} onChange={handleEditChange} onBlur={handleEditBlur} error={visibleEditErrors.email} placeholder="company@example.com" />
                <TextField label="Phone" name="phone" type="tel" value={editForm.phone} onChange={handleEditChange} onBlur={handleEditBlur} error={visibleEditErrors.phone} placeholder="Enter phone number" />
                <TextField label="Address" name="address" value={editForm.address} onChange={handleEditChange} onBlur={handleEditBlur} error={visibleEditErrors.address} placeholder="Street, city, state, zip" />
                <SelectField label="Industry" name="industry" value={editForm.industry} onChange={handleEditChange} onBlur={handleEditBlur} error={visibleEditErrors.industry} options={industryOptions} />
                <TextField label="Number of Employees" name="employees" type="text" inputMode="numeric" value={editForm.employees} onChange={handleEditChange} onBlur={handleEditBlur} error={visibleEditErrors.employees} placeholder="Enter total employees" />
              </div>

              <div className="full-row upload-row">
                <span>Company Photo</span>
                <div className="upload-control">
                  <button type="button" className="upload-btn" onClick={() => pickFile('.png,.jpg,.jpeg,.webp', handleEditPhotoSelected)}>
                    <span className="upload-btn-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 16V5" />
                        <path d="m8.5 8.5 3.5-3.5 3.5 3.5" />
                        <path d="M4.5 15.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
                      </svg>
                    </span>
                    Upload Photo
                  </button>
                  <span className="upload-file-name">{editForm.companyPhotoName || 'No photo selected'}</span>
                  {editForm.companyPhotoName ? (
                    <button
                      type="button"
                      className="upload-clear-btn"
                      onClick={() => setEditForm((prev) => ({ ...prev, companyPhotoName: '', companyPhotoData: '' }))}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="full-row upload-row">
                <span>Company Document</span>
                <div className="upload-control">
                  <button type="button" className="upload-btn" onClick={() => pickFile('.pdf,.png,.jpg,.jpeg,.doc,.docx', handleEditDocSelected)}>
                    <span className="upload-btn-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 16V5" />
                        <path d="m8.5 8.5 3.5-3.5 3.5 3.5" />
                        <path d="M4.5 15.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
                      </svg>
                    </span>
                    Upload File
                  </button>
                  <span className="upload-file-name">{editForm.companyDocName || 'No file selected'}</span>
                  {editForm.companyDocData ? (
                    <button type="button" className="upload-view-btn" onClick={() => openUploadedFile(editForm.companyDocData)}>
                      View
                    </button>
                  ) : null}
                  {editForm.companyDocName ? (
                    <button
                      type="button"
                      className="upload-clear-btn"
                      onClick={() => setEditForm((prev) => ({ ...prev, companyDocName: '', companyDocData: '' }))}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="cc-actions">
                <button type="submit" className="submit-customer-btn">Save Changes</button>
                <button
                  type="button"
                  className="reset-customer-btn"
                  onClick={() => {
                    setIsEditing(false)
                    setEditForm(toEditableForm(selectedRecord))
                    setEditErrors({})
                    setEditTouched({})
                    setEditMessage('')
                  }}
                >
                  Cancel
                </button>
                {editMessage ? <p className={`cc-message ${Object.keys(editErrors).length === 0 ? 'is-success' : 'is-error'}`}>{editMessage}</p> : null}
              </div>
            </form>
          ) : (
            <>
              <div className="single-customer-grid">
                <p><span>Contact Person:</span> {selectedRecord.contactPerson || '-'}</p>
                <p><span>Email:</span> {selectedRecord.email || '-'}</p>
                <p><span>Phone:</span> {selectedRecord.phone || '-'}</p>
                <p><span>Address:</span> {selectedRecord.address || '-'}</p>
                <p><span>Industry:</span> {industryLabel(selectedRecord.industry)}</p>
                <p><span>Employees:</span> {selectedRecord.employees ?? '-'}</p>
                <p>
                  <span>Uploaded Document:</span> {selectedRecord.companyDocName || '-'}
                  {selectedRecord.companyDocData ? (
                    <button
                      type="button"
                      className="upload-view-btn inline-view-btn"
                      onClick={() => openUploadedFile(selectedRecord.companyDocData)}
                    >
                      View
                    </button>
                  ) : null}
                </p>
              </div>
              <div className="single-customer-actions">
                <button
                  type="button"
                  className="icon-action-btn"
                  title="Edit"
                  aria-label="Edit company details"
                  onClick={handleEditStart}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m4 20 4.2-1 10-10a1.8 1.8 0 0 0 0-2.5l-.7-.7a1.8 1.8 0 0 0-2.5 0l-10 10L4 20Z" />
                    <path d="M13.8 6.2 17.8 10.2" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="icon-action-btn delete-icon-btn"
                  title="Delete"
                  aria-label="Delete company details"
                  onClick={() => handleDelete(selectedRecord.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 7h14M9 7V4.8h6V7M8.2 7l.6 12h6.4l.6-12" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="icon-action-btn"
                  title="Back"
                  aria-label="Back to all company details"
                  onClick={() => {
                    setSelectedId(null)
                    setIsEditing(false)
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 6 4 12l6 6" />
                    <path d="M4.5 12H20" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="customer-table-wrap">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Industry</th>
                <th>Employees</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td className="no-result-cell" colSpan={7}>
                    No matching company details found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className={selectedId === record.id ? 'table-row-selected' : ''} onClick={() => setSelectedId(record.id)}>
                    <td>
                      <button
                        type="button"
                        className="customer-name-link"
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedId(record.id)
                        }}
                      >
                        {record.companyName || '-'}
                      </button>
                    </td>
                    <td>{record.contactPerson || '-'}</td>
                    <td>{record.email || '-'}</td>
                    <td>{record.phone || '-'}</td>
                    <td>{record.address || '-'}</td>
                    <td>{industryLabel(record.industry)}</td>
                    <td>{record.employees ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ViewCustcomp
