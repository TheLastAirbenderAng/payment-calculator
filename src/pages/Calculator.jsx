import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { saveEntry } from "@/lib/firestore"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ItemRow } from "@/components/calculator/ItemRow"
import { BreakdownModal } from "@/components/calculator/BreakdownModal"
import { Plus, Calculator as CalculatorIcon } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency, USD_TO_PHP_RATE } from "@/lib/utils"

const createEmptyItem = () => ({
  name: "",
  price: "",
  quantity: "1",
})

export default function Calculator() {
  const { user } = useAuth()
  
  // Form state
  const [situation, setSituation] = useState("")
  const [payerName, setPayerName] = useState("")
  const [pendingDebt, setPendingDebt] = useState("")
  const [currency, setCurrency] = useState("PHP")
  const [items, setItems] = useState([createEmptyItem()])
  const [hasAdditionalCharges, setHasAdditionalCharges] = useState(false)
  const [serviceCharge, setServiceCharge] = useState("")
  const [deliveryFee, setDeliveryFee] = useState("")
  const [splitAmong, setSplitAmong] = useState("2")

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [breakdownData, setBreakdownData] = useState(null)
  const [saving, setSaving] = useState(false)

  // Calculate items subtotal
  const itemsSubtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0
    const quantity = parseInt(item.quantity) || 0
    return sum + price * quantity
  }, 0)

  // Calculate charges share
  const chargesShare = hasAdditionalCharges
    ? ((parseFloat(serviceCharge) || 0) + (parseFloat(deliveryFee) || 0)) /
      (parseInt(splitAmong) || 1)
    : 0

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

  // Validate form
  const validateForm = () => {
    if (!situation.trim()) {
      toast.error("Please enter what this expense is for")
      return false
    }
    if (!payerName.trim()) {
      toast.error("Please enter who paid")
      return false
    }
    
    const validItems = items.filter(
      (item) => item.name.trim() && parseFloat(item.price) > 0
    )
    if (validItems.length === 0) {
      toast.error("Please add at least one item with a name and price")
      return false
    }

    if (hasAdditionalCharges) {
      if (parseInt(splitAmong) < 1) {
        toast.error("Number of people must be at least 1")
        return false
      }
    }

    return true
  }

  // Handle calculate
  const handleCalculate = () => {
    if (!validateForm()) return

    const validItems = items.filter(
      (item) => item.name.trim() && parseFloat(item.price) > 0
    ).map((item) => ({
      name: item.name.trim(),
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity) || 1,
    }))

    const debt = parseFloat(pendingDebt) || 0
    const total = itemsSubtotal + chargesShare + debt

    const data = {
      situation: situation.trim(),
      payerName: payerName.trim(),
      currency,
      items: validItems,
      itemsSubtotal,
      hasAdditionalCharges,
      additionalCharges: hasAdditionalCharges
        ? {
            serviceCharge: parseFloat(serviceCharge) || 0,
            deliveryFee: parseFloat(deliveryFee) || 0,
            splitAmong: parseInt(splitAmong) || 1,
          }
        : null,
      chargesShare,
      pendingDebt: debt,
      calculatedTotal: total,
    }

    setBreakdownData(data)
    setShowModal(true)
  }

  // Handle save
  const handleSave = async () => {
    if (!breakdownData) return

    setSaving(true)
    try {
      await saveEntry(user.uid, {
        situation: breakdownData.situation,
        payerName: breakdownData.payerName,
        currency: breakdownData.currency,
        items: breakdownData.items,
        pendingDebt: breakdownData.pendingDebt,
        hasAdditionalCharges: breakdownData.hasAdditionalCharges,
        additionalCharges: breakdownData.additionalCharges,
        calculatedTotal: breakdownData.calculatedTotal,
      })

      toast.success("Entry saved to history!")
      setShowModal(false)
      
      // Reset form
      setSituation("")
      setPayerName("")
      setPendingDebt("")
      setItems([createEmptyItem()])
      setHasAdditionalCharges(false)
      setServiceCharge("")
      setDeliveryFee("")
      setSplitAmong("2")
    } catch (error) {
      console.error("Error saving entry:", error)
      toast.error("Failed to save entry. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalculatorIcon className="h-5 w-5" />
              New Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Situation */}
            <div className="space-y-2">
              <Label htmlFor="situation">What's this for?</Label>
              <Input
                id="situation"
                placeholder="e.g., Dinner @ Jollibee, Movie tickets"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
              />
            </div>

            {/* Payer Name */}
            <div className="space-y-2">
              <Label htmlFor="payer">Who paid?</Label>
              <Input
                id="payer"
                placeholder="e.g., Juan, Maria"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
              />
            </div>

            {/* Pending Debt */}
            <div className="space-y-2">
              <Label htmlFor="pending">
                Pending debt to this person
                <span className="text-muted-foreground text-xs ml-2">
                  (negative if they owe you)
                </span>
              </Label>
              <Input
                id="pending"
                type="number"
                placeholder="0"
                value={pendingDebt}
                onChange={(e) => setPendingDebt(e.target.value)}
              />
            </div>

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
            <div className="space-y-3">
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
                Subtotal: {formatCurrency(itemsSubtotal, currency)}
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
                    Your share: {formatCurrency(chargesShare, currency)}
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
      </main>

      {/* Breakdown Modal */}
      <BreakdownModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        saving={saving}
        data={breakdownData}
      />
    </div>
  )
}
