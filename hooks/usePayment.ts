"use client"

import { useState, useCallback } from "react"

interface PaymentOptions {
    amount: number
    eventName: string
    userEmail?: string
    userName?: string
    onSuccess?: (result: { razorpay_payment_id: string }) => void
    onError?: (error: Error) => void
}

export function usePayment() {
    const [isLoading, setIsLoading] = useState(false)

    const isConfigured = typeof window !== 'undefined' &&
        !!(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)

    const initiatePayment = useCallback(async (options: PaymentOptions) => {
        if (!isConfigured) {
            console.warn('Payment not configured')
            options.onError?.(new Error('Payment gateway not configured'))
            return
        }

        setIsLoading(true)

        try {
            // Load Razorpay script dynamically
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            document.body.appendChild(script)

            script.onload = () => {
                const razorpayOptions = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: options.amount * 100, // Razorpay expects paise
                    currency: 'INR',
                    name: 'Blend Events',
                    description: options.eventName,
                    prefill: {
                        email: options.userEmail || '',
                        name: options.userName || '',
                    },
                    handler: function (response: { razorpay_payment_id: string }) {
                        setIsLoading(false)
                        options.onSuccess?.(response)
                    },
                    modal: {
                        ondismiss: function () {
                            setIsLoading(false)
                        }
                    }
                }

                const rzp = new (window as any).Razorpay(razorpayOptions)
                rzp.open()
            }
        } catch (error) {
            setIsLoading(false)
            options.onError?.(error as Error)
        }
    }, [isConfigured])

    return {
        initiatePayment,
        isLoading,
        isConfigured,
    }
}
