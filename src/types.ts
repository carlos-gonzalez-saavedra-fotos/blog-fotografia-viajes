export interface GalleryItem {
  url: string;
  caption?: string;
  tags?: string[];
  alt?: string;
  location?: string;
}

export interface ViajeResumen {
  id: string;
  titulo: string;
  ubicacion: string;
  resumen: string;
  url?: string;
  urlImagen?: string;
  categoria: string;
  fecha?: string;
  equipo?: string;
  galeriaCount?: number;
  galeria?: (string | GalleryItem)[];
}

export interface PhotoResumen {
  id: string;
  url: string;
  titulo: string;
  ubicacion: string;
  fecha?: string;
  equipo?: string;
  fotosCount?: number;
  galeriaTematica?: (string | GalleryItem)[];
}

export interface Viaje extends ViajeResumen {
  reseña: string;
  galeria?: (string | GalleryItem)[];
  galeriaTematica?: (string | GalleryItem)[];
}

export interface Photo extends PhotoResumen {
  galeriaTematica?: (string | GalleryItem)[];
}
