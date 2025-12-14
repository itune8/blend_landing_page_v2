import { useRazorpay } from 'react-razorpay'
import type { RazorpayOrderOptions } from 'react-razorpay'
import { getRazorpayKeyId, isRazorpayConfigured, type RazorpayPaymentResult } from '@/lib/razorpay'

export interface PaymentOptions {
    amount: number // in rupees
    eventName: string
    eventDescription?: string
    userName?: string
    userEmail?: string
    userPhone?: string
    onSuccess: (result: RazorpayPaymentResult) => void
    onError: (error: Error) => void
}

export function usePayment() {
    const { Razorpay, isLoading, error } = useRazorpay()

    const initiatePayment = async (options: PaymentOptions) => {
        if (!isRazorpayConfigured) {
            options.onError(new Error('Razorpay not configured'))
            return
        }

        const keyId = getRazorpayKeyId()
        if (!keyId) {
            options.onError(new Error('Razorpay Key ID not found'))
            return
        }

        // Convert rupees to paise
        const amountInPaise = Math.round(options.amount * 100)

        const razorpayOptions: RazorpayOrderOptions = {
            key: keyId,
            amount: amountInPaise,
            currency: 'INR',
            name: 'Blend Events',
            description: options.eventName,
            prefill: {
                name: options.userName || '',
                email: options.userEmail || '',
                contact: options.userPhone || '',
            },
            theme: {
                color: '#14b8a6', // teal-500
            },
            handler: (response) => {
                options.onSuccess({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                })
            },
            modal: {
                ondismiss: () => {
                    options.onError(new Error('Payment cancelled'))
                },
            },
        }

        try {
            // Note: In production, order_id should come from a backend
            // For demo/test mode, Razorpay allows payments without order_id
            const razorpayInstance = new Razorpay(razorpayOptions as any)
            razorpayInstance.open()
        } catch (err) {
            options.onError(err as Error)
        }
    }

    return {
        initiatePayment,
        isLoading,
        error,
        isConfigured: isRazorpayConfigured,
    }
}
