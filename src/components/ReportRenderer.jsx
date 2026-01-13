function normalizeHeading(text) {
  return text.replace(/^step\s+\d+\s*[:.-]\s*/i, '')
}

function isHeading(text) {
  const trimmed = text.trim()
  if (!trimmed) return false
  if (trimmed.length > 80) return false
  if (trimmed.endsWith('.')) return false
  if (/^#+\s+/.test(trimmed)) return true
  if (/^[A-Z0-9\s-]+$/.test(trimmed)) return true
  return /:$/.test(trimmed)
}

function ReportRenderer({ report }) {
  if (!report) {
    return <p className="text-responsive-base">No report available.</p>
  }

  const sections = report
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <div className="report-renderer">
      {sections.map((section, index) => {
        const lines = section.split('\n').filter(Boolean)
        const firstLine = lines[0] || ''
        const body = lines.slice(1).join('\n')
        const heading = isHeading(firstLine) ? normalizeHeading(firstLine) : ''
        const content = heading ? body : section

        return (
          <div key={`${index}-${firstLine}`} className="report-renderer__section">
            {heading ? (
              <h3 className="text-responsive-md">{heading.replace(/^#+\s*/, '')}</h3>
            ) : null}
            <p className="report-renderer__body">{content}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ReportRenderer
