/**
 * Compress an image file on the client side before upload.
 * Defaults (1920px, q0.85) keep public-site content sharp; evidence photos pass smaller values.
 * Non-images, GIF (animation) and SVG (vector) are returned untouched.
 * Transparent PNG/WebP stay PNG so logos keep their alpha; everything else becomes JPEG.
 */
export async function compressImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920,
    quality: number = 0.85
): Promise<File> {
    if (!file.type.startsWith('image/') || /gif|svg/.test(file.type)) {
        return file;
    }

    // Already small enough: re-encoding would only lose quality
    if (file.size < 300 * 1024) {
        return file;
    }

    const url = URL.createObjectURL(file);
    try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = reject;
            el.src = url;
        });

        const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return file;

        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let keepAlpha = false;
        if (file.type === 'image/png' || file.type === 'image/webp') {
            const data = ctx.getImageData(0, 0, width, height).data;
            for (let i = 3; i < data.length; i += 4) {
                if (data[i] < 255) { keepAlpha = true; break; }
            }
        }

        const type = keepAlpha ? 'image/png' : 'image/jpeg';
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

        // Compression didn't help: keep original
        if (!blob || blob.size >= file.size) return file;

        const name = file.name.replace(/\.[^/.]+$/, '') + (keepAlpha ? '.png' : '.jpg');
        return new File([blob], name, { type, lastModified: Date.now() });
    } catch {
        return file;
    } finally {
        URL.revokeObjectURL(url);
    }
}
