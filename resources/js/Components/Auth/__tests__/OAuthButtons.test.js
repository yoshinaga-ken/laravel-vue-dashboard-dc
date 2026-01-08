import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OAuthButtons from '../OAuthButtons.vue'

// route ヘルパーのモック
const mockRoute = vi.fn((name, params) => {
  if (name === 'oauth.redirect') {
    return `/oauth/redirect/${params.provider}`
  }
  return '/'
})

describe('OAuthButtons', () => {
  describe('Rendering', () => {
    it('renders oauth buttons for default providers', () => {
      const wrapper = mount(OAuthButtons, {
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      expect(wrapper.find('.oauth-buttons').exists()).toBe(true)
      expect(wrapper.findAll('a')).toHaveLength(2)
    })

    it('renders google button with correct text', () => {
      const wrapper = mount(OAuthButtons, {
        props: {
          providers: ['google'],
        },
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const googleButton = wrapper.find('a')
      expect(googleButton.text()).toContain('Googleでログイン')
      expect(googleButton.attributes('href')).toBe('/oauth/redirect/google')
    })

    it('renders github button with correct text', () => {
      const wrapper = mount(OAuthButtons, {
        props: {
          providers: ['github'],
        },
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const githubButton = wrapper.find('a')
      expect(githubButton.text()).toContain('GitHubでログイン')
      expect(githubButton.attributes('href')).toBe('/oauth/redirect/github')
    })

    it('renders multiple providers', () => {
      const wrapper = mount(OAuthButtons, {
        props: {
          providers: ['google', 'github'],
        },
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const buttons = wrapper.findAll('a')
      expect(buttons).toHaveLength(2)
      expect(buttons[0].text()).toContain('Googleでログイン')
      expect(buttons[1].text()).toContain('GitHubでログイン')
    })

    it('filters out invalid providers', () => {
      const wrapper = mount(OAuthButtons, {
        props: {
          providers: ['google', 'facebook', 'github', 'twitter'],
        },
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const buttons = wrapper.findAll('a')
      expect(buttons).toHaveLength(2) // google and github only
    })

    it('renders separator with correct text', () => {
      const wrapper = mount(OAuthButtons, {
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const separator = wrapper.find('.relative span')
      expect(separator.text()).toBe('または')
    })
  })

  describe('Behavior', () => {
    it('has correct href for oauth redirect', () => {
      const wrapper = mount(OAuthButtons, {
        props: {
          providers: ['google'],
        },
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const link = wrapper.find('a')
      expect(link.attributes('href')).toBe('/oauth/redirect/google')
    })

    it('uses route helper for generating urls', () => {
      const wrapper = mount(OAuthButtons, {
        props: {
          providers: ['github'],
        },
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      expect(mockRoute).toHaveBeenCalledWith('oauth.redirect', { provider: 'github' })
    })
  })

  describe('Styling', () => {
    it('applies correct css classes for buttons', () => {
      const wrapper = mount(OAuthButtons, {
        props: {
          providers: ['google'],
        },
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const button = wrapper.find('a')
      expect(button.classes()).toContain('w-full')
      expect(button.classes()).toContain('flex')
      expect(button.classes()).toContain('items-center')
    })

    it('renders with responsive design classes', () => {
      const wrapper = mount(OAuthButtons, {
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const container = wrapper.find('.space-y-3')
      expect(container.exists()).toBe(true)
    })
  })

  describe('Props Validation', () => {
    it('uses default providers when none provided', () => {
      const wrapper = mount(OAuthButtons, {
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const buttons = wrapper.findAll('a')
      expect(buttons).toHaveLength(2) // google and github by default
    })

    it('accepts custom providers array', () => {
      const wrapper = mount(OAuthButtons, {
        props: {
          providers: ['github'],
        },
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const buttons = wrapper.findAll('a')
      expect(buttons).toHaveLength(1)
      expect(buttons[0].text()).toContain('GitHubでログイン')
    })

    it('handles empty providers array', () => {
      const wrapper = mount(OAuthButtons, {
        props: {
          providers: [],
        },
        global: {
          mocks: {
            route: mockRoute,
          },
        },
      })

      const buttons = wrapper.findAll('a')
      expect(buttons).toHaveLength(0)
    })
  })
})
