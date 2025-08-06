import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import TextGenerateEffect from './TextGenerateEffect'
import { MODE_DARK, MODE_LIGHT } from '@/constants/theme.constant'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Mode } from '@/@types/theme'
import { useTranslations } from 'next-intl'

const HeroContent = ({ mode }: { mode: Mode }) => {
    const router = useRouter()

    const t = useTranslations('landing')

    const handleSignIn = () => {
        router.push('/sign-in')
    }

    return (
        <div className="max-w-7xl mx-auto px-4 flex min-h-screen flex-col items-center justify-between">
            <div className="flex flex-col min-h-screen pt-20 md:pt-40 relative overflow-hidden">
                <div>
                    <TextGenerateEffect
                        wordClassName="text-2xl md:text-4xl lg:text-6xl  max-w-7xl mx-auto text-center mt-6 relative z-10"
                        words={t('title')}
                        wordsCallbackClass={({ word }) => {
                            if (word === 'AI-Komekshi') {
                                return 'bg-gradient-to-r from-[#006BF9] to-[#78B2FF] bg-clip-text text-transparent'
                            }

                            return ''
                        }}
                    />
                    <motion.p
                        initial={{ opacity: 0, translateY: 40 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="text-center mt-6 text-base md:text-xl text-muted dark:text-muted-dark max-w-5xl mx-auto relative z-10 font-normal"
                    >
                        {t('subtitle')}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, translateY: 40 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        className="flex items-center gap-4 justify-center mt-10 relative z-10"
                    >
                        <Button variant="solid" onClick={handleSignIn}>
                            {t('button.create')}
                        </Button>
                    </motion.div>
                </div>
                <div className="p-2 lg:p-4 border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-700 rounded-2xl lg:rounded-[32px] mt-20 relative">
                    <div className="absolute inset-x-0 bottom-0 h-40 w-full bg-gradient-to-b from-transparent via-white to-white dark:via-black/50 dark:to-black scale-[1.1] pointer-events-none" />
                    <div className="bg-white dark:bg-black dark:border-gray-700 border border-gray-200 rounded-[24px]">
                        {mode === MODE_LIGHT && (
                            <Image
                                className="rounded-2xl lg:rounded-[24px]"
                                src="/img/landing/hero/img-1.jpg"
                                width={1920}
                                height={1040}
                                alt="Ecme homepage"
                            />
                        )}
                        {mode === MODE_DARK && (
                            <Image
                                className="rounded-2xl lg:rounded-[24px]"
                                src="/img/landing/hero/hero-dark.webp"
                                width={1920}
                                height={1040}
                                alt=" homepage"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroContent
