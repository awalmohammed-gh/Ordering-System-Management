import cloudinary from "../config/cluodinary.js";

export const uploadToCloudinary = async (filePath: string): Promise<string> => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "ODM-System",
  });

  return result.secure_url;
};
