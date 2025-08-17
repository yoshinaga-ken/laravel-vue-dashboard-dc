import { route as ziggyRoute } from '../../../vendor/tightenco/ziggy'

export const useRoute = () => {
  const route = (name: string, params: Record<string, any> = {}) => {
    try {
      if (typeof ziggyRoute === 'function' && window.route) {
        return ziggyRoute(name, params)
      }

      // Storybook用のモック
      if (process.env.NODE_ENV === 'test' || window.location.href.includes('storybook')) {
        return `/mock/${name}/${Object.values(params).join('/')}`
      }

      return '#'
    } catch (error) {
      console.warn(`Route generation failed for ${name}:`, error)
      return '#'
    }
  }

  return { route }
}
