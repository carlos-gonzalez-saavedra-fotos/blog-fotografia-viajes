import { Viaje, Photo } from '../types';

// Importaciones con nombres limpios
import { viajesEspana } from './viajesEspana';
import { viajesEuropa } from './viajesEuropa';
import { viajesMundo } from './viajesMundo';
import { galeriasTematicas } from './galeriasTematicas';

// Usamos el operador || [] para que si un archivo está vacío o falla, 
// la web no se quede en blanco y siga cargando el resto.
export const MIS_VIAJES: Viaje[] = [
  ...(viajesEspana || []),
  ...(viajesEuropa || []),
  ...(viajesMundo || [])
];

export const MIS_FOTOS: any[] = galeriasTematicas || [];