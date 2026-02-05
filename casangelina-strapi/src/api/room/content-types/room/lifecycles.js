const { syncAssetToSupabase } = require("./../../../../utils/syncAsset.js");

module.exports = {
    async afterCreate(event) {
        const { result } = event;

        if (!result.media) return;

        for (const file of result.media) {
            await syncAssetToSupabase(file, file.mime.startsWith("video") ? "video" : "image");
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        if (!result.media) return;

        for (const file of result.media) {
            await syncAssetToSupabase(file, file.mime.startsWith("video") ? "video" : "image");
        }
    },
};