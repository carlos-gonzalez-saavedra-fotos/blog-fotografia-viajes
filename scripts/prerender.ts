import fs from 'node:fs';
import path from 'node:path';
import { VIAJES_COMPLETOS, FOTOS_COMPLETAS } from '../src/data/viajesCompleto';
import { MIS_VIAJES, MIS_FOTOS } from '../src/data/mis_viajes';
import { getOptimizedImageUrl } from '../src/utils/image';
import {
  SITE_BASE_URL,
  SITE_AUTHOR_NAME,
  SITE_DEFAULT_IMAGE,
  buildReviewSeoData,
  getGalleryItems,
} from '../src/utils/seo';
import { Viaje, Photo } from '../src/types';

type PrerenderItem = Viaje | (Photo & Partial<Viaje>);

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function replaceBetweenMarkers(
  html: string,
  startMarker: string,
  endMarker: string,
  replacement: string
): string {
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`Markers ${startMarker} / ${endMarker} not found in dist/index.html`);
  }
  return (
    html.slice(0, startIdx) +
    startMarker +
    '\n' +
    replacement +
    '\n    ' +
    endMarker +
    html.slice(endIdx + endMarker.length)
  );
}

function removeBetweenMarkers(html: string, startMarker: string, endMarker: string): string {
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    return html;
  }
  return html.slice(0, startIdx) + html.slice(endIdx + endMarker.length);
}

function renderNavbarHtml(isHome: boolean): string {
  return `<nav class="fixed top-0 left-0 right-0 z-[120] transition-all duration-500 translate-y-0 py-8 bg-transparent px-6">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/">
            <div class="flex items-center gap-2 group">
              <div class="relative w-6 h-6 flex items-center justify-center">
                <span class="text-gold text-sm">${isHome ? '📷' : '←'}</span>
              </div>
              <div class="flex flex-col">
                <span class="font-serif text-xl tracking-widest uppercase leading-none">CGS</span>
                ${!isHome ? '<span class="text-[8px] uppercase tracking-[0.3em] text-gold/60 mt-1 leading-none">Volver</span>' : ''}
              </div>
            </div>
          </a>
          <div class="hidden md:flex items-center gap-12">
            <div><a class="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors" href="/">Inicio</a></div>
            <div><a href="${isHome ? '#viajes' : '/#viajes'}" class="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors">Viajes</a></div>
            <div><a href="${isHome ? '#galeria' : '/#galeria'}" class="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors">Galería</a></div>
            <div><a class="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors" href="/explorar">Explorar</a></div>
            <div><a href="${isHome ? '#el-autor' : '/#el-autor'}" class="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors">El Autor</a></div>
          </div>
        </div>
      </nav>`;
}

function renderFooterHtml(): string {
  return `<footer class="py-24 px-6 border-t border-white/5 bg-black">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        <div class="space-y-6">
          <h3 class="font-serif text-2xl tracking-widest uppercase">CGS</h3>
          <p class="text-white/40 text-sm leading-relaxed max-w-xs">
            Una mirada entregada a la quietud contemplativa de un teatro abierto, donde la vida misma es el espectáculo más cautivador.
          </p>
        </div>
        <div class="space-y-6">
          <h4 class="text-[10px] uppercase tracking-[0.3em] text-gold">Cuentas</h4>
          <ul class="space-y-4 text-sm text-white/60">
            <li><a href="http://www.youtube.com/@cgsaavedra" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">YouTube @cgsaavedra</a></li>
            <li><a href="https://www.instagram.com/cg.saavedra/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">Instagram cg.saavedra</a></li>
            <li><a href="https://www.linkedin.com/in/carlos-gonzalez-saavedra" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div class="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-white/20">
        <p>© 2026 ${escapeHtml(SITE_AUTHOR_NAME)}. Todos los derechos reservados.</p>
        <div class="flex gap-8">
          <a href="/aviso-legal" class="hover:text-white">Aviso Legal</a>
          <a href="/aviso-legal" class="hover:text-white">Privacidad</a>
        </div>
      </div>
    </footer>`;
}

function renderReviewPageHtml(template: string, viaje: PrerenderItem): string {
  const seo = buildReviewSeoData(viaje);
  const heroOptUrl = getOptimizedImageUrl(seo.heroImage, { width: 1920, crop: 'limit' });
  const galleryItems = getGalleryItems(viaje);
  const displayedGallery = seo.esTematica ? galleryItems : galleryItems.slice(0, 6);

  const preloadHtml = `    <link rel="preload" as="image" href="${escapeHtml(heroOptUrl)}" fetchpriority="high" />`;

  const seoHeadHtml = `    <title>${escapeHtml(seo.fullTitle)}</title>
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="author" content="${escapeHtml(SITE_AUTHOR_NAME)}" />
    <meta name="copyright" content="${escapeHtml(SITE_AUTHOR_NAME)}" />
    <link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="es_ES" />
    <meta property="og:site_name" content="${escapeHtml(SITE_AUTHOR_NAME)} | Fotografía &amp; Relatos de Viaje" />
    <meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(seo.fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:image" content="${escapeHtml(seo.heroImage)}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${escapeHtml(seo.canonicalUrl)}" />
    <meta property="twitter:title" content="${escapeHtml(seo.fullTitle)}" />
    <meta property="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta property="twitter:image" content="${escapeHtml(seo.heroImage)}" />
    <script type="application/ld+json">${safeJsonLd(seo.jsonLd)}</script>`;

  const paragraphs = (viaje.reseña || '')
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p class="text-white/80 leading-relaxed font-light mb-8 text-lg md:text-xl">${escapeHtml(p)}</p>`
    )
    .join('\n              ');

  const showResumen =
    viaje.resumen &&
    (!viaje.reseña || !viaje.reseña.startsWith(viaje.resumen.slice(0, 30)));

  const galleryHtml =
    galleryItems.length > 0
      ? `<div id="galeria" class="pt-16 border-t border-white/10">
                <div class="flex items-center justify-between mb-8 pb-4">
                  <div>
                    <p class="text-gold text-[10px] uppercase tracking-[0.3em] mb-1">Fotografías incluidas</p>
                    <h2 class="font-serif text-2xl text-white">Colección (${galleryItems.length})</h2>
                  </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                  ${displayedGallery
                    .map((item, i) => {
                      const thumbUrl = getOptimizedImageUrl(item.url, {
                        width: 400,
                        height: 400,
                        crop: 'fill',
                      });
                      const loc = item.location || viaje.ubicacion;
                      const altText =
                        item.alt ||
                        item.caption ||
                        `${viaje.titulo}${loc ? ` — ${loc}` : ''}`;
                      const isLast = !seo.esTematica && i === 5 && galleryItems.length > 6;
                      return `<figure class="m-0 aspect-square overflow-hidden relative group bg-neutral-900">
                    <img src="${escapeHtml(thumbUrl)}" alt="${escapeHtml(altText)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="400" height="400" class="w-full h-full object-cover grayscale" />
                    ${
                      isLast
                        ? `<div class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4"><p class="text-gold text-[10px] uppercase tracking-[0.3em] mb-2">Galería Completa</p><p class="text-2xl font-serif text-white">+${galleryItems.length - 5}</p></div>`
                        : `<figcaption class="sr-only">${escapeHtml(item.caption || altText)}${loc ? ` (${escapeHtml(loc)})` : ''}</figcaption>`
                    }
                  </figure>`;
                    })
                    .join('\n                  ')}
                </div>
              </div>`
      : '';

  const rootHtml = `<div id="root">
      ${renderNavbarHtml(false)}
      <div class="min-h-screen bg-black text-white font-light">
        <div class="relative h-[70vh] w-full overflow-hidden">
          <img src="${escapeHtml(heroOptUrl)}" alt="${escapeHtml(`${viaje.titulo} — ${viaje.ubicacion}`)}" referrerpolicy="no-referrer" width="1920" height="1080" decoding="async" fetchpriority="high" class="w-full h-full object-cover opacity-60 grayscale" />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div class="flex items-center gap-2 text-gold text-[10px] uppercase tracking-[0.4em] mb-6">${escapeHtml(viaje.ubicacion)}</div>
            <h1 class="font-serif text-5xl md:text-8xl lg:text-9xl mb-8 tracking-tighter">${escapeHtml(viaje.titulo)}</h1>
          </div>
        </div>
        <main class="max-w-6xl mx-auto px-6 py-24">
          <a href="${seo.esTematica ? '/#galeria' : '/#viajes'}" class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50 mb-12">Volver a ${seo.esTematica ? 'Galería' : 'Viajes'}</a>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-16">
            <aside class="md:col-span-1 space-y-12">
              <div class="space-y-4">
                <p class="text-[10px] uppercase tracking-[0.3em] text-gold">Fecha</p>
                <p class="text-sm text-white/60 tracking-wider">${escapeHtml(viaje.fecha || 'Próximamente')}</p>
              </div>
              ${
                viaje.categoria
                  ? `<div class="space-y-4"><p class="text-[10px] uppercase tracking-[0.3em] text-gold">Categoría</p><p class="text-sm text-white/60 tracking-wider">${escapeHtml(viaje.categoria)}</p></div>`
                  : ''
              }
              ${
                viaje.equipo
                  ? `<div class="space-y-4"><p class="text-[10px] uppercase tracking-[0.3em] text-gold">Equipo</p><p class="text-sm text-white/60 tracking-wider">${escapeHtml(viaje.equipo)}</p></div>`
                  : ''
              }
            </aside>
            <article class="md:col-span-3 space-y-16">
              ${
                showResumen
                  ? `<div class="border-l-2 border-gold/60 pl-6 py-2"><p class="font-serif italic text-xl md:text-2xl text-gold/90 leading-relaxed font-normal">"${escapeHtml(viaje.resumen)}"</p></div>`
                  : ''
              }
              ${paragraphs ? `<div class="prose prose-invert prose-lg max-w-none">${paragraphs}</div>` : ''}
              ${galleryHtml}
            </article>
          </div>
        </main>
        ${renderFooterHtml()}
      </div>
    </div>`;

  let out = replaceBetweenMarkers(template, '<!-- SSR_PRELOAD_START -->', '<!-- SSR_PRELOAD_END -->', preloadHtml);
  out = replaceBetweenMarkers(out, '<!-- SSR_SEO_START -->', '<!-- SSR_SEO_END -->', seoHeadHtml);
  out = replaceBetweenMarkers(out, '<!-- SSR_ROOT_START -->', '<!-- SSR_ROOT_END -->', rootHtml);
  out = removeBetweenMarkers(out, '<!-- SSR_FALLBACK_START -->', '<!-- SSR_FALLBACK_END -->');
  return out;
}

function renderExplorePageHtml(template: string): string {
  const canonicalUrl = `${SITE_BASE_URL}/explorar`;
  const title = `Explorar Archivo Visual | ${SITE_AUTHOR_NAME}`;
  const description =
    'Explora el archivo visual completo de fotografías y crónicas de viajes de Carlos González Saavedra. Búsqueda por temas, lugares y etiquetas.';

  const seoHeadHtml = `    <title>${escapeHtml(title)}</title>
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="${escapeHtml(SITE_AUTHOR_NAME)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="es_ES" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(SITE_DEFAULT_IMAGE)}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${escapeHtml(title)}" />
    <meta property="twitter:description" content="${escapeHtml(description)}" />
    <script type="application/ld+json">${safeJsonLd({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: canonicalUrl,
      inLanguage: 'es',
      author: { '@type': 'Person', name: SITE_AUTHOR_NAME },
    })}</script>`;

  const allCollections = [...VIAJES_COMPLETOS, ...FOTOS_COMPLETAS];
  const linksHtml = allCollections
    .map(
      (c) =>
        `<a href="/viaje/${escapeHtml(c.id)}" class="p-4 border border-white/10 hover:border-gold/40 block transition-colors">
          <p class="text-[10px] uppercase tracking-[0.2em] text-gold mb-1">${escapeHtml(c.ubicacion)}</p>
          <h2 class="font-serif text-lg text-white">${escapeHtml(c.titulo)}</h2>
        </a>`
    )
    .join('\n          ');

  const rootHtml = `<div id="root">
      ${renderNavbarHtml(false)}
      <div class="min-h-screen bg-black text-white pt-32 pb-20 px-6 font-light">
        <main class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <p class="text-gold text-[10px] uppercase tracking-[0.4em] mb-4">Archivo Visual</p>
            <h1 class="font-serif text-4xl md:text-6xl mb-6">Explorar</h1>
            <div class="w-24 h-[1px] bg-gold mx-auto"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            ${linksHtml}
          </div>
        </main>
        ${renderFooterHtml()}
      </div>
    </div>`;

  let out = replaceBetweenMarkers(template, '<!-- SSR_PRELOAD_START -->', '<!-- SSR_PRELOAD_END -->', '');
  out = replaceBetweenMarkers(out, '<!-- SSR_SEO_START -->', '<!-- SSR_SEO_END -->', seoHeadHtml);
  out = replaceBetweenMarkers(out, '<!-- SSR_ROOT_START -->', '<!-- SSR_ROOT_END -->', rootHtml);
  out = removeBetweenMarkers(out, '<!-- SSR_FALLBACK_START -->', '<!-- SSR_FALLBACK_END -->');
  return out;
}

function renderLegalPageHtml(template: string): string {
  const canonicalUrl = `${SITE_BASE_URL}/aviso-legal`;
  const title = `Aviso Legal | ${SITE_AUTHOR_NAME}`;
  const description =
    'Aviso legal y condiciones de uso del sitio web de Carlos González Saavedra. Información sobre propiedad intelectual y protección de datos.';

  const seoHeadHtml = `    <title>${escapeHtml(title)}</title>
    <meta name="robots" content="index, follow" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="${escapeHtml(SITE_AUTHOR_NAME)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="es_ES" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />`;

  const rootHtml = `<div id="root">
      ${renderNavbarHtml(false)}
      <main class="min-h-screen bg-black text-white pt-32 pb-24 px-6">
        <div class="max-w-3xl mx-auto space-y-12 text-white/70 leading-relaxed font-light">
          <h1 class="font-serif text-4xl md:text-5xl text-white mb-12 tracking-tight">Aviso Legal</h1>
          <section>
            <h2 class="text-white font-serif text-xl mb-4 uppercase tracking-widest">1. Propiedad Intelectual</h2>
            <p>Todo el contenido de este sitio web, incluyendo textos, fotografías, gráficos, logotipos e iconos, es propiedad exclusiva de <strong>${escapeHtml(SITE_AUTHOR_NAME)}</strong>, a menos que se indique lo contrario.</p>
          </section>
          <section>
            <h2 class="text-white font-serif text-xl mb-4 uppercase tracking-widest">2. Uso de las Imágenes</h2>
            <p>Las fotografías presentadas en este portafolio son el resultado de un trabajo creativo personal. El uso no autorizado de las mismas constituye una infracción de los derechos de autor.</p>
          </section>
          <section>
            <h2 class="text-white font-serif text-xl mb-4 uppercase tracking-widest">3. Responsabilidad</h2>
            <p>El autor no se hace responsable de los errores u omisiones en los contenidos de este sitio web.</p>
          </section>
          <section>
            <h2 class="text-white font-serif text-xl mb-4 uppercase tracking-widest">4. Protección de Datos</h2>
            <p>Este sitio web no recopila datos personales de los usuarios de forma automatizada.</p>
          </section>
        </div>
      </main>
      ${renderFooterHtml()}
    </div>`;

  let out = replaceBetweenMarkers(template, '<!-- SSR_PRELOAD_START -->', '<!-- SSR_PRELOAD_END -->', '');
  out = replaceBetweenMarkers(out, '<!-- SSR_SEO_START -->', '<!-- SSR_SEO_END -->', seoHeadHtml);
  out = replaceBetweenMarkers(out, '<!-- SSR_ROOT_START -->', '<!-- SSR_ROOT_END -->', rootHtml);
  out = removeBetweenMarkers(out, '<!-- SSR_FALLBACK_START -->', '<!-- SSR_FALLBACK_END -->');
  return out;
}

function enrichHomeHtml(template: string): string {
  const tripCardsHtml = MIS_VIAJES.map(
    (v) => `<article class="bg-white/[0.02] border border-white/5 flex flex-col h-full">
              <div class="p-8 flex flex-col flex-grow space-y-4">
                <div class="text-white/30 text-[9px] uppercase tracking-widest">${escapeHtml(v.ubicacion)}</div>
                <h3 class="font-serif text-2xl leading-tight"><a href="/viaje/${escapeHtml(v.id)}">${escapeHtml(v.titulo)}</a></h3>
                <p class="text-white/50 leading-relaxed text-sm font-light flex-grow">${escapeHtml(v.resumen)}</p>
                <div class="pt-6 border-t border-white/5 flex gap-4">
                  <a href="/viaje/${escapeHtml(v.id)}" class="text-[9px] uppercase tracking-widest text-gold">Ver reseña</a>
                  <a href="/viaje/${escapeHtml(v.id)}#galeria" class="text-[9px] uppercase tracking-widest text-white/40">Ver Galería</a>
                </div>
              </div>
            </article>`
  ).join('\n            ');

  const galleryCardsHtml = MIS_FOTOS.map(
    (f) => `<div>
              <a href="/viaje/${escapeHtml(f.id)}" class="block p-6 bg-neutral-950 border border-white/5">
                <p class="text-gold text-[10px] uppercase tracking-widest mb-1">${escapeHtml(f.ubicacion)}</p>
                <h4 class="font-serif text-xl text-white">${escapeHtml(f.titulo)}</h4>
              </a>
            </div>`
  ).join('\n            ');

  const homeExtraSections = `
          <section id="viajes" class="py-24 px-6 bg-black">
            <div class="max-w-7xl mx-auto">
              <p class="text-gold text-[10px] uppercase tracking-[0.4em] mb-4">Crónicas</p>
              <h2 class="font-serif text-4xl md:text-6xl mb-4">Sendas y relatos</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                ${tripCardsHtml}
              </div>
            </div>
          </section>
          <section id="galeria" class="py-24 px-6 bg-[#050505]">
            <div class="max-w-7xl mx-auto">
              <p class="text-gold text-[10px] uppercase tracking-[0.4em] mb-4">Archivo visual</p>
              <h2 class="font-serif text-4xl md:text-6xl text-white mb-12">Quietud contemplativa</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${galleryCardsHtml}
              </div>
            </div>
          </section>
        </main>
        ${renderFooterHtml()}
      </div>
    </div>`;

  const startIdx = template.indexOf('<!-- SSR_ROOT_START -->');
  const endIdx = template.indexOf('<!-- SSR_ROOT_END -->');
  if (startIdx === -1 || endIdx === -1) return template;

  const currentRoot = template.slice(startIdx, endIdx + '<!-- SSR_ROOT_END -->'.length);
  const updatedRoot = currentRoot.replace(
    /\s*<\/main>\s*<\/div>\s*<\/div><!-- SSR_ROOT_END -->/,
    homeExtraSections + '<!-- SSR_ROOT_END -->'
  );
  return template.slice(0, startIdx) + updatedRoot + template.slice(endIdx + '<!-- SSR_ROOT_END -->'.length);
}

function generateSitemapXml(allItems: PrerenderItem[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [
    { loc: `${SITE_BASE_URL}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_BASE_URL}/explorar`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
    { loc: `${SITE_BASE_URL}/aviso-legal`, lastmod: today, changefreq: 'yearly', priority: '0.3' },
    ...VIAJES_COMPLETOS.map((v) => ({
      loc: `${SITE_BASE_URL}/viaje/${v.id}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    ...FOTOS_COMPLETAS.map((f) => ({
      loc: `${SITE_BASE_URL}/viaje/${f.id}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  // Keep variable referenced cleanly
  void allItems;

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
}

function run() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error('dist/index.html not found. Run vite build before prerender.');
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const allItems: PrerenderItem[] = [...VIAJES_COMPLETOS, ...FOTOS_COMPLETAS];

  // 1. Pre-render all /viaje/:id routes
  for (const item of allItems) {
    const outDir = path.join(DIST_DIR, 'viaje', item.id);
    fs.mkdirSync(outDir, { recursive: true });
    const html = renderReviewPageHtml(template, item);
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  }

  // 2. Pre-render /explorar
  const explorarDir = path.join(DIST_DIR, 'explorar');
  fs.mkdirSync(explorarDir, { recursive: true });
  fs.writeFileSync(path.join(explorarDir, 'index.html'), renderExplorePageHtml(template), 'utf8');

  // 3. Pre-render /aviso-legal
  const legalDir = path.join(DIST_DIR, 'aviso-legal');
  fs.mkdirSync(legalDir, { recursive: true });
  fs.writeFileSync(path.join(legalDir, 'index.html'), renderLegalPageHtml(template), 'utf8');

  // 4. Enrich Home dist/index.html with direct links to all trips and galleries
  fs.writeFileSync(TEMPLATE_PATH, enrichHomeHtml(template), 'utf8');

  // 5. Update sitemap.xml in both dist/ and public/
  const sitemapXml = generateSitemapXml(allItems);
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log(
    `[prerender] Generated static HTML for ${allItems.length} chronicles/galleries + explorar + aviso-legal + enriched Home + sitemap.xml`
  );
}

run();
