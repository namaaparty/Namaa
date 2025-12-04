import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gavnfdnutmczdtcemzhj.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhdm5mZG51dG1jemR0Y2VtemhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODQ2MDEsImV4cCI6MjA3OTc2MDYwMX0.rfQq6oQByFEDJ7xQw7UAm7z2hcV8b4ixx87cAB9908E"
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing!")
    throw new Error("Supabase configuration is required")
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
