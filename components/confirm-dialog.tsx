"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => void
  onOpenChange?: (open: boolean) => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  loading = false,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir="rtl" className="text-right">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription className="text-right">{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 flex-row-reverse">
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (!loading) {
                onConfirm()
              }
            }}
            disabled={loading}
          >
            {loading ? "جاري التنفيذ..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

