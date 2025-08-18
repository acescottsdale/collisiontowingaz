import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromAddress: string;
  toAddress: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
}

const QuoteModal: React.FC<QuoteModalProps> = ({
  open,
  onOpenChange,
  fromAddress,
  toAddress,
  vehicleYear,
  vehicleMake,
  vehicleModel,
}) => {
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!fromAddress.trim() || !toAddress.trim()) {
      setFormError("Please enter both from and to addresses.");
      return;
    }
    if (!formName.trim() || !formPhone.trim()) {
      setFormError("Please enter your name and phone number.");
      return;
    }
    setShowSuccess(true);
    setFormName("");
    setFormPhone("");
    setFormMessage("");
  }

  function handleClose() {
    setShowSuccess(false);
    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open && !showSuccess} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a Quote</DialogTitle>
            <DialogDescription>
              Please fill out your details and confirm your addresses.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 *:space-y-1">
            <div>
              <Label htmlFor="quoteName">Name</Label>
              <Input
                id="quoteName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="quotePhone">Phone</Label>
              <Input
                id="quotePhone"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>From Address</Label>
              <Input value={fromAddress} readOnly />
            </div>
            <div>
              <Label>To Address</Label>
              <Input value={toAddress} readOnly />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Vehicle Year</Label>
                <Input value={vehicleYear} readOnly />
              </div>
              <div>
                <Label>Vehicle Make</Label>
                <Input value={vehicleMake} readOnly />
              </div>
              <div>
                <Label>Vehicle Model</Label>
                <Input value={vehicleModel} readOnly />
              </div>
            </div>
            <div>
              <Label htmlFor="quoteMessage">Message (optional)</Label>
              <Textarea
                id="quoteMessage"
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="Describe your vehicle, location, or special instructions"
              />
            </div>
            {formError && (
              <div className="text-destructive text-sm">{formError}</div>
            )}
            <DialogFooter>
              <Button type="submit" variant="default">
                Submit
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showSuccess} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote Request Sent</DialogTitle>
            <DialogDescription>
              Thank you! Your quote request has been submitted. We will contact
              you soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuoteModal;
