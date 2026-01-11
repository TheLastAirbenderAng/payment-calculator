import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export function BreakdownModal({
  open,
  onClose,
  onSave,
  saving,
  data,
}) {
  if (!data) return null

  const {
    situation,
    payerName,
    currency,
    items,
    itemsSubtotal,
    hasAdditionalCharges,
    additionalCharges,
    chargesShare,
    pendingDebt,
    calculatedTotal,
  } = data

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{situation}</DialogTitle>
          <DialogDescription>Paying to: {payerName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Items List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Items</h4>
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity, currency)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Items Subtotal</span>
              <span>{formatCurrency(itemsSubtotal, currency)}</span>
            </div>
          </div>

          {/* Additional Charges */}
          {hasAdditionalCharges && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Additional Charges
              </h4>
              {additionalCharges.serviceCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Service Charge</span>
                  <span>{formatCurrency(additionalCharges.serviceCharge, currency)}</span>
                </div>
              )}
              {additionalCharges.deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(additionalCharges.deliveryFee, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Split among {additionalCharges.splitAmong} people</span>
                <span>Your share: {formatCurrency(chargesShare, currency)}</span>
              </div>
            </div>
          )}

          {/* Pending Debt */}
          {pendingDebt !== 0 && (
            <div className="flex justify-between text-sm">
              <span>Pending Debt</span>
              <span className={pendingDebt > 0 ? "text-destructive" : "text-green-600"}>
                {pendingDebt > 0 ? "+" : ""}
                {formatCurrency(pendingDebt, currency)}
              </span>
            </div>
          )}

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total to Pay</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(calculatedTotal, currency)}
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save to History"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
