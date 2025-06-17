import { create } from 'zustand'

interface GameState {
  wpm: number
  restart:boolean
  setRestart:()=>void
  setWpm: (wpm: number) => void
  incrementWpm: () => void
  decrementWpm: () => void
  resetWpm: () => void
}

export const useGameStore = create<GameState>((set) => ({
  wpm: 0,
  restart:false,
  setRestart : ()=>set((state)=>({restart:!state.restart})),
  setWpm: (wpm) => set({ wpm }),
  incrementWpm: () => set((state) => ({ wpm: state.wpm + 1 })),
  decrementWpm: () => set((state) => ({ wpm: state.wpm > 0 ? state.wpm - 1 : 0 })),
  resetWpm: () => set({ wpm: 0 })
})) 