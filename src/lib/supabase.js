import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'มีค่า' : 'ไม่มีค่า')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('กรุณาตั้งค่า Supabase URL และ Anon Key ใน .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

