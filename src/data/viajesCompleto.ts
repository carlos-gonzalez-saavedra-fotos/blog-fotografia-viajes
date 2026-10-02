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

const LEGACY_ID_ALIASES: Record<string, string> = {
  'galebcn2023': 'gale2023',
  'galebcn2024': 'gale2024',
  'galebcn2025': 'gale2025',
};

export function getViajeCompletoById(id: string | undefined): Viaje | Photo | undefined {
  if (!id) return undefined;
  const decoded = decodeURIComponent(id).trim();
  const normalized = decoded.toLowerCase().replace(/\/+$/, '');
  const targetId = LEGACY_ID_ALIASES[normalized] || normalized;
  return (
    VIAJES_COMPLETOS.find(v => v.id.toLowerCase() === targetId) ||
    FOTOS_COMPLETAS.find(f => f.id.toLowerCase() === targetId) ||
    VIAJES_COMPLETOS.find(v => v.id.toLowerCase() === normalized) ||
    FOTOS_COMPLETAS.find(f => f.id.toLowerCase() === normalized) ||
    VIAJES_COMPLETOS.find(v => v.id === decoded) ||
    FOTOS_COMPLETAS.find(f => f.id === decoded)
  );
}
