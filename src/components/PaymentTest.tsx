import { useState } from 'react'
import { usePayment } from '@/hooks/usePayment'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, CreditCard, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PaymentTest() {
    const { initiatePayment, isLoading, isConfigured } = usePayment()
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [paymentId, setPaymentId] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleTestPayment = () => {
        setPaymentStatus('idle')
        setPaymentId(null)
        setErrorMessage(null)

        initiatePayment({
            amount: 100, // ₹100 test payment
            eventName: 'Test Event Payment',
            eventDescription: 'Testing Razorpay integration',
            userName: 'Test User',
            userEmail: 'test@blend.com',
            onSuccess: (result) => {
                setPaymentStatus('success')
                setPaymentId(result.razorpay_payment_id)
            },
            onError: (error) => {
                setPaymentStatus('error')
                setErrorMessage(error.message)
            },
        })
    }

    return (
        <div className="min-h-screen bg-[#111] text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#1a1a1a] rounded-2xl border border-white/10 p-8">
                <Link to="/events" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                </Link>

                <h1 className="text-2xl font-bold mb-2">Payment Gateway Test</h1>
                <p className="text-gray-400 text-sm mb-6">
                    Test the Razorpay payment integration with a ₹100 test transaction.
                </p>

                {!isConfigured ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                        <p className="text-red-400 text-sm">
                            ⚠️ Razorpay is not configured. Add VITE_RAZORPAY_KEY_ID to your .env.local file.
                        </p>
                    </div>
                ) : (
                    <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 mb-6">
                        <p className="text-teal-400 text-sm">
                            ✅ Razorpay is configured and ready!
                        </p>
                    </div>
                )}

                {paymentStatus === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 text-green-400 mb-2">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Payment Successful!</span>
                        </div>
                        <p className="text-green-300/80 text-xs font-mono">
                            Payment ID: {paymentId}
                        </p>
                    </div>
                )}

                {paymentStatus === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 text-red-400 mb-2">
                            <XCircle className="w-5 h-5" />
                            <span className="font-medium">Payment Failed</span>
                        </div>
                        <p className="text-red-300/80 text-sm">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <Button
                    onClick={handleTestPayment}
                    disabled={isLoading || !isConfigured}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium py-3 rounded-xl flex items-center justify-center gap-2"
                >
                    <CreditCard className="w-5 h-5" />
                    {isLoading ? 'Loading...' : 'Pay ₹100 (Test)'}
                </Button>

                <p className="text-gray-500 text-xs text-center mt-4">
                    Use test card: 4111 1111 1111 1111, any future expiry, any CVV
                </p>
            </div>
        </div>
    )
}
