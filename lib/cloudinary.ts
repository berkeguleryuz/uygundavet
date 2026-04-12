import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export function getUserFolder(userId: string) {
  return `uygundavet/users/${userId}`;
}

export async function deleteUserFolder(userId: string) {
  const folder = getUserFolder(userId);
  try {
    await cloudinary.api.delete_resources_by_prefix(folder);
    await cloudinary.api.delete_folder(folder);
  } catch (error) {
    console.error(`Failed to delete Cloudinary folder ${folder}:`, error);
  }
}
