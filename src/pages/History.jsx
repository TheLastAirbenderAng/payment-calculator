import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getEntries } from "@/lib/firestore"
import { filterEntriesByStatus, getEntriesSummary } from "@/lib/entries"
import { entriesToCsv, downloadCsv } from "@/lib/export"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { EntryCard } from "@/components/history/EntryCard"
import { ArrowLeft, Calculator, FileText, Download } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

export default function History() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getEntries(user.uid)
        setEntries(data)
      } catch (err) {
        console.error("Error fetching entries:", err)
        setError("Failed to load history")
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [user.uid])

  // Filter entries based on selected filter
  const filteredEntries = useMemo(() => {
    return filterEntriesByStatus(entries, filter)
  }, [entries, filter])

  // Get summary stats
  const summary = useMemo(() => {
    return getEntriesSummary(entries)
  }, [entries])

  const handleExportCsv = () => {
    if (entries.length === 0) {
      toast.error("No entries to export")
      return
    }
    const csv = entriesToCsv(entries)
    const date = new Date().toISOString().split("T")[0]
    downloadCsv(csv, `utang-tracker-${date}.csv`)
    toast.success("CSV exported successfully")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold ml-2">History</h1>
          </div>
          {entries.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Summary Card */}
        {!loading && !error && entries.length > 0 && (
          <div className="mb-6 p-4 bg-card rounded-xl border border-border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Unpaid</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(summary.totalOwed, "PHP")}
                </p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{summary.unpaidCount} unpaid</p>
                <p>{summary.paidCount} paid</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {!loading && !error && entries.length > 0 && (
          <div className="mb-4">
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(value) => value && setFilter(value)}
              className="justify-start"
            >
              <ToggleGroupItem value="all" aria-label="Show all entries">
                All ({entries.length})
              </ToggleGroupItem>
              <ToggleGroupItem value="unpaid" aria-label="Show unpaid entries">
                Unpaid ({summary.unpaidCount})
              </ToggleGroupItem>
              <ToggleGroupItem value="paid" aria-label="Show paid entries">
                Paid ({summary.paidCount})
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-border rounded-xl">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-48 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2">No entries yet</h2>
            <p className="text-muted-foreground mb-6">
              Start tracking your expenses by creating your first entry.
            </p>
            <Button asChild>
              <Link to="/">
                <Calculator className="h-4 w-4 mr-2" />
                Create Entry
              </Link>
            </Button>
          </div>
        )}

        {/* Empty Filter State */}
        {!loading && !error && entries.length > 0 && filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No {filter} entries found.
            </p>
          </div>
        )}

        {/* Entries List */}
        {!loading && !error && filteredEntries.length > 0 && (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
