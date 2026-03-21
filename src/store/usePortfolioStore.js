import { create } from 'zustand'
import { sectionPresets } from '../config/sectionPresets'

const usePortfolioStore = create((set) => ({
    activeSection: 'hero',
    mousePosition: [0, 0],
    targetPreset: sectionPresets.hero,
    isTransitioning: false,
    scrollProgress: 0,

    setSection: (name) => set({
        activeSection: name,
        targetPreset: sectionPresets[name] || sectionPresets.hero,
        isTransitioning: true,
    }),

    setMouse: (x, y) => set({ mousePosition: [x, y] }),

    setScrollProgress: (p) => set({ scrollProgress: p }),

    finishTransition: () => set({ isTransitioning: false }),
}))

export default usePortfolioStore
