import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchBar from '../SearchBar'

// Mock fetch
global.fetch = vi.fn()

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input', () => {
    render(<SearchBar />)
    expect(screen.getByPlaceholderText(/search roles, personnel, departments/i)).toBeInTheDocument()
  })

  it('shows clear button when query is entered', async () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText(/search roles, personnel, departments/i)
    
    fireEvent.change(input, { target: { value: 'test query' } })
    
    await waitFor(() => {
      expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument()
    })
  })

  it('clears search when clear button is clicked', async () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText(/search roles, personnel, departments/i)
    
    fireEvent.change(input, { target: { value: 'test query' } })
    
    await waitFor(() => {
      const clearButton = screen.getByLabelText(/clear search/i)
      fireEvent.click(clearButton)
    })
    
    expect(input).toHaveValue('')
  })

  it('performs search with debouncing', async () => {
    const mockResponse = {
      roles: [
        {
          id: 1,
          title: 'Test Role',
          description: 'Test Description',
          department_name: 'Test Department',
          organization: 'ULB',
          is_leadership: true
        }
      ],
      personnel: [],
      total: 1
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    render(<SearchBar />)
    const input = screen.getByPlaceholderText(/search roles, personnel, departments/i)
    
    fireEvent.change(input, { target: { value: 'test' } })
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/search?query=test')
    }, { timeout: 1000 })
  })

  it('displays search results', async () => {
    const mockResponse = {
      roles: [
        {
          id: 1,
          title: 'Test Role',
          description: 'Test Description',
          department_name: 'Test Department',
          organization: 'ULB',
          is_leadership: true
        }
      ],
      personnel: [
        {
          id: 1,
          name: 'John Doe',
          role_title: 'Manager',
          department_name: 'Test Department',
          organization: 'MCG',
          contact: '123-456-7890',
          email: 'john@example.com',
          is_elected: false
        }
      ],
      total: 2
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    render(<SearchBar />)
    const input = screen.getByPlaceholderText(/search roles, personnel, departments/i)
    
    fireEvent.change(input, { target: { value: 'test' } })
    
    await waitFor(() => {
      expect(screen.getByText('Test Role')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('2 found')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('shows no results message when search returns empty', async () => {
    const mockResponse = {
      roles: [],
      personnel: [],
      total: 0
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    render(<SearchBar />)
    const input = screen.getByPlaceholderText(/search roles, personnel, departments/i)
    
    fireEvent.change(input, { target: { value: 'nonexistent' } })
    
    await waitFor(() => {
      expect(screen.getByText(/no results found for "nonexistent"/i)).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})
