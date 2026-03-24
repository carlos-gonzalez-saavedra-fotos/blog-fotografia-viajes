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
  galeria?: string[];
}

export interface Photo {
  id: string;
  url: string;
  titulo: string;
  ubicacion: string;
}
