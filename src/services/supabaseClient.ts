import { createClient } from '@supabase/supabase-js';

// Masukkan Project URL dan anon/public API Key dari dashboard Supabase Anda
// (Bisa dilihat di Project Settings > API)
const SUPABASE_URL = 'https://pjrrpbkfpygfoqktezqp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_m5VDsy_l1L3aF8ADI8V39Q_vqep7o-u';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);