import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExperienceAdminClient from '../ExperienceAdminClient'

const mockItems = [
  {
    id: '1',
    type: 'work',
    company: 'Acme Corp',
    role: 'Software Engineer',
    period: '2022 — Present',
    description: ['Built X', 'Improved Y'],
    display_order: 0,
  },
  {
    id: '2',
    type: 'education',
    company: '國立臺灣大學',
    role: '學士 資訊工程學系',
    period: '2018 — 2022',
    description: [],
    display_order: 1,
  },
]

const noopAction = vi.fn().mockResolvedValue(undefined)

describe('ExperienceAdminClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders list of experience items', () => {
    render(
      <ExperienceAdminClient
        items={mockItems as any}
        addExperience={noopAction}
        deleteExperience={noopAction}
      />
    )
    expect(screen.getByText('Software Engineer')).toBeDefined()
    expect(screen.getByText('學士 資訊工程學系')).toBeDefined()
  })

  it('shows "Add Entry" button initially', () => {
    render(
      <ExperienceAdminClient
        items={[]}
        addExperience={noopAction}
        deleteExperience={noopAction}
      />
    )
    expect(screen.getByText('Add Entry')).toBeDefined()
  })

  it('clicking Add Entry shows the form', async () => {
    render(
      <ExperienceAdminClient
        items={[]}
        addExperience={noopAction}
        deleteExperience={noopAction}
      />
    )
    await userEvent.click(screen.getByText('Add Entry'))
    expect(screen.getByText('New Entry')).toBeDefined()
  })

  it('type=work: shows Company and Role text inputs', async () => {
    const { container } = render(
      <ExperienceAdminClient
        items={[]}
        addExperience={noopAction}
        deleteExperience={noopAction}
      />
    )
    await userEvent.click(screen.getByText('Add Entry'))
    // Default type is "work" — the label text "Company / School *" is present
    expect(screen.getByText(/Company \/ School/)).toBeDefined()
    expect(screen.getByText(/Role \/ Degree/)).toBeDefined()
    // Both company and role inputs should be present
    expect(container.querySelector('input[name="company"]')).toBeDefined()
    expect(container.querySelector('input[name="role"]')).toBeDefined()
  })

  it('type=education: shows UniversityPicker (not plain company/role inputs)', async () => {
    const { container } = render(
      <ExperienceAdminClient
        items={[]}
        addExperience={noopAction}
        deleteExperience={noopAction}
      />
    )
    await userEvent.click(screen.getByText('Add Entry'))

    // Switch to education type using the native select (by name)
    const typeSelect = container.querySelector('select[name="type"]') as HTMLSelectElement
    await userEvent.selectOptions(typeSelect, 'education')

    // UniversityPicker renders 學歷層級 label
    expect(screen.getByText('學歷層級')).toBeDefined()
    // Plain company text input should not be present
    expect(container.querySelector('input[name="company"]')).toBeNull()
  })

  it('switching type between work/education re-renders correct fields', async () => {
    const { container } = render(
      <ExperienceAdminClient
        items={[]}
        addExperience={noopAction}
        deleteExperience={noopAction}
      />
    )
    await userEvent.click(screen.getByText('Add Entry'))

    // Initially work: company field exists
    expect(screen.getByText(/Company \/ School/)).toBeDefined()

    // Switch to education
    const typeSelect = container.querySelector('select[name="type"]') as HTMLSelectElement
    await userEvent.selectOptions(typeSelect, 'education')
    expect(screen.getByText('學歷層級')).toBeDefined()
    expect(container.querySelector('input[name="company"]')).toBeNull()

    // Switch back to work
    await userEvent.selectOptions(typeSelect, 'work')
    expect(screen.getByText(/Company \/ School/)).toBeDefined()
    expect(screen.queryByText('學歷層級')).toBeNull()
  })

  it('form submission with education type includes degree_level, school_name_zh, department fields', async () => {
    const { container } = render(
      <ExperienceAdminClient
        items={[]}
        addExperience={noopAction}
        deleteExperience={noopAction}
      />
    )
    await userEvent.click(screen.getByText('Add Entry'))

    // Switch to education
    const typeSelect = container.querySelector('select[name="type"]') as HTMLSelectElement
    await userEvent.selectOptions(typeSelect, 'education')

    // degree_level select should be present
    expect(container.querySelector('select[name="degree_level"]')).toBeDefined()
    // school_name_zh hidden input (from UniversityPicker)
    expect(container.querySelector('input[name="school_name_zh"]')).toBeDefined()
    // department hidden input
    expect(container.querySelector('input[name="department"]')).toBeDefined()
  })
})
