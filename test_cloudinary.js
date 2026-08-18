import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
    cloud_name: 'sanskrutik', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function testUpload() {
    try {
        console.log("Testing upload...");
        const result = await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", {
            folder: 'garba_receipts',
        });
        console.log("Upload success:", result.secure_url);
    } catch (e) {
        console.error("Upload failed:", e);
    }
}

testUpload();
