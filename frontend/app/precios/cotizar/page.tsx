'use client';

import { useState } from 'react';
import { precioService, CotizacionResponseDTO } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AlertModal from '@/components/ui/AlertModal';

const NUMEROS_HABITACION = Array.from({ length: 48 }, (_, i) => String(i + 1));

export default function CotizarPrecioPage() {
  const [numeroHabitacion, setNumeroHabitacion] = useState('1');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cotizacion, setCotizacion] = useState<CotizacionResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'default' | 'danger';
  }>({ isOpen: false, title: '', message: '', variant: 'default' });

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v);

  const handleCotizar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!desde || !hasta) {
      setAlertModal({ isOpen: true, title: 'Error', message: 'Debe ingresar ambas fechas.', variant: 'danger' });
      return;
    }
    if (desde >= hasta) {
      setAlertModal({ isOpen: true, title: 'Error', message: 'La fecha "Hasta" debe ser posterior a la fecha "Desde".', variant: 'danger' });
      return;
    }

    setLoading(true);
    setCotizacion(null);
    try {
      const data = await precioService.cotizar(numeroHabitacion, desde, hasta);
      setCotizacion(data);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data || 'Error al cotizar el precio.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Cotizar Precio</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Datos de la Cotización</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCotizar} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="habitacion">Habitación</Label>
                <select
                  id="habitacion"
                  value={numeroHabitacion}
                  onChange={(e) => setNumeroHabitacion(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                >
                  {NUMEROS_HABITACION.map((num) => (
                    <option key={num} value={num}>
                      Habitación {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desde">Desde</Label>
                <Input
                  id="desde"
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hasta">Hasta</Label>
                <Input
                  id="hasta"
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Cotizando...' : 'Cotizar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {cotizacion && (
        <Card>
          <CardHeader>
            <CardTitle>
              Habitación {cotizacion.numeroHabitacion} — {cotizacion.categoria.replace(/_/g, ' ')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Precio base por noche</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(cotizacion.precioNocheBase)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Precio ajustado por noche</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(cotizacion.precioNocheAjustado)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Noches</p>
                <p className="text-2xl font-bold text-slate-900">{cotizacion.noches}</p>
              </div>
              <div className="rounded-lg border-2 border-slate-900 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Total final</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(cotizacion.totalFinal)}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600">Ocupación actual del hotel</p>
              <p className="text-lg font-semibold text-slate-900">
                {(cotizacion.porcentajeOcupacion * 100).toFixed(0)}%
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600 mb-2">Reglas aplicadas</p>
              {cotizacion.reglasAplicadas.length === 0 ? (
                <p className="text-slate-500">No se aplicó ninguna regla. Se cobra el precio base.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {cotizacion.reglasAplicadas.map((regla, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-slate-50"
                    >
                      {regla}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
