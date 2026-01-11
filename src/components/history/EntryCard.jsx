import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

export function EntryCard({ entry }) {
  return (
    <Link to={`/history/${entry.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                {formatDate(entry.createdAt)}
              </p>
              <h3 className="font-medium truncate">{entry.situation}</h3>
              <p className="text-sm text-muted-foreground">
                Paid by {entry.payerName}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="text-right">
                <p className="font-semibold text-primary">
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
