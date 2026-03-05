'use client';

import { useState } from 'react';
import { listadosService } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AlertModal from '@/components/ui/AlertModal';

interface IngresoDTO {
  fecha: string;
  metodoPago: string;
  monto: number;
  tipoMoneda: string;
}

const METODO_LABELS: Record<string, string> = {
  MONEDA: 'Efectivo / Moneda',
  TARJETA_CREDITO: 'Tarjeta de Crédito',
  TARJETA_DEBITO: 'Tarjeta de Débito',
  CHEQUE: 'Cheque',
};

export default function ListadoIngresosPage() {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [ingresos, setIngresos] = useState<IngresoDTO[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'default' | 'danger';
  }>({ isOpen: false, title: '', message: '', variant: 'default' });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!desde || !hasta) {
      setAlertModal({ isOpen: true, title: 'Error', message: 'Debe ingresar ambas fechas.', variant: 'danger' });
      return;
    }
    if (desde > hasta) {
      setAlertModal({ isOpen: true, title: 'Error', message: 'La fecha "Desde" no puede ser posterior a la fecha "Hasta".', variant: 'danger' });
      return;
    }

    setLoading(true);
    try {
      const data = await listadosService.listarIngresos(desde, hasta);
      setIngresos(data);
      setBuscado(true);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data || 'Error al obtener los ingresos.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  // Agrupar por metodoPago + tipoMoneda para totales
  const totales = ingresos.reduce<Record<string, number>>((acc, ing) => {
    const key = `${ing.metodoPago}|${ing.tipoMoneda}`;
    acc[key] = (acc[key] ?? 0) + ing.monto;
    return acc;
  }, {});

  const formatCurrency = (v: number, moneda: string) => {
    if (moneda === 'ARS') {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v);
    }
    return `${moneda} ${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(v)}`;
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Ingresos por Período</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rango de Fechas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="desde">Desde Fecha</Label>
                <Input
                  id="desde"
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hasta">Hasta Fecha</Label>
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
              <Button type="submit" variant="secondary" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {buscado && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detalle de Ingresos</CardTitle>
            </CardHeader>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Tipo de Ingreso</th>
                    <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Fecha</th>
                    <th className="h-12 px-4 text-right align-middle font-bold text-slate-900">Monto</th>
                    <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Moneda</th>
                  </tr>
                </thead>
                <tbody>
                  {ingresos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-500">
                        No se encontraron ingresos para el período indicado.
                      </td>
                    </tr>
                  ) : (
                    ingresos.map((ing, idx) => (
                      <tr key={idx} className="border-b border-slate-200 hover:bg-muted/50">
                        <td className="p-4 align-middle">{METODO_LABELS[ing.metodoPago] ?? ing.metodoPago}</td>
                        <td className="p-4 align-middle">{ing.fecha}</td>
                        <td className="p-4 align-middle text-right">{formatCurrency(ing.monto, ing.tipoMoneda)}</td>
                        <td className="p-4 align-middle">{ing.tipoMoneda}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {ingresos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Totales por Tipo de Ingreso y Moneda</CardTitle>
              </CardHeader>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Tipo de Ingreso</th>
                      <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Moneda</th>
                      <th className="h-12 px-4 text-right align-middle font-bold text-slate-900">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(totales).map(([key, total]) => {
                      const [metodo, moneda] = key.split('|');
                      return (
                        <tr key={key} className="border-b border-slate-200 hover:bg-muted/50">
                          <td className="p-4 align-middle">{METODO_LABELS[metodo] ?? metodo}</td>
                          <td className="p-4 align-middle">{moneda}</td>
                          <td className="p-4 align-middle text-right font-medium">{formatCurrency(total, moneda)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
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
