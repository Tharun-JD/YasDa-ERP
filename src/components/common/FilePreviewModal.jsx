function getPreviewType(fileData) {
  if (!fileData) return 'none'
  if (fileData.startsWith('data:image/')) return 'image'
  if (fileData.startsWith('data:application/pdf')) return 'pdf'
  return 'other'
}

function FilePreviewModal({ fileData, fileName, onClose }) {
  if (!fileData) return null

  const previewType = getPreviewType(fileData)

  return (
    <div className="preview-backdrop" role="dialog" aria-modal="true" aria-label="Uploaded document preview">
      <div className="preview-panel">
        <div className="preview-head">
          <p className="preview-name">{fileName || 'Uploaded file'}</p>
          <button type="button" className="preview-close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="preview-body">
          {previewType === 'image' ? <img src={fileData} alt={fileName || 'Uploaded document'} className="preview-image" /> : null}
          {previewType === 'pdf' ? <iframe title={fileName || 'PDF preview'} src={fileData} className="preview-frame" /> : null}
          {previewType === 'other' ? (
            <div className="preview-fallback">
              <p>Preview is not available for this file type.</p>
              <a href={fileData} target="_blank" rel="noreferrer" className="upload-btn">
                Open File
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default FilePreviewModal

