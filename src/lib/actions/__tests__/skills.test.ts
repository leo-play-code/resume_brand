import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/cache before importing actions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock next-auth session
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

// Mock auth options (only needs to exist)
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    skill: {
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { addSkill, deleteSkill } from '../skills'

const mockSession = { user: { name: 'Admin', email: 'admin@test.com' } }

describe('addSkill', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
  })

  it('creates skill with isCustom=true when valid data provided', async () => {
    const newSkill = {
      id: 'new-id',
      nameZh: '新技能',
      nameEn: 'New Skill',
      category: '程式語言',
      isCustom: true,
    }
    vi.mocked(prisma.skill.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.skill.create).mockResolvedValue(newSkill as any)

    const formData = new FormData()
    formData.set('nameZh', '新技能')
    formData.set('nameEn', 'New Skill')
    formData.set('category', '程式語言')

    const result = await addSkill(formData)

    expect(result).toEqual({ success: true, skill: newSkill })
    expect(prisma.skill.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isCustom: true, nameZh: '新技能' }),
      })
    )
    expect(revalidatePath).toHaveBeenCalledWith('/admin/tech')
  })

  it('returns { error: "技能已存在" } when duplicate nameZh', async () => {
    const existing = {
      id: 'existing-id',
      nameZh: '重複技能',
      nameEn: 'Duplicate',
      category: '其他',
      isCustom: false,
    }
    vi.mocked(prisma.skill.findFirst).mockResolvedValue(existing as any)

    const formData = new FormData()
    formData.set('nameZh', '重複技能')
    formData.set('nameEn', 'Duplicate')
    formData.set('category', '其他')

    const result = await addSkill(formData)

    expect(result).toEqual({ error: '技能已存在' })
    expect(prisma.skill.create).not.toHaveBeenCalled()
  })

  it('returns error when nameZh is empty', async () => {
    const formData = new FormData()
    formData.set('nameZh', '')
    formData.set('nameEn', 'Some Skill')
    formData.set('category', '其他')

    const result = await addSkill(formData)

    expect(result).toHaveProperty('error')
    expect(result.error).toBeTruthy()
    expect(prisma.skill.create).not.toHaveBeenCalled()
  })

  it('throws Unauthorized when session is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const formData = new FormData()
    formData.set('nameZh', '技能')

    await expect(addSkill(formData)).rejects.toThrow('Unauthorized')
  })
})

describe('deleteSkill', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
  })

  it('deletes isCustom=true skill successfully', async () => {
    const customSkill = {
      id: 'custom-id',
      nameZh: '自訂',
      nameEn: 'Custom',
      category: '其他',
      isCustom: true,
    }
    vi.mocked(prisma.skill.findFirst).mockResolvedValue(customSkill as any)
    vi.mocked(prisma.skill.delete).mockResolvedValue(customSkill as any)

    await deleteSkill('custom-id')

    expect(prisma.skill.delete).toHaveBeenCalledWith({ where: { id: 'custom-id' } })
    expect(revalidatePath).toHaveBeenCalledWith('/admin/tech')
  })

  it('throws Error when skill has isCustom=false (preset skill)', async () => {
    const presetSkill = {
      id: 'preset-id',
      nameZh: 'Python',
      nameEn: 'Python',
      category: '程式語言',
      isCustom: false,
    }
    vi.mocked(prisma.skill.findFirst).mockResolvedValue(presetSkill as any)

    await expect(deleteSkill('preset-id')).rejects.toThrow('Cannot delete preset skills')
    expect(prisma.skill.delete).not.toHaveBeenCalled()
  })

  it('throws Error when skill not found', async () => {
    vi.mocked(prisma.skill.findFirst).mockResolvedValue(null)

    await expect(deleteSkill('non-existent-id')).rejects.toThrow('Skill not found')
    expect(prisma.skill.delete).not.toHaveBeenCalled()
  })

  it('throws Unauthorized when session is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    await expect(deleteSkill('some-id')).rejects.toThrow('Unauthorized')
  })
})
