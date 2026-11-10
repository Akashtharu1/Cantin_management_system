import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Clock,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  ArrowRight,
  AlertTriangle,
  Receipt
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartTax,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    pickupSlots,
    selectedSlot,
    setSelectedSlot,
    currentUser,
    setActiveTrackedOrder,
    setCurrentView,
    showToast,
  } = useApp();

  const [customerNotes, setCustomerNotes] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'REVIEW' | 'UPI_QR' | 'CONFIRMING' | 'SUCCESS'>('REVIEW');
  const [transactionRef, setTransactionRef] = useState('');
  const [qrCountdown, setQrCountdown] = useState(300); // 5 mins
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  // Reset step when cart opens/closes
  useEffect(() => {
    if (!isCartOpen) {
      setPaymentStep('REVIEW');
      setIsCheckingOut(false);
    }
  }, [isCartOpen]);

  // QR countdown timer
  useEffect(() => {
    let timer: any;
    if (paymentStep === 'UPI_QR' && qrCountdown > 0) {
      timer = setInterval(() => setQrCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [paymentStep, qrCountdown]);

  if (!isCartOpen) return null;

  const handleStartPayment = async () => {
    if (!selectedSlot) {
      showToast('Please select a pickup time slot first');
      return;
    }
    if (selectedSlot.reservedCount >= selectedSlot.capacity) {
      showToast('Selected slot is full. Please choose another slot.');
      return;
    }

    try {
      setIsCheckingOut(true);
      const res = await ApiService.createUpiPayment(cartTotal, `BMSIT-${currentUser.fullName.split(' ')[0]}`);
      setTransactionRef(res.transactionId);
      setQrCountdown(300);
      setPaymentStep('UPI_QR');
    } catch (err: any) {
      showToast(err.message || 'Failed to initialize payment');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSimulateUpiApprove = async () => {
    try {
      setPaymentStep('CONFIRMING');

      // 1. Verify payment on backend
      await ApiService.verifyPayment(transactionRef);

      // 2. Submit order to backend
      const orderPayload = {
        userId: currentUser.id,
        customerName: currentUser.fullName,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phoneNumber || '+91 98450 12345',
        pickupSlotId: selectedSlot?.id || 'slot-3',
        pickupSlotLabel: selectedSlot?.displayLabel || '12:15 PM – 12:30 PM',
        subtotal: cartSubtotal,
        tax: cartTax,
        totalAmount: cartTotal,
        paymentMethod: 'UPI_QR',
        transactionId: transactionRef,
        customerNotes,
        items: cart.map((i) => ({
          menuItemId: i.menuItem.id,
          name: i.menuItem.name,
          quantity: i.quantity,
          unitPrice: i.menuItem.price,
          subtotal: i.menuItem.price * i.quantity,
          foodType: i.menuItem.foodType,
          imageUrl: i.menuItem.imageUrl,
        })),
      };

      const createdOrder = await ApiService.createOrder(orderPayload as any);
      setGeneratedToken(createdOrder.tokenNumber);
      setPaymentStep('SUCCESS');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti optional
      }

      // Clear cart
      clearCart();
      setActiveTrackedOrder(createdOrder);
    } catch (err: any) {
      setPaymentStep('UPI_QR');
      showToast(err.message || 'Payment simulation failed. Please try again.');
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {paymentStep === 'SUCCESS' ? 'Order Confirmed' : 'Your Order Bag'}
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {/* --- STEP: REVIEW CART --- */}
            {paymentStep === 'REVIEW' && (
              <>
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-4">
                      <Receipt className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Your cart is currently empty
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
                      Add your favorite dosa, thali, or beverages from the menu.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Browse Canteen Menu
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Item list */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Items ({cart.length})</span>
                        <button
                          onClick={clearCart}
                          className="text-rose-500 hover:text-rose-600 font-medium cursor-pointer"
                        >
                          Clear all
                        </button>
                      </div>

                      {cart.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  item.menuItem.foodType === 'VEG' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {item.menuItem.name}
                              </h4>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                              ₹{item.menuItem.price} each
                            </span>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, -1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded cursor-pointer"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-5 text-center text-xs font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums w-12 text-right">
                              ₹{item.menuItem.price * item.quantity}
                            </span>

                            <button
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pickup Slot Selection */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Select Pickup Slot (Today)</span>
                        </label>
                        <span className="text-[11px] text-slate-500">15-Min Windows</span>
                      </div>

                      <div className="space-y-1.5">
                        {pickupSlots.map((slot) => {
                          const isFull = slot.reservedCount >= slot.capacity;
                          const isSelected = selectedSlot?.id === slot.id;
                          const spotsLeft = slot.capacity - slot.reservedCount;

                          return (
                            <button
                              key={slot.id}
                              disabled={isFull}
                              onClick={() => setSelectedSlot(slot)}
                              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                                isFull
                                  ? 'opacity-50 bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                                  : isSelected
                                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-600'
                                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isFull ? 'bg-rose-500' : isSelected ? 'bg-emerald-600' : 'bg-slate-400'
                                  }`}
                                />
                                <span>{slot.displayLabel}</span>
                              </div>

                              <div className="text-[11px] font-mono tabular-nums">
                                {isFull ? (
                                  <span className="text-rose-500 font-semibold">Slot Full</span>
                                ) : (
                                  <span className="text-slate-500 dark:text-slate-400">
                                    {spotsLeft} spots left
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Kitchen Instructions */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Preparation Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="e.g. Extra coconut chutney, less spicy..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* --- STEP: UPI QR PAYMENT SIMULATOR --- */}
            {paymentStep === 'UPI_QR' && (
              <div className="text-center py-4 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Official BMSIT Canteen Sandbox Gateway</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Scan UPI QR to Pay
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pay using GPay, PhonePe, Paytm, or BHIM app
                  </p>
                </div>

                {/* High Contrast Simulated QR Code Card */}
                <div className="relative mx-auto w-56 h-56 p-3 bg-white rounded-2xl border-2 border-emerald-500 shadow-md flex flex-col items-center justify-center">
                  {/* Decorative QR Pattern */}
                  <div className="w-48 h-48 bg-slate-950 p-2.5 rounded-xl flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-12 h-12 bg-white rounded-md p-1.5 flex items-center justify-center">
                        <div className="w-full h-full bg-slate-950 rounded-xs flex items-center justify-center">
                          <div className="w-3 h-3 bg-white" />
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-md p-1.5 flex items-center justify-center">
                        <div className="w-full h-full bg-slate-950 rounded-xs flex items-center justify-center">
                          <div className="w-3 h-3 bg-white" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                        <QrCode className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="w-12 h-12 bg-white rounded-md p-1.5 flex items-center justify-center">
                        <div className="w-full h-full bg-slate-950 rounded-xs flex items-center justify-center">
                          <div className="w-3 h-3 bg-white" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end justify-end">
                        <div className="w-4 h-4 bg-white" />
                        <div className="w-6 h-2 bg-emerald-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount & Reference */}
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 mb-1">
                    <span>Payable Amount:</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                      ₹{cartTotal}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                    <span>UPI ID:</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                      bmsitcanteen@upi
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 mt-1">
                    <span>Expires in:</span>
                    <span className="font-mono text-amber-600 font-semibold tabular-nums">
                      {formatSeconds(qrCountdown)}
                    </span>
                  </div>
                </div>

                {/* Simulation Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleSimulateUpiApprove}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Simulate Mobile UPI Payment Approval</span>
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Clicking above triggers the webhook payment verification callback instantly.
                  </p>
                </div>
              </div>
            )}

            {/* --- STEP: CONFIRMING PAYMENT --- */}
            {paymentStep === 'CONFIRMING' && (
              <div className="text-center py-20 space-y-4">
                <div className="w-14 h-14 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Verifying UPI Payment...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Securing slot {selectedSlot?.displayLabel} and generating token.
                </p>
              </div>
            )}

            {/* --- STEP: SUCCESS TOKEN ISSUED --- */}
            {paymentStep === 'SUCCESS' && (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    Payment Successful!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your meal order has been queued in the kitchen.
                  </p>
                </div>

                {/* Digital Token Card */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-2xl shadow-xl max-w-xs mx-auto border-2 border-emerald-400/40">
                  <span className="text-[11px] uppercase tracking-widest text-emerald-200 font-semibold block">
                    BMSIT Pre-Order Token
                  </span>
                  <div className="text-5xl font-black font-mono tracking-tight my-2 tabular-nums">
                    {generatedToken || 'C102'}
                  </div>
                  <div className="text-xs text-emerald-100 font-medium pt-2 border-t border-emerald-500/50">
                    Pickup Slot: <span className="font-bold">{selectedSlot?.displayLabel}</span>
                  </div>
                  <div className="text-[11px] text-emerald-200 mt-1">
                    Status: <span className="uppercase font-semibold">RECEIVED</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setCurrentView('track');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    <span>View Live Preparation Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setCurrentView('menu');
                    }}
                    className="w-full py-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 cursor-pointer"
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer (Price Breakdown & Action) */}
          {paymentStep === 'REVIEW' && cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              {/* Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>GST & Canteen Cess (5%)</span>
                  <span className="font-mono tabular-nums">₹{cartTax}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Amount</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                disabled={isCheckingOut}
                onClick={handleStartPayment}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
              >
                <span>Proceed to UPI QR Payment (₹{cartTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
