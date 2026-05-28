import { supabase } from '../supabase'

export async function getComerciales() {
  try {
    console.log('🔍 Fetching comerciales from Supabase...')
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .in('rol', ['comercial', 'supervisor'])

    console.log('📊 Supabase response:', { data, error })

    if (error) {
      console.error('❌ Error fetching comerciales:', error)
      return { data: [], error }
    }

    console.log('✅ Comerciales loaded:', data)
    return { data: data || [], error: null }
  } catch (err) {
    console.error('❌ Unexpected error fetching comerciales:', err)
    return { data: [], error: err }
  }
}
