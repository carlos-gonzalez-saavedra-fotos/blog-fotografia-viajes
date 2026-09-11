import { Viaje, Photo } from '../types';
import { viajesEuropa } from './viajesEuropa';
import { viajesEspana } from './viajesEspana';
import { viajesMundo } from './viajesMundo';
import { galeriasTematicas } from './galeriasTematicas';

export const VIAJES_COMPLETOS: Viaje[] = [
  ...(viajesEuropa || []),
  ...(viajesEspana || []),
  ...(viajesMundo || [])
];

export const FOTOS_COMPLETAS: Photo[] = (galeriasTematicas as Photo[]) || [];

export function getViajeCompletoById(id: string | undefined): Viaje | Photo | undefined {
  if (!id) return undefined;
  return VIAJES_COMPLETOS.find(v => v.id === id) || FOTOS_COMPLETAS.find(f => f.id === id);
}
