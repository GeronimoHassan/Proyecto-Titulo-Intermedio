import axios from 'axios';
import { Huesped, UsuarioDTO, PersonaJuridicaDTO, BusquedaResponsablePagoDTO, ConsumoDTO, DatosFacturaDTO, FacturaDTO, TipoPagoDTO, ResponsablePagoDTO, BusquedaFacturaResponsableDTO, NotaCredito } from '../types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (credentials: UsuarioDTO) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export const huespedService = {
  getAll: async (params?: {
    apellido?: string;
    nombres?: string;
    tipoDocumento?: string;
    numeroDocumento?: string;
  }) => {
    try {
      const response = await api.get<Huesped[]>('/huespedes', { params });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },
  getById: async (id: number) => {
    const response = await api.get<Huesped>(`/huespedes/${id}`);
    return response.data;
  },
  create: async (huesped: Huesped) => {
    try {
      const response = await api.post<Huesped>('/huespedes', huesped);
      return { success: true, data: response.data };
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        return { success: false, status: 409, message: error.response.data };
      }
      throw error;
    }
  },
  update: async (id: number, huesped: Huesped) => {
    try {
      const response = await api.put<Huesped>(`/huespedes/${id}`, huesped);
      return { success: true, data: response.data };
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        return { success: false, status: 409, message: error.response.data };
      }
      throw error;
    }
  },
  delete: async (id: number) => {
    const response = await api.delete(`/huespedes/${id}`);
    return response.data;
  },
  getByIds: async (ids: number[]) => {
    
    const response = await api.post<Huesped[]>('/huespedes/lista', ids);
    return response.data;
  }
};

export const estadiaService = {
  buscarEstadia: async (numeroHabitacion: string) => {
    const response = await api.get(`/estadias/${numeroHabitacion}`);
    return response.data;
  },
  getConsumos: async (idEstadia: number) => {
    const response = await api.get<ConsumoDTO[]>(`/estadias/consumos/${idEstadia}`);
    return response.data;
  }
};

export const facturacionService = {
  generarFactura: async (datos: DatosFacturaDTO) => {
    const response = await api.post<number>('/facturar', datos);
    return response.data;
  },
  getFacturaPdf: async (id: number) => {
    const response = await api.get(`/facturar/pdf/${id}`, {
      responseType: 'arraybuffer'
    });
    return response.data;
  }
};

export const responsablePagoService = {
  darAltaPersonaFisica: async (idHuesped: number) => {
    try {
      const response = await api.post(`/responsablePago/personaFisica/${idHuesped}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        throw new Error('Huesped no encontrado');
      }
      throw error;
    }
  },
  buscarPersonaJuridica: async (params: BusquedaResponsablePagoDTO) => {
    try {
      const response = await api.get<PersonaJuridicaDTO[]>('/responsablePago/personaJuridica', { params });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },
  buscarResponsablePago: async (params: BusquedaResponsablePagoDTO) => {
    try {
      const response = await api.get<ResponsablePagoDTO[]>('/responsablePago', { params });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },
  darAltaPersonaJuridica: async (persona: PersonaJuridicaDTO) => {
    const response = await api.post('/responsablePago/personaJuridica', persona);
    return response.data;
  },
  getPersonaJuridicaById: async (id: number) => {
    const response = await api.get<PersonaJuridicaDTO>(`/responsablePago/personaJuridica/${id}`);
    return response.data;
  },
  modificarPersonaJuridica: async (id: number, persona: PersonaJuridicaDTO) => {
    const response = await api.put<PersonaJuridicaDTO>(`/responsablePago/personaJuridica/${id}`, persona);
    return response.data;
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/responsablePago/${id}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        return { success: false, status: 409 };
      }
      throw error;
    }
  }
};

export const facturaService = {
  getByRoom: async (numeroHabitacion: string) => {
    const response = await api.get<FacturaDTO[]>(`/facturar/${numeroHabitacion}`);
    return response.data;
  },
  obtenerFacturasPorResponsable: async (params: BusquedaFacturaResponsableDTO) => {
    try {
      const response = await api.get<FacturaDTO[]>('/facturar', { params });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  }
};

export const pagoService = {
  pagar: async (idFactura: number, pagos: TipoPagoDTO[]) => {
    const response = await api.post(`/pago/pagar/${idFactura}`, pagos);
    return response.data;
  },
};

export const notaCreditoService = {
  crearNotaCredito: async (facturasIds: number[]) => {
    const response = await api.post<number>('/notaCredito', facturasIds);
    return response.data;
  },
  generarPDFNotaCredito: async (id: number) => {
    const response = await api.get(`/notaCredito/${id}`, {
      responseType: 'arraybuffer'
    });
    return response.data;
  }
};

export interface ReglaPrecioDTO {
  id?: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  multiplicador: number;
  umbralOcupacion?: number | null;
  fechaDesde?: string | null;
  fechaHasta?: string | null;
  minNoches?: number | null;
  activa: boolean;
  prioridad: number;
}

export interface CotizacionResponseDTO {
  numeroHabitacion: string;
  categoria: string;
  precioNocheBase: number;
  precioNocheAjustado: number;
  noches: number;
  totalFinal: number;
  porcentajeOcupacion: number;
  reglasAplicadas: string[];
}

export const precioService = {
  cotizar: async (numeroHabitacion: string, desde: string, hasta: string) => {
    const response = await api.get<CotizacionResponseDTO>(`/precios/cotizar/${numeroHabitacion}`, {
      params: { desde, hasta },
    });
    return response.data;
  },
  listarReglas: async () => {
    const response = await api.get<ReglaPrecioDTO[]>('/precios/reglas');
    return response.data;
  },
  crearRegla: async (regla: ReglaPrecioDTO) => {
    const response = await api.post<ReglaPrecioDTO>('/precios/reglas', regla);
    return response.data;
  },
  activar: async (id: number) => {
    const response = await api.patch<ReglaPrecioDTO>(`/precios/reglas/${id}/activar`);
    return response.data;
  },
  desactivar: async (id: number) => {
    const response = await api.patch<ReglaPrecioDTO>(`/precios/reglas/${id}/desactivar`);
    return response.data;
  },
};

export interface ConsumoPortalDTO {
  descripcion: string;
  monto: number;
  fecha: string;
}

export interface PortalHuespedDTO {
  numeroHabitacion: string;
  categoriaHabitacion: string;
  checkIn: string;
  checkOut: string;
  nombreTitular: string;
  totalFactura: number;
  totalPagado: number;
  saldoPendiente: number;
  estadoFactura: string;
  consumos: ConsumoPortalDTO[];
}

export const portalService = {
  generarToken: async (estadiaId: number) => {
    const response = await api.post<string>(`/portal/generar/${estadiaId}`);
    return response.data;
  },
  obtenerDatosPortal: async (token: string) => {
    const response = await api.get<PortalHuespedDTO>(`/portal/huesped/${token}`);
    return response.data;
  },
};

export const listadosService = {
  listarCheques: async (desde: string, hasta: string) => {
    const response = await api.get('/listados/cheques', { params: { desde, hasta } });
    return response.data;
  },
  listarIngresos: async (desde: string, hasta: string) => {
    const response = await api.get('/listados/ingresos', { params: { desde, hasta } });
    return response.data;
  },
};

export default api;
