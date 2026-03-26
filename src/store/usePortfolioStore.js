import { create } from 'zustand'
import { sectionPresets } from '../config/sectionPresets'

const usePortfolioStore = create((set) => ({
    activeSection: 'hero',
    mousePosition: [0, 0],
    targetPreset: sectionPresets.hero,
    isTransitioning: false,
    
    // New mechanics
    theme: 'dark',
    energy: 100,

    setSection: (name) => set((state) => ({
        activeSection: name,
        targetPreset: sectionPresets[name] || sectionPresets.hero,
        isTransitioning: true,
        // Deduct energy on manual navigation (e.g. 10 energy), clamp to 0
        energy: Math.max(0, state.energy - 10)
    })),

    setMouse: (x, y) => set({ mousePosition: [x, y] }),
    
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    
    // Recharge energy
    addEnergy: (amount) => set((state) => ({ energy: Math.min(100, state.energy + amount) })),

    finishTransition: () => set({ isTransitioning: false }),
}))

export default usePortfolioStore
