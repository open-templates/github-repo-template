import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router'

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ error: any }>
    signUp: (email: string, password: string) => Promise<{ error: any }>
    resetPassword: (email: string) => Promise<{ error: any }>
    updatePassword: (password: string) => Promise<{ error: any }>
    signOut: () => Promise<void>
    loginWithGoogle: () => Promise<{ error: any }>
    refreshToken: () => Promise<{ data: any, error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    
    useEffect(() => {
        let isInitialized = false

        // Listen for auth changes - onAuthStateChange fires immediately with current session
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state changed:', _event, 'has session:', !!session);
            
            // Only set loading to false after first auth state check
            if (!isInitialized) {
                isInitialized = true
                setLoading(false)
            }

            if (session) {
                setUser(session.user)
                setSession(session)
                localStorage.setItem('x-auth-token', session.access_token)
            } else {
                setUser(null)
                setSession(null)
                localStorage.removeItem('x-auth-token')
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { error }
    }, [])

    const signUp = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })
        
        return { error }
    }, [])

    const resetPassword = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })
        return { error }
    }, [])

    const updatePassword = useCallback(async (password: string) => {
        const { error } = await supabase.auth.updateUser({
            password: password
        })
        return { error }
    }, [])

    const loginWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`
            }
        })
        return { error }
    }, [])

    const signOut = useCallback(async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }, [navigate])

    const refreshToken = useCallback(async () => {
        const { data, error } = await supabase.auth.refreshSession()
        if (data.session) {
            localStorage.setItem('x-auth-token', data.session.access_token)
        }
        return { data, error }
    }, [])

    const value = useMemo(() => ({
        user,
        session,
        loading,
        signIn,
        signUp,
        resetPassword,
        updatePassword,
        signOut,
        loginWithGoogle,
        refreshToken
    }), [user, session, loading, signIn, signUp, resetPassword, updatePassword, signOut, loginWithGoogle, refreshToken])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}