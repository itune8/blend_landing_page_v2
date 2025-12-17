"use client"

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

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

const positionStyles = {
    "top-left": "md:top-[25%] md:left-[5%]",
    "top-right": "md:top-[22%] md:right-[5%]",
    "left-mid": "md:top-[50%] md:left-[3%]",
    "right-mid": "md:top-[48%] md:right-[3%]",
    "bottom-left": "md:top-[70%] md:left-[8%]",
    "bottom-right": "md:top-[65%] md:right-[8%]",
}

interface FloatingCardProps {
    image: string
    title: string
    position: keyof typeof positionStyles
    index: number
    rotation: number
}

// Desktop-only FloatingCard with full 3D effects
const FloatingCard = ({ image, title, position, index, rotation }: FloatingCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null)

    // Mouse tracking for 3D parallax effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Spring-based rotation for smooth 3D tilt
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 })
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 })

    // Specular highlight position based on mouse
    const highlightX = useTransform(mouseX, [-0.5, 0.5], ["20%", "80%"])
    const highlightY = useTransform(mouseY, [-0.5, 0.5], ["20%", "80%"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        mouseX.set(x)
        mouseY.set(y)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    const floatVariants = {
        initial: {
            opacity: 0,
            scale: 0.3,
            rotateX: 45,
            rotateY: -45,
            z: -200,
        },
        animate: {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            z: 0,
        },
        hover: {
            scale: 1.15,
            z: 80,
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 25,
            },
        },
    }

    const floatingAnimation = {
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
            className={`absolute hidden md:block ${positionStyles[position]} md:w-48 md:h-48 lg:w-56 lg:h-56`}
            variants={floatVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
                zIndex: 10 + index,
                willChange: 'transform',
            }}
            transition={{
                duration: 1,
                delay: index * 0.15,
                type: "spring",
                stiffness: 80,
                damping: 15,
            }}
        >
            <motion.div
                animate={floatingAnimation}
                className="relative w-full h-full"
                style={{
                    transformStyle: "preserve-3d",
                    rotateX: rotateX,
                    rotateY: rotateY,
                    willChange: 'transform',
                }}
            >
                {/* 3D Sphere Container */}
                <motion.div
                    className="relative w-full h-full rounded-full"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: "translateZ(30px)",
                    }}
                >
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

                    {/* Main sphere body */}
                    <motion.div
                        className="relative w-full h-full rounded-full overflow-hidden"
                        style={{
                            boxShadow: `
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
                        {/* Image */}
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 112px, (max-width: 1024px) 192px, 224px"
                            quality={90}
                        />

                        {/* Full vignette effect */}
                        <motion.div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at 35% 30%, transparent 0%, transparent 25%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.35) 55%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 1) 100%)`,
                            }}
                        />

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

                        {/* Simplified highlights on mobile, full animated highlights on desktop */}
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

                        {/* Rim light - teal glow on bottom edge */}
                        <motion.div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                                background: "linear-gradient(to top, rgba(45, 212, 191, 0.4) 0%, rgba(45, 212, 191, 0.15) 15%, transparent 35%)",
                            }}
                        />

                        {/* Edge shadows and effects */}
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

                        {/* Iridescent rainbow rim */}
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

                        {/* Glass reflection streak */}
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

                        {/* Title overlay on hover */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center rounded-full pointer-events-none"
                            style={{
                                background: "radial-gradient(circle, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%)",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
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

                    {/* Outer glow ring */}
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
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export function FloatingEventCards() {
    return (
        <div
            className="absolute inset-0 pointer-events-auto hidden md:block"
            style={{
                perspective: "1200px",
                perspectiveOrigin: "center center",
            }}
        >
            {/* Desktop view only: Full 3D floating cards */}
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
