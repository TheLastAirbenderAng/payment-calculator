import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getEntry, deleteEntry } from "@/lib/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowLeft, Trash2, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function HistoryDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const data = await getEntry(user.uid, id)
        if (!data) {
          setError("Entry not found")
        } else {
          setEntry(data)
        }
      } catch (err) {
        console.error("Error fetching entry:", err)
        setError("Failed to load entry")
      } finally {
        setLoading(false)
      }
    }

    fetchEntry()
  }, [user.uid, id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteEntry(user.uid, id)
      toast.success("Entry deleted")
      navigate("/history")
    } catch (err) {
      console.error("Error deleting entry:", err)
      toast.error("Failed to delete entry")
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  // Calculate items subtotal
  const itemsSubtotal = entry?.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0

  // Calculate charges share
  const chargesShare = entry?.hasAdditionalCharges && entry?.additionalCharges
    ? (entry.additionalCharges.serviceCharge + entry.additionalCharges.deliveryFee) /
      entry.additionalCharges.splitAmong
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/history">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              {entry && formatDate(entry.createdAt)}
            </span>
          </div>
          {entry && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Loading State */}
        {loading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2">{error}</h2>
            <Button variant="outline" asChild className="mt-4">
              <Link to="/history">Back to History</Link>
            </Button>
          </div>
        )}

        {/* Entry Detail */}
        {!loading && !error && entry && (
          <Card>
            <CardHeader>
              <CardTitle>{entry.situation}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Paid by {entry.payerName}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Items */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Items</h4>
                {entry.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity, entry.currency)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Items Subtotal</span>
                  <span>{formatCurrency(itemsSubtotal, entry.currency)}</span>
                </div>
              </div>

              {/* Additional Charges */}
              {entry.hasAdditionalCharges && entry.additionalCharges && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Additional Charges
                  </h4>
                  {entry.additionalCharges.serviceCharge > 0 && (
                    <div className="flex justify-between">
                      <span>Service Charge</span>
                      <span>
                        {formatCurrency(entry.additionalCharges.serviceCharge, entry.currency)}
                      </span>
                    </div>
                  )}
                  {entry.additionalCharges.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>
                        {formatCurrency(entry.additionalCharges.deliveryFee, entry.currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Split among {entry.additionalCharges.splitAmong} people</span>
                    <span>Your share: {formatCurrency(chargesShare, entry.currency)}</span>
                  </div>
                </div>
              )}

              {/* Pending Debt */}
              {entry.pendingDebt !== 0 && (
                <div className="flex justify-between">
                  <span>Pending Debt</span>
                  <span className={entry.pendingDebt > 0 ? "text-destructive" : "text-green-600"}>
                    {entry.pendingDebt > 0 ? "+" : ""}
                    {formatCurrency(entry.pendingDebt, entry.currency)}
                  </span>
                </div>
              )}

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Paid</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(entry.calculatedTotal, entry.currency)}
                  </span>
                  <p className="text-xs text-muted-foreground">{entry.currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
