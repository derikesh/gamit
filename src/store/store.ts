import {create} from 'zustand'

export interface USERDATA_INTERFACE {
    id: number;
    username: string;
    email?: string | null;
    avatar: number;
    score?:any
}

interface USER_STORE_INTERFACE {
    activeUser: USERDATA_INTERFACE | null;
    setUser: (user: USERDATA_INTERFACE) => void;
    removeUser: () => void;
    tempCredentials: { username: string; password: string } | null;
    setTempCredentials: (creds: { username: string; password: string } | null) => void;
}

export const gameitStore = create<USER_STORE_INTERFACE>((set) => ({
    activeUser: null,
    setUser: (user) => set({
        activeUser: user
    }),
    removeUser: () => set({
        activeUser: null
    }),
    tempCredentials: null,
    setTempCredentials: (creds) => set({
        tempCredentials: creds
    })
}));