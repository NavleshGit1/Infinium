import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary from buffer
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} fileName - Original file name
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Object>} - Upload result with URL
 */
export async function uploadImage(fileBuffer, fileName, folder = 'infinium/food-images') {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                public_id: `${Date.now()}-${fileName.split('.')[0]}`
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                        cloudinaryUrl: result.url,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                        bytes: result.bytes
                    });
                }
            }
        );
        
        // Create readable stream from buffer
        Readable.from([fileBuffer]).pipe(stream);
    });
}

/**
 * Get image URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed image URL
 */
export function getImageUrl(publicId, options = {}) {
    const defaults = {
        width: options.width || 800,
        height: options.height || 600,
        crop: options.crop || 'fill',
        quality: options.quality || 'auto'
    };
    
    return cloudinary.url(publicId, defaults);
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Deletion result
 */
export async function deleteImage(publicId) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
    }
}

/**
 * Generate thumbnail URL
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} - Thumbnail URL
 */
export function getThumbnailUrl(publicId) {
    return cloudinary.url(publicId, {
        width: 200,
        height: 200,
        crop: 'fill',
        quality: 'auto'
    });
}

/**
 * Upload image from URL (e.g., from ESP32)
 * @param {string} imageUrl - URL of image
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Object>} - Upload result
 */
export async function uploadFromUrl(imageUrl, folder = 'infinium/food-images') {
    try {
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: folder,
            resource_type: 'auto',
            public_id: `${Date.now()}-esp32`
        });
        
        return {
            url: result.secure_url,
            publicId: result.public_id,
            cloudinaryUrl: result.url,
            width: result.width,
            height: result.height
        };
    } catch (error) {
        throw new Error(`Failed to upload from URL: ${error.message}`);
    }
}
