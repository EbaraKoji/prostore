import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export const toastError = (message: string, isPending: boolean) => {
  toast.custom((t) => (
    <div className="flex space-x-4 items-center bg-red-200 border border-red-400 rounded-lg px-2 py-1">
      <span className="text-sm text-red-700 font-semibold">{message}</span>
      <Button
        onClick={() => toast.dismiss(t)}
        variant="destructive"
        className="px-1 text-xs cursor-pointer"
        disabled={isPending}
      >
        Close
      </Button>
    </div>
  ));
};
