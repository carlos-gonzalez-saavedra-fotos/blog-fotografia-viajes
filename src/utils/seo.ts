import { Viaje, GalleryItem } from '../types';

export const SITE_BASE_URL = 'https://carlos-gonzalez-saavedra.vercel.app';
export const SITE_AUTHOR_NAME = 'Carlos González Saavedra';
export const SITE_DEFAULT_IMAGE =
  'https://res.cloudinary.com/tsruit2h/image/upload/f_auto,q_auto,w_800,h_800,c_fill/v1789064350/cgs_portfolio/Carlos_Gonzalez_Saavedra.webp';

export function truncateMetaDescription(text: string | undefined, maxLength = 160): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced) + '…';
}

export function getGalleryItems(viaje: Partial<Viaje>): GalleryItem[] {
  const raw = viaje.galeria || viaje.galeriaTematica || [];
  return raw.map((item) =>
    typeof item === 'string'
      ? { url: item }
      : item
  );
}

export function isThematicGallery(viaje: Partial<Viaje>): boolean {
  return Boolean(viaje.galeriaTematica || (viaje.id && viaje.id.startsWith('Gale')));
}

export function buildReviewSeoData(viaje: Partial<Viaje>) {
  const id = viaje.id || '';
  const titulo = viaje.titulo || 'Crónica de viaje';
  const esTematica = isThematicGallery(viaje);
  const canonicalUrl = `${SITE_BASE_URL}/viaje/${id}`;
  const fullTitle = `${titulo} | ${SITE_AUTHOR_NAME}`;
  const rawDescription = viaje.resumen || viaje.reseña || '';
  const description =
    truncateMetaDescription(rawDescription, 160) ||
    `${titulo} — Fotografía y relatos de viaje por ${SITE_AUTHOR_NAME}.`;
  const heroImage = viaje.urlImagen || viaje.url || SITE_DEFAULT_IMAGE;
  const galleryItems = getGalleryItems(viaje);
  const wordCount = viaje.reseña
    ? viaje.reseña.trim().split(/\s+/).filter(Boolean).length
    : undefined;

  const mediaObjects = galleryItems.map((item) => {
    const loc = item.location || viaje.ubicacion;
    return {
      '@type': 'ImageObject',
      contentUrl: item.url,
      url: item.url,
      ...(item.caption ? { caption: item.caption, name: item.caption } : {}),
      ...(item.alt || item.caption ? { description: item.alt || item.caption } : {}),
      ...(loc
        ? {
            contentLocation: {
              '@type': 'Place',
              name: loc,
            },
          }
        : {}),
      author: {
        '@type': 'Person',
        name: SITE_AUTHOR_NAME,
      },
    };
  });

  const mainEntity: Record<string, unknown> = {
    '@type': esTematica ? 'ImageGallery' : ['BlogPosting', 'ImageGallery'],
    '@id': `${canonicalUrl}#article`,
    name: titulo,
    headline: titulo,
    description,
    url: canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    inLanguage: 'es',
    image: heroImage,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR_NAME,
      url: `${SITE_BASE_URL}/`,
    },
    publisher: {
      '@type': 'Person',
      name: SITE_AUTHOR_NAME,
      url: `${SITE_BASE_URL}/`,
    },
    ...(viaje.ubicacion
      ? {
          contentLocation: {
            '@type': 'Place',
            name: viaje.ubicacion,
          },
        }
      : {}),
    ...(viaje.categoria ? { articleSection: viaje.categoria } : {}),
    ...(wordCount ? { wordCount } : {}),
    ...(mediaObjects.length > 0 ? { associatedMedia: mediaObjects } : {}),
  };

  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: `${SITE_BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: esTematica ? 'Galería' : 'Viajes',
        item: `${SITE_BASE_URL}/#${esTematica ? 'galeria' : 'viajes'}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: titulo,
        item: canonicalUrl,
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [mainEntity, breadcrumbList],
  };

  return {
    fullTitle,
    description,
    canonicalUrl,
    heroImage,
    esTematica,
    jsonLd,
  };
}
