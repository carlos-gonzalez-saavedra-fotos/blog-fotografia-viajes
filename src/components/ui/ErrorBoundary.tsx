import { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 text-center">
          <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mb-6 text-gold">
            <AlertTriangle className="w-8 h-8 stroke-thin" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Aviso de carga</p>
          <h2 className="font-serif text-2xl md:text-4xl text-white mb-4">No se pudo cargar el contenido</h2>
          <p className="text-white/60 text-sm max-w-md mb-8 font-light leading-relaxed">
            Se produjo una interrupción momentánea de red al descargar los datos de la crónica.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-gold text-gold text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-black transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reintentar carga</span>
            </button>
            <a
              href="/"
              className="px-6 py-3 border border-white/20 text-white/80 text-xs uppercase tracking-[0.2em] hover:border-white hover:text-white transition-all"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
