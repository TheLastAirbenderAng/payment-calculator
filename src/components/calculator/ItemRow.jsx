import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function ItemRow({ item, index, onChange, onRemove, canRemove }) {
  const handleChange = (field, value) => {
    onChange(index, { ...item, [field]: value })
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1 min-w-0">
        <Input
          placeholder="Item name"
          value={item.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-24">
        <Input
          type="number"
          placeholder="Price"
          value={item.price}
          onChange={(e) => handleChange("price", e.target.value)}
          min="0"
          step="0.01"
        />
      </div>
      <div className="w-16">
        <Input
          type="number"
          placeholder="Qty"
          value={item.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
          min="1"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="shrink-0"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}
