import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// This client is strictly for client-side public queries or file storage,
// as Prisma handles all the database interactions on the server.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
