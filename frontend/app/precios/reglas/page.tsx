'use client';

import { useEffect, useState } from 'react';
import { precioService, ReglaPrecioDTO } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AlertModal from '@/components/ui/AlertModal';

const TIPOS_REGLA = [
  { value: 'TEMPORADA_ALTA', label: 'Temporada alta' },
  { value: 'FIN_DE_SEMANA', label: 'Fin de semana' },
  { value: 'OCUPACION_ALTA', label: 'Ocupación alta' },
  { value: 'DESCUENTO_ESTADIA_LARGA', label: 'Descuento estadía larga' },
];

const FORM_INICIAL = {
  nombre: '',
  descripcion: '',
  tipo: 'TEMPORADA_ALTA',
  multiplicador: '',
  umbralOcupacion: '',
  fechaDesde: '',
  fechaHasta: '',
  minNoches: '',
  prioridad: '',
};

export default function ReglasPrecioPage() {
  const [reglas, setReglas] = useState<ReglaPrecioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'default' | 'danger';
  }>({ isOpen: false, title: '', message: '', variant: 'default' });

  const cargarReglas = async () => {
    setLoading(true);
    try {
      const data = await precioService.listarReglas();
      setReglas(data);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data || 'Error al cargar las reglas de precio.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReglas();
  }, []);

  const formatMultiplicador = (m: number) => {
    const porcentaje = (m - 1) * 100;
    const signo = porcentaje >= 0 ? '+' : '';
    return `${signo}${porcentaje.toFixed(0)}%`;
  };

  const labelTipo = (tipo: string) =>
    TIPOS_REGLA.find((t) => t.value === tipo)?.label || tipo;

  const handleToggle = async (regla: ReglaPrecioDTO) => {
    if (regla.id === undefined) return;
    try {
      if (regla.activa) {
        await precioService.desactivar(regla.id);
      } else {
        await precioService.activar(regla.id);
      }
      await cargarReglas();
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data || 'Error al cambiar el estado de la regla.',
        variant: 'danger',
      });
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.multiplicador || !form.prioridad) {
      setAlertModal({ isOpen: true, title: 'Error', message: 'Complete nombre, multiplicador y prioridad.', variant: 'danger' });
      return;
    }

    const nuevaRegla: ReglaPrecioDTO = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      tipo: form.tipo,
      multiplicador: parseFloat(form.multiplicador),
      umbralOcupacion: form.tipo === 'OCUPACION_ALTA' && form.umbralOcupacion ? parseFloat(form.umbralOcupacion) : null,
      fechaDesde: form.tipo === 'TEMPORADA_ALTA' && form.fechaDesde ? form.fechaDesde : null,
      fechaHasta: form.tipo === 'TEMPORADA_ALTA' && form.fechaHasta ? form.fechaHasta : null,
      minNoches: form.tipo === 'DESCUENTO_ESTADIA_LARGA' && form.minNoches ? parseInt(form.minNoches, 10) : null,
      activa: true,
      prioridad: parseInt(form.prioridad, 10),
    };

    setGuardando(true);
    try {
      await precioService.crearRegla(nuevaRegla);
      setForm(FORM_INICIAL);
      setMostrarFormulario(false);
      await cargarReglas();
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data || 'Error al crear la regla.',
        variant: 'danger',
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reglas de Precio</h1>
        <Button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? 'Cancelar' : 'Nueva Regla'}
        </Button>
      </div>

      {mostrarFormulario && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nueva Regla de Precio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCrear} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input
                    id="descripcion"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <select
                    id="tipo"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  >
                    {TIPOS_REGLA.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="multiplicador">Multiplicador (ej: 1.15 = +15%, 0.90 = -10%)</Label>
                  <Input
                    id="multiplicador"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.multiplicador}
                    onChange={(e) => setForm({ ...form, multiplicador: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridad">Prioridad (mayor = se aplica primero)</Label>
                  <Input
                    id="prioridad"
                    type="number"
                    value={form.prioridad}
                    onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
                    required
                  />
                </div>

                {form.tipo === 'TEMPORADA_ALTA' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fechaDesde">Fecha desde</Label>
                      <Input
                        id="fechaDesde"
                        type="date"
                        value={form.fechaDesde}
                        onChange={(e) => setForm({ ...form, fechaDesde: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaHasta">Fecha hasta</Label>
                      <Input
                        id="fechaHasta"
                        type="date"
                        value={form.fechaHasta}
                        onChange={(e) => setForm({ ...form, fechaHasta: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                {form.tipo === 'OCUPACION_ALTA' && (
                  <div className="space-y-2">
                    <Label htmlFor="umbralOcupacion">Umbral de ocupación (ej: 0.80 = 80%)</Label>
                    <Input
                      id="umbralOcupacion"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={form.umbralOcupacion}
                      onChange={(e) => setForm({ ...form, umbralOcupacion: e.target.value })}
                      required
                    />
                  </div>
                )}

                {form.tipo === 'DESCUENTO_ESTADIA_LARGA' && (
                  <div className="space-y-2">
                    <Label htmlFor="minNoches">Mínimo de noches</Label>
                    <Input
                      id="minNoches"
                      type="number"
                      min="1"
                      value={form.minNoches}
                      onChange={(e) => setForm({ ...form, minNoches: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar Regla'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Nombre</th>
                <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Tipo</th>
                <th className="h-12 px-4 text-right align-middle font-bold text-slate-900">Ajuste</th>
                <th className="h-12 px-4 text-right align-middle font-bold text-slate-900">Prioridad</th>
                <th className="h-12 px-4 text-center align-middle font-bold text-slate-900">Estado</th>
                <th className="h-12 px-4 text-center align-middle font-bold text-slate-900">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    Cargando reglas...
                  </td>
                </tr>
              ) : reglas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    No hay reglas de precio cargadas.
                  </td>
                </tr>
              ) : (
                reglas.map((regla) => (
                  <tr key={regla.id} className="border-b border-slate-200 hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <p className="font-medium">{regla.nombre}</p>
                      {regla.descripcion && (
                        <p className="text-xs text-slate-500">{regla.descripcion}</p>
                      )}
                    </td>
                    <td className="p-4 align-middle">{labelTipo(regla.tipo)}</td>
                    <td className="p-4 align-middle text-right font-medium">
                      {formatMultiplicador(regla.multiplicador)}
                    </td>
                    <td className="p-4 align-middle text-right">{regla.prioridad}</td>
                    <td className="p-4 align-middle text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          regla.activa
                            ? 'bg-green-100 text-green-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {regla.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-center">
                      <Button
                        variant={regla.activa ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => handleToggle(regla)}
                      >
                        {regla.activa ? 'Desactivar' : 'Activar'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal((prev) => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
      />
    </div>
  );
}
