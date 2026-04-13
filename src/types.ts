export interface GalleryItem {
  url: string;
  caption?: string;
  tags?: string[];
  alt?: string;
}

export interface Viaje {
  id: string;
  titulo: string;
  ubicacion: string;
  resumen: string;
  reseña: string;
  urlImagen: string;
  categoria: string;
  fecha?: string;
  equipo?: string;
  galeria?: (string | GalleryItem)[];
}

export interface Photo {
  id: string;
  url: string;
  titulo: string;
  ubicacion: string;
  equipo?: string;
  galeriaTematica?: (string | GalleryItem)[];
}
