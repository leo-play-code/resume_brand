import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock prisma before importing the route so the module uses the mock
vi.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      findUnique: vi.fn(),
    },
  },
}))

import { GET } from '../route'
import { prisma } from '@/lib/prisma'

// Helper to build a minimal NextRequest-compatible object
function makeRequest(projectId: string) {
  const req = new Request(`http://localhost/api/demo/${projectId}`)
  const params = Promise.resolve({ projectId })
  return { req, params }
}

describe('GET /api/demo/[projectId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 text/html when heroType is "js-demo" and heroJsCode is present', async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      heroType: 'js-demo',
      heroJsCode: 'export default function App() { return null; }',
    } as any)

    const { req, params } = makeRequest('project-abc')
    const res = await GET(req as any, { params })

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('text/html')
  })

  it('returns 404 when heroType is "mp4"', async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      heroType: 'mp4',
      heroJsCode: null,
    } as any)

    const { req, params } = makeRequest('project-abc')
    const res = await GET(req as any, { params })

    expect(res.status).toBe(404)
  })

  it('returns 404 when heroType is "js-demo" but heroJsCode is null', async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      heroType: 'js-demo',
      heroJsCode: null,
    } as any)

    const { req, params } = makeRequest('project-abc')
    const res = await GET(req as any, { params })

    expect(res.status).toBe(404)
  })

  it('returns 404 when project does not exist (findUnique returns null)', async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null)

    const { req, params } = makeRequest('nonexistent-id')
    const res = await GET(req as any, { params })

    expect(res.status).toBe(404)
  })

  it('200 response Content-Type header contains text/html', async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      heroType: 'js-demo',
      heroJsCode: 'export default () => null;',
    } as any)

    const { req, params } = makeRequest('project-xyz')
    const res = await GET(req as any, { params })

    expect(res.status).toBe(200)
    const contentType = res.headers.get('Content-Type') ?? ''
    expect(contentType).toContain('text/html')
  })
})
