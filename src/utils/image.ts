export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'limit' | 'fit' | 'thumb' | 'scale';
  quality?: 'auto' | number | string;
  format?: 'auto' | string;
  gravity?: 'auto' | 'center' | string;
}

/**
 * Transforma dinámicamente URLs de Cloudinary aplicando tamaño optimizado,
 * recorte y formatos modernos (WebP/AVIF), manteniendo intactas las URLs ajenas.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options?: ImageTransformOptions
): string {
  if (!url || typeof url !== 'string') return url || '';
  if (!url.includes('res.cloudinary.com')) return url;

  const transforms: string[] = [];
  transforms.push(`f_${options?.format || 'auto'}`);
  transforms.push(`q_${options?.quality || 'auto'}`);

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  if (options?.gravity) transforms.push(`g_${options.gravity}`);

  const transformStr = transforms.join(',');

  // Sustituye transformaciones existentes tras /image/upload/ o las inserta antes de la versión/id
  return url.replace(
    /\/image\/upload\/(?:[a-zA-Z0-9_,:]+\/)?(v\d+\/.*|[a-zA-Z0-9_]+.*)/,
    `/image/upload/${transformStr}/$1`
  );
}
