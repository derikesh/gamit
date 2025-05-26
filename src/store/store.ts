import {create} from 'zustand'

interface User {
    id: number;
    username: string;
    email: string | null;
    avatar: number;
    score?: {
        id: number;
        score: number;
        userId: number;
        gameId: number;
        createdAt: Date;
    }[];
}

interface USER_STORE_INTERFACE {
    activeUser: User | null;
    setUser: (user: User) => void;
    removeUser: () => void;
}

export const gameitStore = create<USER_STORE_INTERFACE>((set) => ({
    activeUser: null,
    setUser: (user) => set({
        activeUser: user
    }),
    removeUser: () => set({
        activeUser: null
    })
}));