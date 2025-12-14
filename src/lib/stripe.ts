import { loadStripe, type Stripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = () => {
    if (!stripePublishableKey) {
        console.warn('Stripe publishable key not found. Payment features disabled.')
        return null
    }

    if (!stripePromise) {
        stripePromise = loadStripe(stripePublishableKey)
    }

    return stripePromise
}

export const isStripeConfigured = !!stripePublishableKey
