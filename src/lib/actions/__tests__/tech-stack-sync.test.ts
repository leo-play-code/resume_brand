import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/cache before importing actions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock next-auth session (requireAdmin calls getServerSession)
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

// Mock auth options
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    techStack: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { syncProjectTechToStack } from '../tech-stack'

describe('syncProjectTechToStack()', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does nothing when names array is empty', async () => {
    await syncProjectTechToStack([])

    expect(prisma.techStack.findMany).not.toHaveBeenCalled()
    expect(prisma.techStack.create).not.toHaveBeenCalled()
  })

  it('does not call create when all names already exist in TechStack', async () => {
    vi.mocked(prisma.techStack.findMany).mockResolvedValue([
      { name: 'React', rowNumber: 1, displayOrder: 1 },
      { name: 'TypeScript', rowNumber: 1, displayOrder: 2 },
    ] as any)

    await syncProjectTechToStack(['React', 'TypeScript'])

    expect(prisma.techStack.create).not.toHaveBeenCalled()
  })

  it('calls create once when one new tech is provided', async () => {
    vi.mocked(prisma.techStack.findMany).mockResolvedValue([
      { name: 'React', rowNumber: 1, displayOrder: 1 },
    ] as any)
    vi.mocked(prisma.techStack.create).mockResolvedValue({} as any)

    await syncProjectTechToStack(['React', 'NewTech999'])

    expect(prisma.techStack.create).toHaveBeenCalledTimes(1)
    expect(prisma.techStack.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'NewTech999' }),
      })
    )
  })

  it('skips React (already exists) and only creates NewTech999', async () => {
    vi.mocked(prisma.techStack.findMany).mockResolvedValue([
      { name: 'React', rowNumber: 1, displayOrder: 5 },
    ] as any)
    vi.mocked(prisma.techStack.create).mockResolvedValue({} as any)

    await syncProjectTechToStack(['React', 'NewTech999'])

    expect(prisma.techStack.create).toHaveBeenCalledTimes(1)
    const callArg = vi.mocked(prisma.techStack.create).mock.calls[0][0]
    expect(callArg.data.name).toBe('NewTech999')
  })

  it('existing name match is case-insensitive — "react" matches "React" entry', async () => {
    vi.mocked(prisma.techStack.findMany).mockResolvedValue([
      { name: 'React', rowNumber: 1, displayOrder: 1 },
    ] as any)

    await syncProjectTechToStack(['react'])

    expect(prisma.techStack.create).not.toHaveBeenCalled()
  })

  it('assigns rowNumber=1 when row1Count <= row2Count', async () => {
    // row1: 1 item, row2: 2 items → row1Count(1) <= row2Count(2) → new item goes to row1
    vi.mocked(prisma.techStack.findMany).mockResolvedValue([
      { name: 'A', rowNumber: 1, displayOrder: 1 },
      { name: 'B', rowNumber: 2, displayOrder: 1 },
      { name: 'C', rowNumber: 2, displayOrder: 2 },
    ] as any)
    vi.mocked(prisma.techStack.create).mockResolvedValue({} as any)

    await syncProjectTechToStack(['NewTech'])

    const callArg = vi.mocked(prisma.techStack.create).mock.calls[0][0]
    expect(callArg.data.rowNumber).toBe(1)
  })

  it('assigns rowNumber=2 when row1Count > row2Count', async () => {
    // row1: 3 items, row2: 1 item → row1Count(3) > row2Count(1) → new item goes to row2
    vi.mocked(prisma.techStack.findMany).mockResolvedValue([
      { name: 'A', rowNumber: 1, displayOrder: 1 },
      { name: 'B', rowNumber: 1, displayOrder: 2 },
      { name: 'C', rowNumber: 1, displayOrder: 3 },
      { name: 'D', rowNumber: 2, displayOrder: 1 },
    ] as any)
    vi.mocked(prisma.techStack.create).mockResolvedValue({} as any)

    await syncProjectTechToStack(['NewTech'])

    const callArg = vi.mocked(prisma.techStack.create).mock.calls[0][0]
    expect(callArg.data.rowNumber).toBe(2)
  })

  it('calls revalidatePath("/") after creating new entries', async () => {
    vi.mocked(prisma.techStack.findMany).mockResolvedValue([] as any)
    vi.mocked(prisma.techStack.create).mockResolvedValue({} as any)

    await syncProjectTechToStack(['BrandNew'])

    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('does not call revalidatePath when no new entries are created', async () => {
    vi.mocked(prisma.techStack.findMany).mockResolvedValue([
      { name: 'React', rowNumber: 1, displayOrder: 1 },
    ] as any)

    await syncProjectTechToStack(['React'])

    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
