// Razorpay Configuration
// For full integration, you need a backend to create orders
// This client handles the frontend checkout flow

const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID

export const isRazorpayConfigured = !!razorpayKeyId

export const getRazorpayKeyId = () => razorpayKeyId

export interface RazorpayPaymentOptions {
    amount: number // in paise (₹100 = 10000 paise)
    currency?: string
    name: string
    description?: string
    orderId?: string // from backend
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
    theme?: {
        color?: string
    }
}

export interface RazorpayPaymentResult {
    razorpay_payment_id: string
    razorpay_order_id?: string
    razorpay_signature?: string
}
