'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { responsablePagoService } from '@/services/api';
import { PersonaJuridicaDTO } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import AlertModal from '@/components/ui/AlertModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const emptyDireccion = {
  calle: '',
  numero: '',
  departamento: '',
  piso: '',
  codigoPostal: '',
  localidad: '',
  provincia: '',
  pais: '',
};

export default function EditarResponsablePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState<PersonaJuridicaDTO>({
    razonSocial: '',
    cuit: '',
    telefono: '',
    direccion: { ...emptyDireccion },
  });

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'default' | 'danger';
    onClose?: () => void;
  }>({ isOpen: false, title: '', message: '', variant: 'default' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await responsablePagoService.getPersonaJuridicaById(Number(id));
        setFormData({
          ...data,
          direccion: data.direccion ?? { ...emptyDireccion },
        });
      } catch {
        setAlertModal({
          isOpen: true,
          title: 'Error',
          message: 'No se pudo cargar el responsable de pago.',
          variant: 'danger',
          onClose: () => router.push('/responsables'),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value.toUpperCase();

    if (name === 'razonSocial') {
      if (!/^[A-Z0-9ÑÁÉÍÓÚÜ.,&\- ]*$/.test(newValue)) return;
    }
    if (name === 'telefono') {
      if (!/^[0-9]*$/.test(newValue)) return;
      if (newValue.length > 20) return;
    }
    if (name === 'cuit') {
      const numbers = newValue.replace(/\D/g, '');
      const limited = numbers.slice(0, 11);
      let formatted = limited.slice(0, 2);
      if (limited.length > 2) formatted += '-' + limited.slice(2, 10);
      if (limited.length > 10) formatted += '-' + limited.slice(10);
      newValue = formatted;
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value.toUpperCase();

    if (['calle', 'localidad'].includes(name)) {
      if (!/^[A-ZÁÉÍÓÚÑ0-9\s]*$/.test(newValue)) return;
    }
    if (['provincia', 'pais'].includes(name)) {
      if (!/^[A-ZÁÉÍÓÚÑ\s]*$/.test(newValue)) return;
    }
    if (['numero', 'codigoPostal', 'piso'].includes(name)) {
      if (!/^[0-9]*$/.test(newValue)) return;
    }
    if (name === 'departamento') {
      if (!/^[A-Z0-9]*$/.test(newValue)) return;
    }

    setFormData((prev) => ({
      ...prev,
      direccion: { ...prev.direccion, [name]: newValue },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cuitRegex = /^[0-9]{2}-?[0-9]{8}-?[0-9]$/;
    if (!cuitRegex.test(formData.cuit)) {
      setAlertModal({
        isOpen: true,
        title: 'Error de Validación',
        message: 'El CUIT debe tener 11 números y respetar el formato XX-XXXXXXXX-X.',
        variant: 'danger',
      });
      return;
    }

    setSaving(true);
    try {
      await responsablePagoService.modificarPersonaJuridica(Number(id), formData);
      setAlertModal({
        isOpen: true,
        title: 'Éxito',
        message: 'La operación ha culminado con éxito.',
        variant: 'default',
        onClose: () => router.push('/responsables'),
      });
    } catch (err: any) {
      if (err.response?.status === 409) {
        setAlertModal({
          isOpen: true,
          title: 'Error',
          message: '¡CUIDADO! El CUIT ya existe en el sistema.',
          variant: 'danger',
        });
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Error',
          message: err.response?.data || 'Error al modificar el responsable de pago.',
          variant: 'danger',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      const result = await responsablePagoService.delete(Number(id));
      if (!result.success && result.status === 409) {
        setAlertModal({
          isOpen: true,
          title: 'Error',
          message: 'La firma no puede ser eliminada pues ya se le ha confeccionado una factura en el Hotel en alguna oportunidad.',
          variant: 'danger',
        });
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Éxito',
          message: `Los datos de ${formData.razonSocial}, ${formData.cuit} han sido eliminados del sistema.`,
          variant: 'default',
          onClose: () => router.push('/responsables'),
        });
      }
    } catch {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Error al eliminar el responsable de pago.',
        variant: 'danger',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center text-slate-500">
        Cargando...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modificar Responsable de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="razonSocial">Razón Social</Label>
                <Input
                  id="razonSocial"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cuit">CUIT</Label>
                <Input
                  id="cuit"
                  name="cuit"
                  value={formData.cuit}
                  onChange={handleChange}
                  required
                  placeholder="XX-XXXXXXXX-X"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Dirección</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calle">Calle</Label>
                  <Input id="calle" name="calle" value={formData.direccion.calle} onChange={handleAddressChange} required maxLength={50} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input id="numero" name="numero" value={formData.direccion.numero} onChange={handleAddressChange} required maxLength={10} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input id="departamento" name="departamento" value={formData.direccion.departamento ?? ''} onChange={handleAddressChange} maxLength={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="piso">Piso</Label>
                  <Input id="piso" name="piso" value={formData.direccion.piso ?? ''} onChange={handleAddressChange} maxLength={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigoPostal">Código Postal</Label>
                  <Input id="codigoPostal" name="codigoPostal" value={formData.direccion.codigoPostal} onChange={handleAddressChange} required maxLength={10} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localidad">Localidad</Label>
                  <Input id="localidad" name="localidad" value={formData.direccion.localidad} onChange={handleAddressChange} required maxLength={50} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input id="provincia" name="provincia" value={formData.direccion.provincia} onChange={handleAddressChange} required maxLength={50} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input id="pais" name="pais" value={formData.direccion.pais} onChange={handleAddressChange} required maxLength={50} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/responsables')}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
              >
                Borrar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => {
          setAlertModal((prev) => ({ ...prev, isOpen: false }));
          alertModal.onClose?.();
        }}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Responsable"
        message={`Los datos de ${formData.razonSocial}, ${formData.cuit} serán eliminados del sistema. ¿Desea continuar?`}
        variant="danger"
        confirmText="Eliminar"
      />
    </div>
  );
}
