import { X, Trash2, AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal({
  open,
  transaction,
  onCancel,
  onConfirm,
}) {
  if (!open || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-card p-8 rounded-2xl shadow-2xl border border-border/50 w-full max-w-sm relative text-center animate-scale-in">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-full transition-all duration-200"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center ring-4 ring-background shadow-lg">
          <Trash2 size={32} className="text-destructive" />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">
          Delete Transaction?
        </h2>

        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          This action cannot be undone. Are you sure you want to permanently delete this?
        </p>

        <div className="bg-muted/30 rounded-xl p-4 mb-8 text-left border border-border/50">
          <p className="text-sm font-semibold text-foreground truncate mb-1">
            {transaction.description.substring(0, 40)}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground capitalize">{transaction.category}</span>
            <span className="font-bold text-destructive text-sm">₹ {transaction.amount}</span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-muted border border-border transition-all duration-200 active:scale-[0.98] text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-3 rounded-xl bg-destructive text-destructive-foreground font-bold hover:bg-destructive/90 transition-all duration-200 active:scale-[0.98] shadow-lg text-sm"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
