import { useForm } from 'react-hook-form';
import { createAlert } from '../../services/alert.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

import { useAuth } from '../../context/AuthContext';

export default function CreateAlert({ onClose, onSuccess }) {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      phoneNumber: user?.phone || ''
    }
  });

  const onSubmit = async (data) => {
    await createAlert(data);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Price Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Commodity</label>
            <input
              {...register('commodity', { required: true })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Market (optional)</label>
            <input {...register('market')} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Target Price (₹)</label>
            <input
              type="number"
              step="0.01"
              {...register('targetPrice', { required: true, min: 0 })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Alert Type</label>
            <select {...register('alertType')} className="w-full border rounded p-2">
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">WhatsApp Number</label>
            <input
              type="tel"
              {...register('phoneNumber', { required: true })}
              placeholder="+91..."
              className="w-full border rounded p-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter number with country code (e.g., +919876543210) to receive WhatsApp alerts.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}