/**
 * ブレークポイント設定とレスポンシブ判定用のComposable
 */

import { useBreakpoints } from '@vueuse/core'

/**
 * ブレークポイント設定とモバイル判定
 * @returns ブレークポイントとモバイル判定のオブジェクト
 */
export const useBreakpointsConfig = () => {
  const breakpoints = useBreakpoints({
    mobile: 768, // md: Tailwind CSSのレスポンシブプレフィックス
    tablet: 1024, // lg:
    desktop: 1280, // xl:
  })

  const isMobile = breakpoints.smaller('mobile')
  const isTablet = breakpoints.between('mobile', 'tablet')
  const isDesktop = breakpoints.greater('tablet')

  return {
    breakpoints,
    isMobile,
    isTablet,
    isDesktop,
  }
}
