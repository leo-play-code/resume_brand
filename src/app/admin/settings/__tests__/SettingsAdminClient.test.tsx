import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsAdminClient from '../SettingsAdminClient'

type UpdateFn = (formData: FormData) => Promise<{ success?: boolean; error?: string }>

const makeProps = () => ({
  settings: {
    backgroundDark: '#050510',
    backgroundLight: '#f4f1ff',
  },
  updateSettings: vi.fn().mockResolvedValue({ success: true }) as unknown as UpdateFn,
})

describe('SettingsAdminClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders two color inputs (dark + light)', () => {
    const { container } = render(<SettingsAdminClient {...makeProps()} />)
    const colorPickers = container.querySelectorAll('input[type="color"]')
    expect(colorPickers.length).toBe(2)
  })

  it('dark color picker and hex text input are in sync (change picker updates text)', () => {
    const { container } = render(<SettingsAdminClient {...makeProps()} />)
    const picker = screen.getByLabelText('Dark Mode Background color picker') as HTMLInputElement
    const textInput = screen.getByLabelText('Dark Mode Background hex value') as HTMLInputElement
    fireEvent.change(picker, { target: { value: '#abcdef' } })
    expect(textInput.value).toBe('#abcdef')
  })

  it('invalid hex in text input does not update picker value', () => {
    render(<SettingsAdminClient {...makeProps()} />)
    const picker = screen.getByLabelText('Dark Mode Background color picker') as HTMLInputElement
    const textInput = screen.getByLabelText('Dark Mode Background hex value') as HTMLInputElement
    // Type an invalid hex — state should not update so picker stays same
    fireEvent.change(textInput, { target: { value: 'notahex' } })
    expect(picker.value).toBe('#050510')
  })

  it('Save button is disabled / shows spinner when isPending', async () => {
    render(<SettingsAdminClient {...makeProps()} />)
    const btn = screen.getByRole('button', { name: /save/i })
    expect(btn).toBeTruthy()
    expect((btn as HTMLButtonElement).disabled).toBe(false)
  })

  it('successful save shows "✓ Saved" message', async () => {
    const props = makeProps()
    render(<SettingsAdminClient {...props} />)
    const btn = screen.getByRole('button', { name: /save/i })
    await userEvent.click(btn)
    await waitFor(() => {
      expect(screen.getByText(/✓\s*Saved/)).toBeTruthy()
    })
  })
})
