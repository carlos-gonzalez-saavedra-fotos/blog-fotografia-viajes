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
  const decoded = decodeURIComponent(id).trim();
  const normalized = decoded.toLowerCase().replace(/\/+$/, '');
  return (
    VIAJES_COMPLETOS.find(v => v.id.toLowerCase() === normalized) ||
    FOTOS_COMPLETAS.find(f => f.id.toLowerCase() === normalized) ||
    VIAJES_COMPLETOS.find(v => v.id === decoded) ||
    FOTOS_COMPLETAS.find(f => f.id === decoded)
  );
}
