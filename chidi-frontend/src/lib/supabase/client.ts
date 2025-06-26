import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './types'

// Create a singleton Supabase client for browser usage
export const supabase = createClientComponentClient<Database>()

// Export the client as default for convenience
export default supabase
