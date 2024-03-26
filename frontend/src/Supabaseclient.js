// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLIC_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


export default supabase;
