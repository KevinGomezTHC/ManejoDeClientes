import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tiitxwtqexejjkjzxeuw.supabase.co'
const supabaseKey = 'sb_publishable_wPwiZzWbBdR6Ngbh7mYv0A_EMtapf72'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)