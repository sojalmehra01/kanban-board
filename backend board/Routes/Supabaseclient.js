// supabaseClient.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.Supa_api_key 
const supabaseKey = process.env.Supa_anon_key
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;
