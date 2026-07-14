import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useCart, useAuth } from "../context/AppProviders.jsx";
import { formatKES } from "../utils/currency.js";
import { createOrder } from "../services/orderService.js";
import { decrementInventory, getProduct } from "../services/productService.js";
import { firebaseReady } from "../firebase/config.jsx";
import { useSettings } from "../services/settingsService.js";
import { findCoupon, applyCoupon } from "../services/couponService.js";
import { buildOrderMessage } from "../utils/orderMessage";
import { waLink } from "../utils/whatsapp.js";
import { pushNotification } from "../services/notifications.js";

export const Route = createFileRoute("/checkout")({
  component: Checkout
});

const steps = ["Details", "Delivery", "Summary", "Confirm"];

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    city: "Nairobi",
    country: "Kenya",
    method: "whatsapp",
    notes: "",
  });

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const shipping = useMemo(
    () => subtotal === 0 || subtotal > (settings.freeDeliveryOver || 5000) ? 0 : (settings.deliveryFee || 300),
    [subtotal, settings.freeDeliveryOver, settings.deliveryFee]
  );

  const discount = useMemo(
    () => applyCoupon(subtotal, coupon),
    [subtotal, coupon]
  );

  const total = useMemo(
    () => Math.max(0, subtotal - discount) + shipping,
    [subtotal, discount, shipping]
  );

  const tryCoupon = async () => {
    if (!couponCode) return;
    const c = await findCoupon(couponCode);
    if (!c) {
      setCoupon(null);
      return Swal.fire({
        icon: "error",
        title: "Invalid or expired coupon"
      });
    }
    if (c.minSubtotal && subtotal < c.minSubtotal) {
      setCoupon(null);
      return Swal.fire({
        icon: "info",
        title: "Not eligible",
        text: `Minimum subtotal ${formatKES(c.minSubtotal)}`
      });
    }
    setCoupon(c);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Coupon applied`,
      timer: 1400,
      showConfirmButton: false
    });
  };

  const placeOrder = async () => {
    if (items.length === 0) {
      return Swal.fire({
        icon: "error",
        title: "Empty cart",
        text: "Your cart is empty. Add items before checking out."
      });
    }

    if (!form.fullName || !form.phone) {
      return Swal.fire({
        icon: "error",
        title: "Missing information",
        text: "Please fill in your name and phone number."
      });
    }

    setProcessing(true);
    try {
      // Determine seller from cart
      let sellerInfo = {
        sellerId: null,
        sellerName: settings.storeName,
        sellerWhatsapp: settings.whatsapp
      };

      if (firebaseReady && items.length) {
        const products = await Promise.all(
          items.map((i) => getProduct(i.productId))
        );
        const sellerIds = [...new Set(
          products.map((p) => p?.sellerId).filter(Boolean)
        )];

        if (sellerIds.length > 1) {
          setProcessing(false);
          return Swal.fire({
            icon: "info",
            title: "One seller per order",
            text: "Your bag has items from multiple sellers. Please checkout with one seller at a time."
          });
        }

        const seller = products.find((p) => p?.sellerId);
        if (seller) {
          sellerInfo = {
            sellerId: seller.sellerId,
            sellerName: seller.sellerName || settings.storeName,
            sellerWhatsapp: seller.sellerWhatsapp || settings.whatsapp,
          };
        }
      }

      // Prepare order data
      const orderData = {
        userId: user?.uid || null,
        customer: {
          uid: user?.uid || null,
          fullName: form.fullName,
          phone: form.phone,
          email: form.email
        },
        shipping: {
          address: form.address,
          city: form.city,
          country: form.country,
          notes: form.notes,
          cost: shipping
        },
        items,
        subtotal,
        discount,
        total,
        coupon: coupon ? { code: coupon.code, id: coupon.id } : null,
        payment: { method: form.method, status: "pending" },
        ...sellerInfo,
        status: "pending",
      };

      // Create order in Firestore
      let orderId = null;
      if (firebaseReady) {
        orderId = await createOrder(orderData);
        try {
          await decrementInventory(items);
        } catch (_) {
          // Non-blocking - continue even if inventory update fails
        }

        // Notify seller
        if (sellerInfo.sellerId) {
          await pushNotification({
            sellerId: sellerInfo.sellerId,
            type: "order",
            title: "New order received",
            body: `${form.fullName} — ${formatKES(total)}`,
            orderId,
          });
        }
      }

      // Handle HashPay STK push
      if (form.method === "hashpay" && firebaseReady) {
        const res = await fetch("/api/stk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: form.phone,
            amount: total,
            reference: `MN-${Date.now()}`
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Payment initiation failed");

        if (!data.mock) {
          await Swal.fire({
            icon: "info",
            title: "Check your phone",
            text: "Enter your M-Pesa PIN to complete payment."
          });
        }
      }

      // Build WhatsApp message and redirect
      // Build WhatsApp message
const message = buildOrderMessage({
  order: {
    ...orderData,
    id: orderId,
  },
  storeName: sellerInfo?.sellerName || "Maison Noir",
});
      const link = waLink(message)

      clear();
      navigate({
  to: "/order-success",
  search: orderId ? { id: orderId } : {},
});

setTimeout(() => {
window.open(link, "_self");
}, 500);

    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Order failed",
        text: e.message
      });
    } finally {
      setProcessing(false);
    }
  };

  const paymentOptions = [
    { v: "hashpay", label: "M-Pesa (HashPay STK Push)" },
    { v: "whatsapp", label: "WhatsApp — talk to us(recommended)" },
    { v: "cod", label: "Cash on Delivery" },
    // { v: "bank", label: "Bank Transfer" },
  ];

  return (
    <div className="min-h-screen bg-secondary py-4 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto bg-background rounded-2xl shadow-luxe overflow-hidden">
        {/* Progress steps */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      step >= i
                        ? "bg-accent text-ink"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step > i ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block ${
                    step >= i ? "text-ink" : "text-muted-foreground"
                  }`}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 w-full mx-2 ${
                    step > i ? "bg-accent" : "bg-secondary"
                  }`} style={{ minWidth: "40px" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="p-6">
          {/* Step 0: Details */}
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl">Your Details</h2>
              <p className="text-sm text-muted-foreground">
                We'll use this information for your order.
              </p>

              <div className="space-y-3">
                <label className="text-sm block">
                  Full Name
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => upd("fullName", e.target.value)}
                    className="mt-1 w-full px-4 py-2.5 rounded-md border"
                  />
                </label>
                <label className="text-sm block">
                  Phone
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => upd("phone", e.target.value)}
                    className="mt-1 w-full px-4 py-2.5 rounded-md border"
                  />
                </label>
                <label className="text-sm block">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => upd("email", e.target.value)}
                    className="mt-1 w-full px-4 py-2.5 rounded-md border"
                  />
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 1: Delivery */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl">Delivery Information</h2>
              <p className="text-sm text-muted-foreground">
                Where should we deliver your order?
              </p>

              <div className="space-y-3">
                <label className="text-sm block">
                  Address
                  <textarea
                    required
                    value={form.address}
                    onChange={(e) => upd("address", e.target.value)}
                    rows="2"
                    className="mt-1 w-full px-4 py-2.5 rounded-md border"
                    placeholder="Street address, apartment, etc."
                  />
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="text-sm block">
                    City
                    <input
                      required
                      value={form.city}
                      onChange={(e) => upd("city", e.target.value)}
                      className="mt-1 w-full px-4 py-2.5 rounded-md border"
                    />
                  </label>
                  <label className="text-sm block">
                    Country
                    <input
                      required
                      value={form.country}
                      onChange={(e) => upd("country", e.target.value)}
                      className="mt-1 w-full px-4 py-2.5 rounded-md border"
                    />
                  </label>
                </div>
                <label className="text-sm block">
                  Delivery Notes (optional)
                  <textarea
                    value={form.notes}
                    onChange={(e) => upd("notes", e.target.value)}
                    rows="2"
                    className="mt-1 w-full px-4 py-2.5 rounded-md border"
                    placeholder="Special instructions for delivery..."
                  />
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 2: Summary */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl">Order Summary</h2>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Your Items</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      className="flex gap-3 items-center p-2 rounded border"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover bg-secondary"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.color?.name} · {item.size?.label} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        {formatKES(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 px-4 py-2.5 rounded-md border text-sm"
                  />
                  <button
                    type="button"
                    onClick={tryCoupon}
                    className="px-4 py-2 rounded-full border text-sm"
                  >
                    Apply
                  </button>
                </div>
                {coupon && (
                  <p className="text-xs text-emerald-700">
                    Coupon <b>{coupon.code}</b> applied — you save {formatKES(discount)}.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm & Payment */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl">Confirm & Send</h2>
              <p className="text-sm text-muted-foreground mb-4">
                We'll place your order and open WhatsApp so that you can track
                delivery and payment with us directly.
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm mb-2">Payment Method</h3>
                {paymentOptions.map((o) => (
                  <label
                    key={o.v}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                      form.method === o.v ? "border-accent bg-accent/5" : "hover:bg-secondary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={form.method === o.v}
                      onChange={() => upd("method", o.v)}
                      className="accent-accent"
                    />
                    <span className="text-sm">{o.label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6 space-y-1 text-sm">
                <h3 className="font-semibold text-sm mb-2">Order Total</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatKES(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatKES(shipping)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount</span>
                      <span>−{formatKES(discount)}</span>
                    </div>
                  )}
                  <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="font-display">{formatKES(total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 rounded-full border text-sm"
              >
                Back
              </button>
            )}
            <button
              onClick={step < 3 ? () => setStep(step + 1) : placeOrder}
              disabled={processing}
              className="btn-gold px-8 py-2.5 rounded-full font-medium disabled:opacity-60 flex-1 sm:flex-none"
            >
              {processing
                ? "Processing..."
                : step < 3
                  ? "Continue"
                  : `Place Order · ${formatKES(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}