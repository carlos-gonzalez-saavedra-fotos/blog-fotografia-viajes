import { ViajeResumen, PhotoResumen } from '../types';
import { VIAJES_RESUMEN, FOTOS_RESUMEN } from './viajesResumen';

// Estructura de datos ligera para la portada (BlogSection, PhotographySection)
// Solo incluye metadatos básicos y conteos para arranque ultrarrápido sin sobrecarga de memoria
export const MIS_VIAJES: ViajeResumen[] = VIAJES_RESUMEN;
export const MIS_FOTOS: PhotoResumen[] = FOTOS_RESUMEN;