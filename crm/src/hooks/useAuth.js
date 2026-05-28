import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()

    // Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchUserRole(session.user.id, session.user.email)
        } else {
          setUser(null)
          setUserRole(null)
        }
        setLoading(false)
      }
    )

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  async function checkUser() {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (sessionData?.session?.user) {
        setUser(sessionData.session.user)
        await fetchUserRole(sessionData.session.user.id, sessionData.session.user.email)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserRole(userId, email) {
    try {
      let { data, error } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user role by id:', error)
      }

      if (!data && email) {
        const fallback = await supabase
          .from('usuarios')
          .select('rol')
          .eq('correo', email)
          .maybeSingle()

        data = fallback.data
        error = fallback.error

        if (error) {
          console.error('Error fetching user role by email fallback:', error)
        }
      }

      setUserRole(data?.rol || null)
    } catch (error) {
      console.error('Unexpected error fetching user role:', error)
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
    setUserRole(null)
  }

  return {
    user,
    userRole,
    loading,
    isAuthenticated: !!user,
    isAdmin: userRole === 'administrador',
    isComercial: userRole === 'comercial',
    logout,
  }
}
