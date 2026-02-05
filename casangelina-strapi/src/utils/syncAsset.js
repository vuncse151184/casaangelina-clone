const { getSupabaseClient } = require("./supabase.js");

async function syncAssetToSupabase(file, type) {
    const supabase = getSupabaseClient();
    await supabase.from("assets").upsert({
        url: file.url,
        type,
        alt: file.alternativeText || null,
    }, {
        onConflict: "url",
    });
}

module.exports = { syncAssetToSupabase };