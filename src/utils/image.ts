export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'limit' | 'fit' | 'thumb' | 'scale';
  quality?: 'auto' | number | string;
  format?: 'auto' | string;
  gravity?: 'auto' | 'center' | string;
}

const urlCache = new Map<string, string>();

/**
 * Transforma URLs de Cloudinary aplicando tamaño optimizado,
 * recorte y formatos modernos (WebP/AVIF).
 * Utiliza caché en memoria O(1) para garantizar ejecución instantánea sin sobrecarga de CPU.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options?: ImageTransformOptions
): string {
  if (!url || typeof url !== 'string') return url || '';
  if (!url.includes('res.cloudinary.com')) return url;

  const w = options?.width || 0;
  const h = options?.height || 0;
  const c = options?.crop || '';
  const cacheKey = `${url}|${w}|${h}|${c}`;
  const cached = urlCache.get(cacheKey);
  if (cached) return cached;

  const transforms: string[] = [];
  transforms.push(`f_${options?.format || 'auto'}`);
  transforms.push(`q_${options?.quality || 'auto'}`);

  if (w) transforms.push(`w_${w}`);
  if (h) transforms.push(`h_${h}`);
  if (c) transforms.push(`c_${c}`);
  if (options?.gravity) transforms.push(`g_${options.gravity}`);

  const transformStr = transforms.join(',');

  const result = url.replace(
    /\/image\/upload\/(?:[a-zA-Z0-9_,:]+\/)?(v\d+\/.*|[a-zA-Z0-9_]+.*)/,
    `/image/upload/${transformStr}/$1`
  );

  urlCache.set(cacheKey, result);
  return result;
}
