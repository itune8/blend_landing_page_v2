import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface PlanFeature {
    text: string
    highlight?: boolean
}

interface PricingPlan {
    name: string
    price: { monthly: number; yearly: number }
    description: string
    features: PlanFeature[]
    cta: string
    isBrand?: boolean
}

const plans: PricingPlan[] = [
    {
        name: "Free",
        price: { monthly: 0, yearly: 0 },
        description: "Free forever",
        cta: "Get Started",
        features: [
            { text: "Unlimited events" },
            { text: "Unlimited guests" },
            { text: "500 weekly invitations" },
            { text: "Beautiful event pages" },
            { text: "Ticketing & payments" },
            { text: "Check-in app" },
            { text: "3% platform fee on paid tickets" },
        ],
    },
    {
        name: "Plus",
        price: { monthly: 29, yearly: 24 },
        description: "per month, billed yearly",
        cta: "Upgrade to Plus",
        isBrand: true,
        features: [
            { text: "Everything in Free, and:" },
            { text: "5,000 weekly invitations", highlight: true },
            { text: "0% platform fee", highlight: true },
            { text: "Custom branding" },
            { text: "Priority support" },
            { text: "Advanced analytics" },
            { text: "Team collaboration" },
        ],
    },
]

const enterpriseFeatures = [
    "Dedicated Account Manager",
    "Custom Integrations",
    "SSO & SAML",
    "SLA Guarantee",
    "Advanced Security",
    "Volume Discounts",
]

function PricingCard({ plan, isYearly, onGetStarted }: { plan: PricingPlan; isYearly: boolean; onGetStarted: () => void }) {
    const price = isYearly ? plan.price.yearly : plan.price.monthly

    return (
        <motion.div
            className={cn(
                "bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/5 rounded-xl p-5",
                "hover:shadow-lg transition-shadow duration-300"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
        >
            {/* Plan header */}
            <div className="mb-4">
                <h3 className={cn(
                    "text-lg font-bold mb-2",
                    plan.isBrand && "text-cranberry"
                )}>
                    {plan.name}
                    {plan.isBrand && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-cranberry/10 text-cranberry">
                            Most Popular
                        </span>
                    )}
                </h3>

                <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={price}
                            className="text-4xl font-medium"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            ${price}
                        </motion.span>
                    </AnimatePresence>
                    {price > 0 && <span className="text-muted-foreground">/mo</span>}
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                    {price === 0 ? "Free forever" : plan.description}
                </p>
            </div>

            {/* CTA Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    variant={plan.isBrand ? "brand" : "default"}
                    className="w-full"
                    onClick={onGetStarted}
                >
                    {plan.cta}
                </Button>
            </motion.div>

            {/* Features */}
            <div className="mt-6">
                <p className="text-xs text-muted-foreground mb-3">
                    {plan.isBrand ? "Everything in Free, plus:" : "Includes:"}
                </p>
                <ul className="space-y-2">
                    {plan.features.slice(plan.isBrand ? 1 : 0).map((feature, index) => (
                        <motion.li
                            key={index}
                            className="flex items-start gap-2.5 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-foreground" />
                            <span className={feature.highlight ? "font-medium" : ""}>
                                {feature.text}
                            </span>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </motion.div>
    )
}

export function Pricing() {
    const [isYearly, setIsYearly] = useState(true)
    const navigate = useNavigate()

    return (
        <div className="min-h-screen grid-pattern">
            {/* Header */}
            <motion.div
                className="text-center pt-32 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
                    Pricing
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-xl mx-auto">
                    Use Luma for free with unlimited events and guests. Upgrade for more invitations, 0% platform fee, and more.
                </p>

                {/* Toggle */}
                <div className="inline-flex mt-8 bg-black/5 dark:bg-white/10 rounded-lg p-1">
                    <motion.button
                        className={cn(
                            "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                            !isYearly
                                ? "bg-white dark:bg-gray-100 text-foreground dark:text-gray-900 shadow-sm"
                                : "text-muted-foreground"
                        )}
                        onClick={() => setIsYearly(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Monthly
                    </motion.button>
                    <motion.button
                        className={cn(
                            "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                            isYearly
                                ? "bg-white dark:bg-gray-100 text-foreground dark:text-gray-900 shadow-sm"
                                : "text-muted-foreground"
                        )}
                        onClick={() => setIsYearly(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Yearly
                        <span className="ml-1 text-cranberry">Save 17%</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Pricing cards */}
            <div className="max-w-4xl mx-auto mt-12 px-4 grid md:grid-cols-2 gap-6">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                        <PricingCard plan={plan} isYearly={isYearly} onGetStarted={() => navigate('/create-event')} />
                    </motion.div>
                ))}
            </div>

            {/* Enterprise card */}
            <motion.div
                className="max-w-4xl mx-auto mt-8 px-4 mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/5 rounded-xl p-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-muted-foreground">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium">Enterprise</h3>
                                <p className="text-muted-foreground">
                                    Custom solutions for large organizations
                                </p>
                            </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="light" onClick={() => window.location.href = 'mailto:sales@blend.lb'}>Contact Sales</Button>
                        </motion.div>
                    </div>

                    {/* Features marquee */}
                    <div className="mt-4 -mx-5 -mb-5 px-5 py-3 bg-black/5 dark:bg-white/5 rounded-b-xl overflow-hidden">
                        <motion.div
                            className="flex whitespace-nowrap text-xs text-muted-foreground"
                            animate={{ x: [0, -500] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            {[...enterpriseFeatures, ...enterpriseFeatures].map((feature, i) => (
                                <span key={i} className="mx-4">
                                    {feature} •
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Footnote */}
            <div className="max-w-4xl mx-auto px-4 pb-12 text-xs text-muted-foreground">
                * Stripe processing fees apply to all paid tickets. Platform fee is applied to the ticket price.
            </div>
        </div>
    )
}
