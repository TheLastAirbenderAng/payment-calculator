import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ChevronRight, Check } from "lucide-react"

export function EntryCard({ entry }) {
  const isPaid = entry.isPaid === true

  return (
    <Link to={`/history/${entry.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs text-muted-foreground">
                  {formatDate(entry.createdAt)}
                </p>
                <Badge variant={isPaid ? "success" : "secondary"} className="text-[10px] px-1.5 py-0">
                  {isPaid ? (
                    <>
                      <Check className="h-3 w-3 mr-0.5" />
                      Paid
                    </>
                  ) : (
                    "Unpaid"
                  )}
                </Badge>
              </div>
              <h3 className="font-medium truncate">{entry.situation}</h3>
              <p className="text-sm text-muted-foreground">
                Paid by {entry.payerName}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="text-right">
                <p className={`font-semibold ${isPaid ? "text-muted-foreground line-through" : "text-primary"}`}>
                  {formatCurrency(entry.calculatedTotal, entry.currency)}
                </p>
                <p className="text-xs text-muted-foreground">{entry.currency}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
