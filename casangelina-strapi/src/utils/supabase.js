const { createClient } = require("@supabase/supabase-js");

let supabaseInstance = null;

function getSupabaseClient() {
    if (!supabaseInstance) {
        supabaseInstance = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
    }
    return supabaseInstance;
}

module.exports = { getSupabaseClient };