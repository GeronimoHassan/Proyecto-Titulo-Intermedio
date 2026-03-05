'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, TrendingUp } from 'lucide-react';

export default function ListadosPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Listados</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <Link href="/listados/cheques">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" />
                Cheques en Cartera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Listado de cheques en cartera por rango de fechas de cobro.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/listados/ingresos">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-slate-600" />
                Ingresos por Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Ingresos por fechas y medios de pago.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
