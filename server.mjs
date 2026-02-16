import { createServer } from 'node:http'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_FILE = path.join(__dirname, 'src', 'data', 'db.json')
const PORT = 4000
const DEFAULT_NAVIGATION = [
  { label: 'Home' },
  { label: 'Dashboard', children: ['Customer Entry', 'Customer Details'] },
  { label: 'Customer Company Details', children: ['View Customer Company Details'] },
  { label: 'Projects' },
  { label: 'Messages' },
  { label: 'Settings' },
]

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function sendJson(res, status, body) {
  setCorsHeaders(res)
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

async function ensureDb() {
  try {
    await fs.access(DB_FILE)
  } catch {
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true })
    await fs.writeFile(
      DB_FILE,
      JSON.stringify({ customers: [], companyDetails: [], navigation: DEFAULT_NAVIGATION }, null, 2),
      'utf8',
    )
  }
}

async function readDb() {
  await ensureDb()
  const raw = await fs.readFile(DB_FILE, 'utf8')
  return JSON.parse(raw)
}

async function writeDb(db) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8')
}

async function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 1_000_000) reject(new Error('Payload too large'))
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

const server = createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: 'Invalid request' })
    return
  }

  const { method } = req
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (method === 'OPTIONS') {
    setCorsHeaders(res)
    res.writeHead(204)
    res.end()
    return
  }

  try {
    if (method === 'GET' && url.pathname === '/api/health') {
      sendJson(res, 200, { ok: true })
      return
    }

    if (method === 'GET' && url.pathname === '/api/customers') {
      const db = await readDb()
      sendJson(res, 200, db.customers ?? [])
      return
    }

    if (method === 'GET' && url.pathname === '/api/company-details') {
      const db = await readDb()
      sendJson(res, 200, db.companyDetails ?? [])
      return
    }

    if (method === 'POST' && url.pathname === '/api/company-details') {
      const payload = await readRequestBody(req)

      if (
        !payload.companyName ||
        !payload.contactPerson ||
        !payload.email ||
        !payload.phone ||
        !payload.address ||
        !payload.industry ||
        payload.employees === undefined
      ) {
        sendJson(res, 400, { error: 'All company fields are required.' })
        return
      }

      const db = await readDb()
      const created = {
        ...payload,
        id: payload.id || `cc_${Date.now()}`,
      }

      db.companyDetails = [created, ...(db.companyDetails ?? [])]
      await writeDb(db)
      sendJson(res, 201, created)
      return
    }

    if (method === 'PUT' && url.pathname.startsWith('/api/company-details/')) {
      const id = decodeURIComponent(url.pathname.replace('/api/company-details/', '').trim())
      if (!id) {
        sendJson(res, 400, { error: 'Company detail id is required.' })
        return
      }

      const payload = await readRequestBody(req)
      const db = await readDb()
      const index = (db.companyDetails ?? []).findIndex((record) => record.id === id)

      if (index === -1) {
        sendJson(res, 404, { error: 'Company detail not found.' })
        return
      }

      const updated = { ...db.companyDetails[index], ...payload, id }
      db.companyDetails[index] = updated
      await writeDb(db)
      sendJson(res, 200, updated)
      return
    }

    if (method === 'DELETE' && url.pathname.startsWith('/api/company-details/')) {
      const id = decodeURIComponent(url.pathname.replace('/api/company-details/', '').trim())
      if (!id) {
        sendJson(res, 400, { error: 'Company detail id is required.' })
        return
      }

      const db = await readDb()
      const next = (db.companyDetails ?? []).filter((record) => record.id !== id)

      if (next.length === (db.companyDetails ?? []).length) {
        sendJson(res, 404, { error: 'Company detail not found.' })
        return
      }

      db.companyDetails = next
      await writeDb(db)
      sendJson(res, 200, { ok: true })
      return
    }

    if (method === 'GET' && url.pathname === '/api/navigation') {
      const db = await readDb()
      sendJson(res, 200, Array.isArray(db.navigation) ? db.navigation : DEFAULT_NAVIGATION)
      return
    }

    if (method === 'POST' && url.pathname === '/api/customers') {
      const payload = await readRequestBody(req)

      if (!payload.fullName || !payload.email || !payload.phone) {
        sendJson(res, 400, { error: 'fullName, email, and phone are required.' })
        return
      }

      const db = await readDb()
      const created = {
        ...payload,
        id: payload.id || `c_${Date.now()}`,
      }

      db.customers = [created, ...(db.customers ?? [])]
      await writeDb(db)
      sendJson(res, 201, created)
      return
    }

    if (method === 'PUT' && url.pathname.startsWith('/api/customers/')) {
      const id = decodeURIComponent(url.pathname.replace('/api/customers/', '').trim())
      if (!id) {
        sendJson(res, 400, { error: 'Customer id is required.' })
        return
      }

      const payload = await readRequestBody(req)
      const db = await readDb()
      const index = (db.customers ?? []).findIndex((customer) => customer.id === id)

      if (index === -1) {
        sendJson(res, 404, { error: 'Customer not found.' })
        return
      }

      const updated = { ...db.customers[index], ...payload, id }
      db.customers[index] = updated
      await writeDb(db)
      sendJson(res, 200, updated)
      return
    }

    if (method === 'DELETE' && url.pathname.startsWith('/api/customers/')) {
      const id = decodeURIComponent(url.pathname.replace('/api/customers/', '').trim())
      if (!id) {
        sendJson(res, 400, { error: 'Customer id is required.' })
        return
      }

      const db = await readDb()
      const nextCustomers = (db.customers ?? []).filter((customer) => customer.id !== id)

      if (nextCustomers.length === (db.customers ?? []).length) {
        sendJson(res, 404, { error: 'Customer not found.' })
        return
      }

      db.customers = nextCustomers
      await writeDb(db)
      sendJson(res, 200, { ok: true })
      return
    }

    sendJson(res, 404, { error: 'Route not found' })
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Server error' })
  }
})

server.listen(PORT, () => {
  console.log(`JSON DB API running at http://localhost:${PORT}`)
})
