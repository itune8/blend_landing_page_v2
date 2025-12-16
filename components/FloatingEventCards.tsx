"use client"

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"

// Detect mobile for performance optimization
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return isMobile
}

const eventData = [
    {
        image: "/events/car-meetup.jpg",
        title: "MCR Car Meetup",
        position: "top-left",
        rotation: -8,
    },
    {
        image: "/events/networking-event.jpg",
        title: "Ecom Networking Event",
        position: "top-right",
        rotation: 12,
    },
    {
        image: "/events/outdoor-event.jpg",
        title: "MashoMa3na",
        position: "left-mid",
        rotation: -15,
    },
    {
        image: "/events/workshop-event.jpg",
        title: "Tote Bag Painting",
        position: "right-mid",
        rotation: 8,
    },
    {
        image: "/events/dinner-event.jpg",
        title: "Meet and Greet",
        position: "bottom-left",
        rotation: 6,
    },
    {
        image: "/events/fitness-event.jpg",
        title: "Walk Club Beirut",
        position: "bottom-right",
        rotation: -10,
    },
]

// Desktop: scattered around center, Mobile: horizontal rows above/below heading
const positionStyles = {
    "top-left": "top-[8%] left-[5%] md:top-[25%] md:left-[5%]",
    "top-right": "top-[8%] right-[5%] md:top-[22%] md:right-[5%]",
    "left-mid": "top-[18%] left-[30%] md:top-[50%] md:left-[3%]",
    "right-mid": "top-[18%] right-[30%] md:top-[48%] md:right-[3%]",
    "bottom-left": "bottom-[8%] left-[5%] md:top-[70%] md:left-[8%]",
    "bottom-right": "bottom-[8%] right-[5%] md:top-[65%] md:right-[8%]",
}

interface FloatingCardProps {
    image: string
    title: string
    position: keyof typeof positionStyles
    index: number
    rotation: number
}

const FloatingCard = ({ image, title, position, index, rotation }: FloatingCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile()

    // Mouse tracking for 3D parallax effect (desktop only)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Spring-based rotation for smooth 3D tilt (desktop only)
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 })
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 })

    // Specular highlight position based on mouse
    const highlightX = useTransform(mouseX, [-0.5, 0.5], ["20%", "80%"])
    const highlightY = useTransform(mouseY, [-0.5, 0.5], ["20%", "80%"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || isMobile) return // Disable on mobile
        const rect = cardRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        mouseX.set(x)
        mouseY.set(y)
    }

    const handleMouseLeave = () => {
        if (isMobile) return // Disable on mobile
        mouseX.set(0)
        mouseY.set(0)
    }

    // Simplified animation for mobile, full 3D for desktop
    const floatVariants = {
        initial: isMobile ? {
            opacity: 0,
            scale: 0.8,
        } : {
            opacity: 0,
            scale: 0.3,
            rotateX: 45,
            rotateY: -45,
            z: -200,
        },
        animate: isMobile ? {
            opacity: 1,
            scale: 1,
        } : {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            z: 0,
        },
        hover: isMobile ? {
            scale: 1.05, // Minimal scale on mobile
            transition: {
                duration: 0.2,
            },
        } : {
            scale: 1.15,
            z: 80,
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 25,
            },
        },
    }

    // Reduced floating animation on mobile
    const floatingAnimation = isMobile ? {
        y: [0, -8, 0],
        rotateZ: [rotation, rotation + 2, rotation],
        transition: {
            duration: 6 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut" as const,
        },
    } : {
        y: [0, -15, 0],
        rotateZ: [rotation, rotation + 3, rotation],
        transition: {
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut" as const,
        },
    }

    return (
        <motion.div
            ref={cardRef}
            className={`absolute ${positionStyles[position]} w-28 h-28 md:w-48 md:h-48 lg:w-56 lg:h-56`}
            variants={floatVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            onMouseMove={isMobile ? undefined : handleMouseMove}
            onMouseLeave={isMobile ? undefined : handleMouseLeave}
            style={{
                perspective: isMobile ? undefined : "1000px",
                transformStyle: isMobile ? undefined : "preserve-3d",
                zIndex: 10 + index,
                willChange: 'transform',
            }}
            transition={{
                duration: isMobile ? 0.6 : 1,
                delay: index * (isMobile ? 0.1 : 0.15),
                type: "spring",
                stiffness: 80,
                damping: 15,
            }}
        >
            <motion.div
                animate={floatingAnimation}
                className="relative w-full h-full"
                style={{
                    transformStyle: isMobile ? undefined : "preserve-3d",
                    rotateX: isMobile ? undefined : rotateX,
                    rotateY: isMobile ? undefined : rotateY,
                    willChange: 'transform',
                }}
            >
                {/* 3D Sphere Container */}
                <motion.div
                    className="relative w-full h-full rounded-full"
                    style={{
                        transformStyle: isMobile ? undefined : "preserve-3d",
                        transform: isMobile ? undefined : "translateZ(30px)",
                    }}
                >
                    {/* Simplified shadow on mobile, full 3D shadows on desktop */}
                    {!isMobile && (
                        <>
                            {/* Deep shadow for pop-out effect */}
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: "radial-gradient(circle at 50% 130%, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 35%, rgba(0, 0, 0, 0.3) 55%, transparent 75%)",
                                    transform: "translateZ(-80px) translateY(35px) scale(1.15)",
                                    filter: "blur(25px)",
                                }}
                            />

                            {/* Additional depth shadow layer */}
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: "radial-gradient(ellipse at 50% 150%, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 30%, transparent 60%)",
                                    transform: "translateZ(-100px) translateY(45px) scale(1.2)",
                                    filter: "blur(35px)",
                                }}
                            />

                            {/* Secondary ambient shadow */}
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: "radial-gradient(circle, rgba(45, 212, 191, 0.3) 0%, rgba(0, 100, 100, 0.2) 50%, transparent 80%)",
                                    transform: "translateZ(-40px) translateY(15px) scale(1.2)",
                                    filter: "blur(30px)",
                                }}
                                animate={{
                                    opacity: [0.4, 0.6, 0.4],
                                    scale: [1.2, 1.3, 1.2],
                                }}
                                transition={{
                                    duration: 4 + index * 0.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </>
                    )}

                    {/* Simple shadow for mobile */}
                    {isMobile && (
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
                            }}
                        />
                    )}

                    {/* Main sphere body - simplified on mobile */}
                    <motion.div
                        className="relative w-full h-full rounded-full overflow-hidden"
                        style={{
                            boxShadow: isMobile
                                ? "0 0 0 1px rgba(255, 255, 255, 0.15), 0 8px 15px rgba(0, 0, 0, 0.5), inset 0 -15px 30px rgba(0, 0, 0, 0.4)"
                                : `
                                    0 0 0 2px rgba(255, 255, 255, 0.15),
                                    0 15px 50px rgba(0, 0, 0, 0.7),
                                    0 8px 25px rgba(0, 0, 0, 0.5),
                                    0 25px 60px rgba(0, 0, 0, 0.4),
                                    inset 0 -35px 60px rgba(0, 0, 0, 0.6),
                                    inset 0 25px 50px rgba(255, 255, 255, 0.12),
                                    inset 20px 0 40px rgba(0, 0, 0, 0.3),
                                    inset -20px 0 40px rgba(0, 0, 0, 0.3)
                                `,
                        }}
                    >
                        {/* Image - optimized for mobile */}
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 112px, (max-width: 1024px) 192px, 224px"
                            loading="lazy"
                            quality={isMobile ? 75 : 90}
                            priority={index < 2}
                        />

                        {/* Simplified vignette for mobile */}
                        <motion.div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                                background: isMobile
                                    ? "radial-gradient(circle at 35% 30%, transparent 0%, transparent 30%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0.9) 95%)"
                                    : `radial-gradient(circle at 35% 30%, transparent 0%, transparent 25%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.35) 55%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 1) 100%)`,
                            }}
                        />

                        {/* Desktop-only layers for enhanced depth */}
                        {!isMobile && (
                            <>
                                {/* Secondary curved vignette */}
                                <motion.div
                                    className="absolute inset-0 rounded-full pointer-events-none"
                                    style={{
                                        background: `radial-gradient(ellipse at 40% 35%, transparent 0%, transparent 35%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 65%, rgba(0, 0, 0, 0.75) 80%, rgba(0, 0, 0, 0.9) 95%)`,
                                    }}
                                />

                                {/* Inner shadow ring */}
                                <motion.div
                                    className="absolute inset-0 rounded-full pointer-events-none"
                                    style={{
                                        boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(0, 0, 0, 0.3), inset 0 0 100px rgba(0, 0, 0, 0.2)",
                                    }}
                                />
                            </>
                        )}

                        {/* Simplified highlights for mobile, full highlights for desktop */}
                        {isMobile ? (
                            /* Mobile: static, simpler highlight */
                            <motion.div
                                className="absolute rounded-full pointer-events-none"
                                style={{
                                    top: "10%",
                                    left: "15%",
                                    width: "40%",
                                    height: "40%",
                                    background: "radial-gradient(ellipse at 40% 40%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)",
                                    filter: "blur(6px)",
                                }}
                            />
                        ) : (
                            /* Desktop: animated, multi-layer highlights */
                            <>
                                <motion.div
                                    className="absolute rounded-full pointer-events-none"
                                    style={{
                                        top: "5%",
                                        left: "10%",
                                        width: "50%",
                                        height: "50%",
                                        background: "radial-gradient(ellipse at 40% 40%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 30%, transparent 70%)",
                                        filter: "blur(8px)",
                                    }}
                                    animate={{
                                        opacity: [0.7, 0.9, 0.7],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 3 + index * 0.3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />

                                <motion.div
                                    className="absolute rounded-full pointer-events-none"
                                    style={{
                                        top: highlightY,
                                        left: highlightX,
                                        width: "15%",
                                        height: "15%",
                                        background: "radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.6) 40%, transparent 70%)",
                                        filter: "blur(3px)",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />

                                <motion.div
                                    className="absolute rounded-full pointer-events-none"
                                    style={{
                                        top: "12%",
                                        left: "22%",
                                        width: "8%",
                                        height: "8%",
                                        background: "rgba(255, 255, 255, 0.95)",
                                        filter: "blur(1px)",
                                    }}
                                />
                            </>
                        )}

                        {/* Rim light - teal glow on bottom edge */}
                        <motion.div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                                background: "linear-gradient(to top, rgba(45, 212, 191, 0.4) 0%, rgba(45, 212, 191, 0.15) 15%, transparent 35%)",
                            }}
                        />

                        {/* Desktop-only: Edge shadows and effects */}
                        {!isMobile && (
                            <>
                                <motion.div
                                    className="absolute inset-0 rounded-full pointer-events-none"
                                    style={{
                                        background: "linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 10%, transparent 25%)",
                                    }}
                                />

                                <motion.div
                                    className="absolute inset-0 rounded-full pointer-events-none"
                                    style={{
                                        background: "linear-gradient(to left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 10%, transparent 25%)",
                                    }}
                                />

                                <motion.div
                                    className="absolute inset-0 rounded-full pointer-events-none"
                                    style={{
                                        background: "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 12%, transparent 30%)",
                                    }}
                                />

                                {/* Iridescent rainbow rim - desktop only (expensive) */}
                                <motion.div
                                    className="absolute inset-0 rounded-full pointer-events-none"
                                    style={{
                                        background: "conic-gradient(from 0deg, #00d9ff 0deg, #00ff99 60deg, #ffff00 120deg, #ff00ff 180deg, #9900ff 240deg, #00ccff 300deg, #00d9ff 360deg)",
                                        opacity: 0.5,
                                        maskImage: "radial-gradient(circle, transparent 85%, black 92%, black 96%, transparent 100%)",
                                        WebkitMaskImage: "radial-gradient(circle, transparent 85%, black 92%, black 96%, transparent 100%)",
                                        filter: "blur(2px)",
                                    }}
                                    animate={{
                                        rotate: [0, 360],
                                        opacity: [0.4, 0.6, 0.4],
                                    }}
                                    transition={{
                                        rotate: {
                                            duration: 10 + index * 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                        },
                                        opacity: {
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }
                                    }}
                                />

                                {/* Glass reflection streak - desktop only */}
                                <motion.div
                                    className="absolute pointer-events-none"
                                    style={{
                                        top: "15%",
                                        left: "5%",
                                        width: "15%",
                                        height: "40%",
                                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)",
                                        filter: "blur(3px)",
                                        borderRadius: "50%",
                                        transform: "rotate(-20deg)",
                                    }}
                                />
                            </>
                        )}

                        {/* Title overlay on hover - simplified on mobile */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center rounded-full pointer-events-none"
                            style={{
                                background: "radial-gradient(circle, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%)",
                                backdropFilter: isMobile ? undefined : "blur(8px)",
                                WebkitBackdropFilter: isMobile ? undefined : "blur(8px)",
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                        >
                            <p
                                className="text-white font-bold text-center px-3"
                                style={{
                                    fontSize: "clamp(0.65rem, 2vw, 1rem)",
                                    lineHeight: "1.2",
                                    textShadow: "0 2px 10px rgba(45, 212, 191, 0.5)",
                                }}
                            >
                                {title}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Outer glow ring - desktop only (expensive animated effect) */}
                    {!isMobile && (
                        <motion.div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                                transform: "translateZ(-10px) scale(1.15)",
                                background: "conic-gradient(from 0deg, rgba(0, 217, 255, 0.4) 0deg, rgba(0, 255, 153, 0.4) 60deg, rgba(255, 255, 0, 0.4) 120deg, rgba(255, 0, 255, 0.4) 180deg, rgba(153, 0, 255, 0.4) 240deg, rgba(0, 204, 255, 0.4) 300deg, rgba(0, 217, 255, 0.4) 360deg)",
                                maskImage: "radial-gradient(circle, transparent 80%, black 90%, transparent 100%)",
                                WebkitMaskImage: "radial-gradient(circle, transparent 80%, black 90%, transparent 100%)",
                                filter: "blur(10px)",
                            }}
                            animate={{
                                rotate: [0, 360],
                                scale: [1.15, 1.2, 1.15],
                            }}
                            transition={{
                                rotate: {
                                    duration: 15 + index * 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                },
                                scale: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }
                            }}
                        />
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export function FloatingEventCards() {
    return (
        <div
            className="absolute inset-0 pointer-events-auto"
            style={{
                perspective: "1200px",
                perspectiveOrigin: "center center",
            }}
        >
            {eventData.map((event, index) => (
                <FloatingCard
                    key={event.title}
                    image={event.image}
                    title={event.title}
                    position={event.position as keyof typeof positionStyles}
                    index={index}
                    rotation={event.rotation}
                />
            ))}
        </div>
    )
}
