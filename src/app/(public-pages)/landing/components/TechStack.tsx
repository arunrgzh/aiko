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
            id: 'online-shopping',
            title: 'Интернет-магазины',
            description: 'Автоответы, рекомендации и поддержка 24/7',
        },
        {
            id: 'education',
            title: 'Онлайн-курсы и школы',
            description: 'Бот-консультант по программам и расписанию',
        },
        {
            id: 'hotels',
            title: 'Отели и туризм',
            description: 'Бронирование, напоминания и ответы на частые вопросы',
        },
        {
            id: 'freelancers',
            title: 'Фрилансеры',
            description: 'Онбординг новых клиентов через мессенджеры',
        },
        {
            id: 'tech-support',
            title: 'Техническая поддержка',
            description:
                'Круглосуточные автоответы, быстрая маршрутизация запросов, FAQ',
        },
        {
            id: 'business-services',
            title: 'Бизнес-услуги (юристы, бухгалтеры и т.д.)',
            description:
                'Первичная консультация, сбор заявок и фильтрация клиентов',
        },
        {
            id: 'ai-assistent',
            title: 'ИИ-ассистент по продажам',
            description:
                'Автоматическое выявление интереса, ответы на возражения и доведение до оплаты',
        },
        {
            id: 'medicine',
            title: 'Медицинские клиники',
            description: 'Онлайн-запись и консультация прямо в Мессенджерах',
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
                <motion.h2 className="my-6 text-5xl">
                    Кому это подходит ...
                </motion.h2>
                <motion.p className="mx-auto max-w-[600px]">
                    «Подходит для любого бизнеса»
                </motion.p>
            </motion.div>
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                            <div className="p-4 rounded-2xl z-10 relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 h-full group">
                                <div className="flex flex-col">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-600 group-hover:border-primary">
                                        <img
                                            className="max-h-8"
                                            src={`/img/landing/tech/${stack.id}.png`}
                                            alt={stack.title}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-lg mb-2">
                                            {stack.title}
                                        </h3>
                                        <p className="text-muted dark:text-muted-dark">
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
