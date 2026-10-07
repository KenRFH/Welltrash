/**
 * Compress an image file on the client side before upload.
 * Reduces raw camera / mobile captures (3MB - 10MB) to ~150KB - 300KB
 * in tens of milliseconds, drastically improving upload speed.
 */
export async function compressImage(
    file: File,
    maxWidth: number = 1280,
    maxHeight: number = 1280,
    quality: number = 0.78
): Promise<File> {
    // Only compress image types
    if (!file.type.startsWith('image/')) {
        return file;
    }

    // If file is already smaller than 300KB and not a huge raw format, return directly
    if (file.size < 300 * 1024 && file.type === 'image/jpeg') {
        return file;
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (readerEvent) => {
            const img = new Image();
            img.src = readerEvent.target?.result as string;

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Scale down while preserving aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        maxHeight = height;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(file);
                    return;
                }

                // Render image to canvas
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob || blob.size >= file.size) {
                            // If compression somehow didn't reduce size, keep original
                            resolve(file);
                            return;
                        }

                        // Create a new File with the original filename (or jpg extension)
                        const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
                        const compressedFile = new File([blob], newFileName, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });

                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => {
                resolve(file);
            };
        };

        reader.onerror = () => {
            resolve(file);
        };
    });
}
