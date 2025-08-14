import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TeamCard from '../TeamCard.vue'
import type { Team } from '@/Types/types-team'

// Inertia.js のモック（VfTextTagsInput.test.jsパターン）
vi.mock('@inertiajs/vue3', () => ({
  router: {
    put: vi.fn(),
    visit: vi.fn(),
  },
}))

// Ziggy route のモック
vi.mock('../../../../../vendor/tightenco/ziggy', () => ({
  route: vi.fn((name: string, params?: any) => {
    const routes: Record<string, string> = {
      'teams.show': `/teams/${params}`,
      'current-team.update': '/current-team',
    }
    return routes[name] || `/${name}`
  }),
}))

// テスト用モックデータ
const createMockTeam = (overrides: Partial<Team> = {}): Team => ({
  id: 1,
  name: 'テストチーム',
  personal_team: false,
  profile_photo_url: undefined,
  owner: {
    id: 1,
    name: 'テストオーナー',
    email: 'owner@example.com',
    profile_photo_url: 'https://example.com/avatar1.jpg',
    current_team_id: 1,
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
    is_followed_by: false,
    followers: [],
    following: [],
  },
  members_count: 3,
  pending_invitations_count: 1,
  projects_count: 2,
  is_active: true,
  recent_members: [],
  recent_invitations: [],
  created_at: '2024-01-01T00:00:00.000000Z',
  updated_at: '2024-01-01T00:00:00.000000Z',
  ...overrides,
})

describe('TeamCard.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (teamData: Partial<Team> = {}, currentTeamId = 2) => {
    const team = createMockTeam(teamData)
    return mount(TeamCard, {
      props: {
        team,
        currentTeamId,
      },
      global: {
        stubs: {
          ElAvatar: true,
          ElTag: true,
          ElButton: true,
          ElIcon: true,
          ElDropdown: true,
          ElDropdownMenu: true,
          ElDropdownItem: true,
          Check: true,
          User: true,
          More: true,
          Switch: true,
          Setting: true,
          ArrowRight: true,
          Close: true,
        },
      },
    })
  }

  it('コンポーネントが正常にマウントされる', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('チーム名が表示される', () => {
    const wrapper = createWrapper({ name: 'マイチーム' })
    expect(wrapper.text()).toContain('マイチーム')
  })

  it('data-testid 属性が設定されている', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="team-card-1"]').exists()).toBe(true)
  })

  it('現在のチームの場合、Currentタグが表示される', () => {
    const wrapper = createWrapper({}, 1) // currentTeamId = 1, team.id = 1
    const currentTag = wrapper.find('[data-testid="current-team-indicator-1"]')
    expect(currentTag.exists()).toBe(true)
  })

  it('個人チームの場合、Personalタグが表示される', () => {
    const wrapper = createWrapper({ personal_team: true })
    const personalTag = wrapper.find('[data-testid="personal-team-icon-1"]')
    expect(personalTag.exists()).toBe(true)
  })

  it('メンバー数が表示される', () => {
    const wrapper = createWrapper({ members_count: 5 })
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toMatch(/Members?/)
  })

  it('切り替えボタンが表示される（現在のチームでない場合）', () => {
    const wrapper = createWrapper({}, 2) // currentTeamId = 2, team.id = 1
    const switchButton = wrapper.find('[data-testid="switch-team-1"]')
    expect(switchButton.exists()).toBe(true)
  })

  it('現在のチームの場合、切り替えボタンが表示されない', () => {
    const wrapper = createWrapper({}, 1) // currentTeamId = 1, team.id = 1
    const switchButton = wrapper.find('[data-testid="switch-team-1"]')
    expect(switchButton.exists()).toBe(false)
  })

  it('設定ボタンが表示される', () => {
    const wrapper = createWrapper()
    const settingsButton = wrapper.find('[data-testid="view-team-1"]')
    expect(settingsButton.exists()).toBe(true)
  })

  it('formatDate ユーティリティ関数が動作する', () => {
    const wrapper = createWrapper()
    const vm = wrapper.vm as any

    const today = new Date().toISOString()
    expect(vm.formatDate(today)).toBe('Today')

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    expect(vm.formatDate(yesterday)).toBe('Yesterday')
  })
})
