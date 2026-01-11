import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getEntries } from "@/lib/firestore"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EntryCard } from "@/components/history/EntryCard"
import { ArrowLeft, Calculator, FileText } from "lucide-react"

export default function History() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold ml-2">History</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
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

        {/* Entries List */}
        {!loading && !error && entries.length > 0 && (
          <div className="space-y-4">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
