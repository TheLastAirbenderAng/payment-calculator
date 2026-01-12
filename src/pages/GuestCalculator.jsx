import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ItemRow } from "@/components/calculator/ItemRow"
import { Plus, Calculator as CalculatorIcon, LogIn, Moon, Sun } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency, USD_TO_PHP_RATE } from "@/lib/utils"
import { calculateGuestTotal, validateGuestItems } from "@/lib/guest"

const createEmptyItem = () => ({
  name: "",
  price: "",
  quantity: "1",
})

export default function GuestCalculator() {
  const { theme, toggleTheme } = useTheme()
  
  // Form state
  const [currency, setCurrency] = useState("PHP")
  const [items, setItems] = useState([createEmptyItem()])
  const [hasAdditionalCharges, setHasAdditionalCharges] = useState(false)
  const [serviceCharge, setServiceCharge] = useState("")
  const [deliveryFee, setDeliveryFee] = useState("")
  const [splitAmong, setSplitAmong] = useState("2")

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [result, setResult] = useState(null)

  // Calculate live totals for display
  const liveResult = calculateGuestTotal(
    items.map(item => ({
      ...item,
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity) || 0,
    })),
    hasAdditionalCharges ? {
      serviceCharge: parseFloat(serviceCharge) || 0,
      deliveryFee: parseFloat(deliveryFee) || 0,
      splitAmong: parseInt(splitAmong) || 1,
    } : null
  )

  // Handle item changes
  const handleItemChange = (index, updatedItem) => {
    const newItems = [...items]
    newItems[index] = updatedItem
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, createEmptyItem()])
  }

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  // Handle calculate
  const handleCalculate = () => {
    const parsedItems = items.map(item => ({
      name: item.name.trim(),
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity) || 1,
    }))

    if (!validateGuestItems(parsedItems)) {
      toast.error("Please add at least one item with a name and price")
      return
    }

    const charges = hasAdditionalCharges ? {
      serviceCharge: parseFloat(serviceCharge) || 0,
      deliveryFee: parseFloat(deliveryFee) || 0,
      splitAmong: parseInt(splitAmong) || 1,
    } : null

    const calculatedResult = calculateGuestTotal(parsedItems, charges)
    setResult({
      ...calculatedResult,
      items: parsedItems.filter(item => item.name && item.price > 0),
      charges,
      currency,
    })
    setShowModal(true)
  }

  // Reset form
  const handleReset = () => {
    setItems([createEmptyItem()])
    setHasAdditionalCharges(false)
    setServiceCharge("")
    setDeliveryFee("")
    setSplitAmong("2")
    setShowModal(false)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header for Guest */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <CalculatorIcon className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Utang Tracker</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Guest</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalculatorIcon className="h-5 w-5" />
              Quick Calculate
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Calculate your share without signing in. Results won't be saved.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Currency */}
            <div className="space-y-2">
              <Label>Currency</Label>
              <ToggleGroup
                type="single"
                value={currency}
                onValueChange={(value) => value && setCurrency(value)}
                className="justify-start"
              >
                <ToggleGroupItem value="PHP" className="px-6">
                  PHP
                </ToggleGroupItem>
                <ToggleGroupItem value="USD" className="px-6">
                  USD
                </ToggleGroupItem>
              </ToggleGroup>
              {currency === "USD" && (
                <p className="text-xs text-muted-foreground">
                  Approximate rate: 1 USD = {USD_TO_PHP_RATE} PHP
                </p>
              )}
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <Label>Items you owe</Label>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <ItemRow
                    key={index}
                    item={item}
                    index={index}
                    onChange={handleItemChange}
                    onRemove={removeItem}
                    canRemove={items.length > 1}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <div className="text-right text-sm text-muted-foreground">
                Subtotal: {formatCurrency(liveResult.itemsSubtotal, currency)}
              </div>
            </div>

            {/* Additional Charges */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="additional-charges">Additional Charges</Label>
                <Switch
                  id="additional-charges"
                  checked={hasAdditionalCharges}
                  onCheckedChange={setHasAdditionalCharges}
                />
              </div>

              {hasAdditionalCharges && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">Service Charge</Label>
                      <Input
                        id="service"
                        type="number"
                        placeholder="0"
                        value={serviceCharge}
                        onChange={(e) => setServiceCharge(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery">Delivery Fee</Label>
                      <Input
                        id="delivery"
                        type="number"
                        placeholder="0"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="split">Split among how many people?</Label>
                    <Input
                      id="split"
                      type="number"
                      value={splitAmong}
                      onChange={(e) => setSplitAmong(e.target.value)}
                      min="1"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your share: {formatCurrency(liveResult.chargesShare, currency)}
                  </p>
                </div>
              )}
            </div>

            {/* Calculate Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleCalculate}
            >
              <CalculatorIcon className="h-5 w-5 mr-2" />
              Calculate
            </Button>
          </CardContent>
        </Card>

        {/* Sign up prompt */}
        <Card className="mt-6">
          <CardContent className="py-4">
            <p className="text-sm text-center text-muted-foreground">
              Want to save your calculations?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Create a free account
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Result Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Total</DialogTitle>
          </DialogHeader>
          
          {result && (
            <div className="space-y-4">
              {/* Items */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Items</h4>
                {result.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity, result.currency)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Items Subtotal</span>
                  <span>{formatCurrency(result.itemsSubtotal, result.currency)}</span>
                </div>
              </div>

              {/* Charges */}
              {result.charges && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Additional Charges</h4>
                  {result.charges.serviceCharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Service Charge</span>
                      <span>{formatCurrency(result.charges.serviceCharge, result.currency)}</span>
                    </div>
                  )}
                  {result.charges.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>{formatCurrency(result.charges.deliveryFee, result.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Split among {result.charges.splitAmong} people</span>
                    <span>Your share: {formatCurrency(result.chargesShare, result.currency)}</span>
                  </div>
                </div>
              )}

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(result.total, result.currency)}
                  </span>
                  <p className="text-xs text-muted-foreground">{result.currency}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button onClick={handleReset}>
              New Calculation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
