'use client';

import { useState } from 'react';
import { listadosService } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AlertModal from '@/components/ui/AlertModal';

interface ChequeDTO {
  numero: string;
  banco: string;
  plaza: string;
  monto: number;
  fechaCobro: string;
}

export default function ListadoChequesPage() {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cheques, setCheques] = useState<ChequeDTO[]>([]);
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
      const data = await listadosService.listarCheques(desde, hasta);
      setCheques(data);
      setBuscado(true);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data || 'Error al obtener los cheques.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const totalMonto = cheques.reduce((acc, c) => acc + c.monto, 0);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Cheques en Cartera</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rango de Fechas de Cobro</CardTitle>
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
        <Card>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Nro. Cheque</th>
                  <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Banco</th>
                  <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Plaza</th>
                  <th className="h-12 px-4 text-right align-middle font-bold text-slate-900">Monto</th>
                  <th className="h-12 px-4 text-left align-middle font-bold text-slate-900">Fecha de Cobro</th>
                </tr>
              </thead>
              <tbody>
                {cheques.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      No se encontraron cheques para el período indicado.
                    </td>
                  </tr>
                ) : (
                  <>
                    {cheques.map((cheque, idx) => (
                      <tr key={idx} className="border-b border-slate-200 hover:bg-muted/50">
                        <td className="p-4 align-middle">{cheque.numero}</td>
                        <td className="p-4 align-middle">{cheque.banco}</td>
                        <td className="p-4 align-middle">{cheque.plaza || '-'}</td>
                        <td className="p-4 align-middle text-right">{formatCurrency(cheque.monto)}</td>
                        <td className="p-4 align-middle">{cheque.fechaCobro}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-400 bg-slate-50">
                      <td colSpan={3} className="p-4 align-middle font-bold text-right">Total</td>
                      <td className="p-4 align-middle text-right font-bold">{formatCurrency(totalMonto)}</td>
                      <td />
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
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
