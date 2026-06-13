'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { portalService } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AlertModal from '@/components/ui/AlertModal';

export default function GenerarQRPage() {
  const [estadiaId, setEstadiaId] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'default' | 'danger';
  }>({ isOpen: false, title: '', message: '', variant: 'default' });

  const urlPortal = token ? `http://${window.location.hostname}:3000/portal/${token}` : '';

  const handleGenerar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!estadiaId) {
      setAlertModal({ isOpen: true, title: 'Error', message: 'Debe ingresar el ID de la estadía.', variant: 'danger' });
      return;
    }

    setLoading(true);
    setToken(null);
    try {
      const nuevoToken = await portalService.generarToken(parseInt(estadiaId, 10));
      setToken(nuevoToken);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data || 'Error al generar el token de acceso.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 print:hidden">
        Generar QR — Portal del Huésped
      </h1>

      <Card className="mb-6 print:hidden">
        <CardHeader>
          <CardTitle>Datos de la Estadía</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerar} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estadiaId">ID de Estadía</Label>
                <Input
                  id="estadiaId"
                  type="number"
                  min="1"
                  value={estadiaId}
                  onChange={(e) => setEstadiaId(e.target.value)}
                  placeholder="Ej: 12"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Generando...' : 'Generar QR'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {token && (
        <Card>
          <CardHeader className="print:hidden">
            <CardTitle>QR de Acceso</CardTitle>
          </CardHeader>
          <CardContent className="print:p-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-bold text-slate-900 hidden print:block">Hotel Premier</p>
              <QRCodeSVG value={urlPortal} size={256} />
              <p className="text-sm text-slate-600 break-all text-center">{urlPortal}</p>
              <p className="text-sm text-slate-900 hidden print:block">
                Escaneá este código para ver la información de tu estadía.
              </p>
              <Button variant="outline" onClick={() => window.print()} className="print:hidden">
                Imprimir QR
              </Button>
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
