import { useState } from 'react'
import Container from './LandingContainer'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

const TechStack = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const t = useTranslations('landing.audience')
    const tUser = useTranslations('landing.audience.users')

    const stackList = [
        {
            id: 'freelancers',
            title: t('users.disability'),
            description: t('users.disability-sub'),
        },
        {
            id: 'tech-support',
            title: t('users.hr'),
            description: t('users.hr-sub'),
        },

        {
            id: 'education',
            title: t('users.edu'),
            description: t('users.edu-sub'),
        },
    ]

    return (
        <div id="audience" className="relative z-20 py-10 md:py-40">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0.1 }}
                viewport={{ once: true }}
            >
                <motion.h2 className="my-6 text-5xl">{t('title')}</motion.h2>
                <motion.p className="mx-auto max-w-[600px]">
                    {t('sub')}
                </motion.p>
            </motion.div>
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stackList.map((stack, index) => (
                        <motion.div
                            key={stack.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                type: 'spring',
                                bounce: 0.1,
                                delay: index * 0.1,
                            }}
                            viewport={{ once: true }}
                            className="relative p-4"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <AnimatePresence>
                                {hoveredIndex === index && (
                                    <motion.span
                                        className="absolute inset-0 h-full w-full bg-gray-100 dark:bg-zinc-800/[0.8] block  rounded-3xl"
                                        layoutId="hoverBackground"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            transition: { duration: 0.15 },
                                        }}
                                        exit={{
                                            opacity: 0,
                                            transition: {
                                                duration: 0.15,
                                                delay: 0.2,
                                            },
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                            <div className="p-6 rounded-2xl z-10 relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 h-full group min-h-[340px]">
                                <div className="flex flex-col">
                                    <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-600 group-hover:border-primary">
                                        <img
                                            className="max-h-16"
                                            src={`/img/landing/tech/${stack.id}.png`}
                                            alt={stack.title}
                                        />
                                    </div>
                                    <div className="mt-8">
                                        <h3 className="text-xl mb-4">
                                            {stack.title}
                                        </h3>
                                        <p className="text-lg text-muted dark:text-muted-dark">
                                            {stack.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default TechStack
