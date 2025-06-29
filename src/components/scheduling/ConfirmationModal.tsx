import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  therapistName: string;
  date: Date | null;
  time: string | null;
  price: number;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  therapistName,
  date,
  time,
  price,
}) => {
  if (!date || !time) {
    return null;
  }

  const formattedDate = format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Agendamento</DialogTitle>
          <DialogDescription>
            Revise os detalhes da sua sessão antes de confirmar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-2">
            <p><span className="font-semibold">Terapeuta:</span> {therapistName}</p>
            <p><span className="font-semibold">Data:</span> <span className="capitalize">{formattedDate}</span></p>
            <p><span className="font-semibold">Horário:</span> {time}</p>
            <p className="text-lg font-bold mt-2"><span className="font-semibold">Valor:</span> R$ {price.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm}>Confirmar e Pagar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
