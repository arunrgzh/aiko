'use client'

import { useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { OnboardingData } from '../page'

interface SkillsStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
    onPrevious: () => void
}

const SkillsStep = ({
    data,
    onUpdate,
    onNext,
    onPrevious,
}: SkillsStepProps) => {
    const [skills, setSkills] = useState<string[]>(data.skills || [])
    const [newSkill, setNewSkill] = useState('')

    const popularSkills = [
        'JavaScript',
        'Python',
        'React',
        'Node.js',
        'TypeScript',
        'Java',
        'C++',
        'C#',
        'PHP',
        'Ruby',
        'Go',
        'Rust',
        'HTML',
        'CSS',
        'SQL',
        'MongoDB',
        'PostgreSQL',
        'AWS',
        'Docker',
        'Kubernetes',
        'Git',
        'Linux',
        'Machine Learning',
        'Data Analysis',
        'Project Management',
        'Agile',
        'Scrum',
        'UI/UX Design',
        'Graphic Design',
        'Content Writing',
        'Digital Marketing',
        'Sales',
        'Customer Service',
        'Leadership',
        'Communication',
    ]

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills((prev) => [...prev, newSkill.trim()])
            setNewSkill('')
        }
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills((prev) => prev.filter((skill) => skill !== skillToRemove))
    }

    const handleAddPopularSkill = (skill: string) => {
        if (!skills.includes(skill)) {
            setSkills((prev) => [...prev, skill])
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddSkill()
        }
    }

    const handleNext = () => {
        onUpdate({ skills })
        onNext()
    }

    const handlePrevious = () => {
        onUpdate({ skills })
        onPrevious()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Your Skills
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Add your skills to help us match you with relevant
                    opportunities
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    <FormItem label="Add Skills">
                        <div className="flex gap-2">
                            <Input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a skill and press Enter"
                                className="flex-1"
                            />
                            <Button
                                variant="solid"
                                onClick={handleAddSkill}
                                disabled={!newSkill.trim()}
                            >
                                Add
                            </Button>
                        </div>
                    </FormItem>

                    {/* Selected Skills */}
                    {skills.length > 0 && (
                        <FormItem label="Your Skills">
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        <span>{skill}</span>
                                        <button
                                            onClick={() =>
                                                handleRemoveSkill(skill)
                                            }
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </FormItem>
                    )}

                    {/* Popular Skills */}
                    <FormItem label="Popular Skills">
                        <div className="flex flex-wrap gap-2">
                            {popularSkills.map((skill) => (
                                <Button
                                    key={skill}
                                    size="sm"
                                    variant={
                                        skills.includes(skill)
                                            ? 'solid'
                                            : 'default'
                                    }
                                    onClick={() => handleAddPopularSkill(skill)}
                                    disabled={skills.includes(skill)}
                                >
                                    {skill}
                                </Button>
                            ))}
                        </div>
                    </FormItem>
                </Form>

                <div className="flex justify-between mt-8">
                    <Button
                        variant="default"
                        onClick={handlePrevious}
                        className="min-w-[120px]"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleNext}
                        className="min-w-[120px]"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SkillsStep
