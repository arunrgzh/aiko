'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import OnboardingLayout from './OnboardingLayout'
import PersonalInfoStep from './steps/PersonalInfoStep'
import ProfessionalInfoStep from './steps/ProfessionalInfoStep'
import SkillsStep from './steps/SkillsStep'
import PreferencesStep from './steps/PreferencesStep'
import CompletionStep from './steps/CompletionStep'
import { Spinner } from '@/components/ui/Spinner'
import Container from '@/components/shared/Container'

export type OnboardingData = {
    // Personal Information
    first_name?: string
    last_name?: string
    phone?: string
    date_of_birth?: string
    gender?: string

    // Professional Information
    current_position?: string
    years_of_experience?: number
    industry?: string
    company_size?: string

    // Skills and Preferences
    skills?: string[]
    preferred_job_types?: string[]
    preferred_locations?: string[]
    salary_expectation?: string

    // Additional Information
    bio?: string
    linkedin_url?: string
    portfolio_url?: string
}

const OnboardingPage = () => {
    const router = useRouter()
    const { session } = useCurrentSession()
    const [currentStep, setCurrentStep] = useState(1)
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const totalSteps = 5

    useEffect(() => {
        if (session?.accessToken) {
            // Check if user needs onboarding
            if (!session.user.isFirstLogin) {
                router.push('/main/dashboard')
            } else {
                setLoading(false)
            }
        }
    }, [session, router])

    const updateOnboardingData = (data: Partial<OnboardingData>) => {
        setOnboardingData((prev) => ({ ...prev, ...data }))
    }

    const handleNext = async () => {
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handleComplete = async () => {
        setSaving(true)
        try {
            // Save onboarding data to backend
            const response = await fetch('/api/onboarding/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify({
                    ...onboardingData,
                    onboarding_completed: true,
                    current_step: totalSteps,
                }),
            })

            if (response.ok) {
                // Mark onboarding as completed
                await fetch('/api/onboarding/complete', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                })

                // Redirect to dashboard
                router.push('/main/dashboard')
            }
        } catch (error) {
            console.error('Error completing onboarding:', error)
        } finally {
            setSaving(false)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoStep
                        data={onboardingData}
                        onUpdate={updateOnboardingData}
                        onNext={handleNext}
                    />
                )
            case 2:
                return (
                    <ProfessionalInfoStep
                        data={onboardingData}
                        onUpdate={updateOnboardingData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 3:
                return (
                    <SkillsStep
                        data={onboardingData}
                        onUpdate={updateOnboardingData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 4:
                return (
                    <PreferencesStep
                        data={onboardingData}
                        onUpdate={updateOnboardingData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case 5:
                return (
                    <CompletionStep
                        data={onboardingData}
                        onUpdate={updateOnboardingData}
                        onComplete={handleComplete}
                        onPrevious={handlePrevious}
                        saving={saving}
                    />
                )
            default:
                return null
        }
    }

    if (loading) {
        return (
            <Container className="flex items-center justify-center h-screen">
                <Spinner size={40} />
            </Container>
        )
    }

    return (
        <OnboardingLayout currentStep={currentStep} totalSteps={totalSteps}>
            {renderStep()}
        </OnboardingLayout>
    )
}

export default OnboardingPage
