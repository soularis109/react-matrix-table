import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'

declare global {
  interface Window {
    __SKIP_SKELETON__?: boolean
  }
}

beforeEach(() => {
  window.localStorage.clear()
  window.__SKIP_SKELETON__ = true
})
