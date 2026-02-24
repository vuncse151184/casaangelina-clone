// Function to generate preview pathname based on content type
const getPreviewPathname = (uid, { document }) => {
  const { slug, documentId } = document;

  switch (uid) {
    case "api::blog.blog": {
      if (!slug) {
        // Fallback to documentId if no slug
        return `/blog/${documentId}`;
      }
      return `/blog/${slug}`;
    }
    default:
      return null;
  }
};

module.exports = ({ env }) => {
  const clientUrl = env('CLIENT_URL', 'http://localhost:3000');
  const previewSecret = env('PREVIEW_SECRET', 'preview-secret-key');

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    secrets: {
      encryptionKey: env('ENCRYPTION_KEY'),
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: clientUrl,
        async handler(uid, { documentId, locale, status }) {
          const document = await strapi.documents(uid).findOne({ documentId });

          const pathname = getPreviewPathname(uid, { document });

          if (!pathname) {
            return null;
          }

          const urlSearchParams = new URLSearchParams({
            url: pathname,
            secret: previewSecret,
            status: status,
          });

          return `${clientUrl}/api/preview?${urlSearchParams}`;
        },
      },
    },
  };
};
