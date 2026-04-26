import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../route'

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    skill: {
      findMany: vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'

const now = new Date()
const mockSkills = [
  { id: '1', nameZh: 'Python', nameEn: 'Python', category: '程式語言', isCustom: false, isActive: true, createdAt: now },
  { id: '2', nameZh: 'JavaScript', nameEn: 'JavaScript', category: '程式語言', isCustom: false, isActive: true, createdAt: now },
  { id: '3', nameZh: 'React', nameEn: 'React', category: '前端框架', isCustom: false, isActive: true, createdAt: now },
  { id: '4', nameZh: '自訂技能', nameEn: 'Custom Skill', category: '其他', isCustom: true, isActive: true, createdAt: now },
]

describe('GET /api/skills', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns { data: [...] } with status 200', async () => {
    vi.mocked(prisma.skill.findMany).mockResolvedValue(mockSkills)

    const req = new Request('http://localhost/api/skills')
    const res = await GET(req as any)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json).toHaveProperty('data')
    expect(Array.isArray(json.data)).toBe(true)
    expect(json.data).toHaveLength(4)
  })

  it('GET /api/skills?q=python returns only skills matching "python"', async () => {
    const filtered = mockSkills.filter(
      (s) =>
        s.nameZh.toLowerCase().includes('python') ||
        s.nameEn.toLowerCase().includes('python')
    )
    vi.mocked(prisma.skill.findMany).mockResolvedValue(filtered)

    const req = new Request('http://localhost/api/skills?q=python')
    const res = await GET(req as any)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].nameEn).toBe('Python')

    // Verify prisma was called with the correct where clause
    expect(prisma.skill.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ nameZh: expect.objectContaining({ contains: 'python' }) }),
            expect.objectContaining({ nameEn: expect.objectContaining({ contains: 'python' }) }),
          ]),
        }),
      })
    )
  })

  it('GET /api/skills?category=程式語言 returns only that category', async () => {
    const filtered = mockSkills.filter((s) => s.category === '程式語言')
    vi.mocked(prisma.skill.findMany).mockResolvedValue(filtered)

    const req = new Request('http://localhost/api/skills?category=%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80')
    const res = await GET(req as any)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.data).toHaveLength(2)
    json.data.forEach((skill: { category: string }) => {
      expect(skill.category).toBe('程式語言')
    })

    // Verify prisma was called with category filter
    expect(prisma.skill.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ category: '程式語言' }),
      })
    )
  })

  it('GET /api/skills?q=xyz returns { data: [] }', async () => {
    vi.mocked(prisma.skill.findMany).mockResolvedValue([])

    const req = new Request('http://localhost/api/skills?q=xyz')
    const res = await GET(req as any)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.data).toEqual([])
  })

  it('returns 500 on database error', async () => {
    vi.mocked(prisma.skill.findMany).mockRejectedValue(new Error('DB error'))

    const req = new Request('http://localhost/api/skills')
    const res = await GET(req as any)
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json).toHaveProperty('error')
  })
})
