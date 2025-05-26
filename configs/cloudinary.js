import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: 'dsr0s5lbq',
    api_key: '178877929332931',
    api_secret: '143eWrgGnYGH1uW864cq5o2wEYg'
});





export const uploadImg = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'avatars' },
            (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
            }
        );

        stream.end(buffer);
    });
};

