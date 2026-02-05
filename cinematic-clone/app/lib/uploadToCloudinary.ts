import cloudinary from "./cloudinary";
import { v4 as uuidv4 } from "uuid";

type UploadFolder = "room" | "resort" | "user";

export async function uploadToCloudinary(
    file: Buffer,
    folder: UploadFolder
) {
    const publicId = uuidv4();

    return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
                    public_id: publicId,
                    resource_type: "image",
                    quality: "auto",
                    fetch_format: "auto",
                },
                (error, result) => {
                    if (error || !result) {
                        reject(error);
                        return;
                    }

                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
                }
            )
            .end(file);
    });
}