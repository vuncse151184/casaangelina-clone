module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      breakpoints: {
        large: 0,
        medium: 0,
        small: 0,
      },
      sizeLimit: 10 * 1024 * 1024, // 10MB
    },
  },
});
