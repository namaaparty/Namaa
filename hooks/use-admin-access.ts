"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type UserRole = "admin" | "news_statements" | "activities"

interface AdminAccessState {
  loading: boolean
  authorized: boolean
  role: UserRole | null
  userId: string | null
}

const supabase = createClient()

export function useAdminAccess(allowedRoles: UserRole[]) {
  const allowedRolesKey = useMemo(() => [...allowedRoles].sort().join("|"), [allowedRoles])
  const allowedRolesRef = useRef(allowedRoles)

  useEffect(() => {
    allowedRolesRef.current = allowedRoles
  }, [allowedRolesKey, allowedRoles])

  const [state, setState] = useState<AdminAccessState>({
    loading: true,
    authorized: false,
    role: null,
    userId: null,
  })

  const fetchSession = useCallback(async () => {
    setState((prev) => (prev.loading ? prev : { ...prev, loading: true }))
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      setState({ loading: false, authorized: false, role: null, userId: null })
      return
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle()

    if (error) {
      console.error("[auth] Failed to load user role:", error.message)
      setState({ loading: false, authorized: false, role: null, userId: session.user.id })
      return
    }

    const role = profile?.role as UserRole | null
    setState({
      loading: false,
      role,
      userId: session.user.id,
      authorized: Boolean(role && allowedRolesRef.current.includes(role)),
    })
  }, [allowedRolesKey])

  useEffect(() => {
    fetchSession()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchSession()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchSession])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setState({ loading: false, authorized: false, role: null, userId: null })
  }, [])

  return useMemo(
    () => ({
      ...state,
      signOut,
    }),
    [signOut, state],
  )
}

