'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { portalService, PortalHuespedDTO } from '@/services/api';

export default function PortalHuespedPage() {
  const params = useParams<{ token: string }>();
  const [datos, setDatos] = useState<PortalHuespedDTO | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.token) return;
    portalService
      .obtenerDatosPortal(params.token)
      .then(setDatos)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params?.token]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v);

  const formatFecha = (fecha: string) =>
    new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <p className="text-lg text-slate-600">Cargando su información...</p>
      </div>
    );
  }

  if (error || !datos) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full">
          <p className="text-5xl mb-4">⚠️</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Acceso no válido</h1>
          <p className="text-base text-slate-600">
            Este código QR ya no está activo o el enlace es incorrecto.
            Por favor, acérquese a recepción para obtener uno nuevo.
          </p>
        </div>
      </div>
    );
  }

  const saldoCero = datos.saldoPendiente <= 0;

  return (
    <div className="min-h-screen bg-slate-100 pb-10">
      <header className="bg-slate-900 text-white px-6 py-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Hotel Premier</h1>
        <p className="text-lg mt-2 text-slate-300">
          Habitación <span className="font-bold text-white">{datos.numeroHabitacion}</span>
        </p>
        <p className="text-sm text-slate-400">{datos.categoriaHabitacion.replace(/_/g, ' ')}</p>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6 flex flex-col gap-4">
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Su estadía</h2>
          <div className="flex flex-col gap-3 text-base">
            <div className="flex justify-between">
              <span className="text-slate-600">Titular</span>
              <span className="font-semibold text-slate-900 text-right">{datos.nombreTitular}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Check-in</span>
              <span className="font-semibold text-slate-900">{formatFecha(datos.checkIn)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Check-out</span>
              <span className="font-semibold text-slate-900">{formatFecha(datos.checkOut)}</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Su cuenta</h2>
          <div className="flex flex-col gap-3 text-base">
            <div className="flex justify-between">
              <span className="text-slate-600">Total facturado</span>
              <span className="font-semibold text-slate-900">{formatCurrency(datos.totalFactura)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total pagado</span>
              <span className="font-semibold text-slate-900">{formatCurrency(datos.totalPagado)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3 mt-1">
              <span className="text-slate-600 font-medium">Saldo pendiente</span>
              <span className={`text-xl font-bold ${saldoCero ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(datos.saldoPendiente)}
              </span>
            </div>
            {datos.estadoFactura === 'SIN_FACTURA' && (
              <p className="text-sm text-slate-500">
                La factura se emitirá al momento del check-out.
              </p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Consumos</h2>
          {datos.consumos.length === 0 ? (
            <p className="text-base text-slate-500">No hay consumos registrados.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-slate-200">
              {datos.consumos.map((consumo, idx) => (
                <li key={idx} className="py-3 flex justify-between items-start gap-4">
                  <div>
                    <p className="text-base font-medium text-slate-900">{consumo.descripcion}</p>
                    <p className="text-sm text-slate-500">{formatFecha(consumo.fecha)}</p>
                  </div>
                  <p className="text-base font-semibold text-slate-900 whitespace-nowrap">
                    {formatCurrency(consumo.monto)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="text-center text-sm text-slate-500 mt-2 px-6">
          Ante cualquier consulta, comuníquese con recepción.
        </footer>
      </main>
    </div>
  );
}
