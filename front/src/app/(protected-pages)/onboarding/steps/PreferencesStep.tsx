'use client'

import { useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { OnboardingData } from '../page'

interface PreferencesStepProps {
    data: OnboardingData
    onUpdate: (data: Partial<OnboardingData>) => void
    onNext: () => void
    onPrevious: () => void
}

const PreferencesStep = ({
    data,
    onUpdate,
    onNext,
    onPrevious,
}: PreferencesStepProps) => {
    const [formData, setFormData] = useState({
        preferred_job_types: data.preferred_job_types || [],
        preferred_locations: data.preferred_locations || [],
        salary_expectation: data.salary_expectation || '',
    })
    const [newJobType, setNewJobType] = useState('')
    const [newLocation, setNewLocation] = useState('')

    const popularJobTypes = [
        'Full-time',
        'Part-time',
        'Contract',
        'Freelance',
        'Internship',
        'Remote',
        'Hybrid',
        'On-site',
    ]

    const popularLocations = [
        'New York, NY',
        'San Francisco, CA',
        'Los Angeles, CA',
        'Chicago, IL',
        'Austin, TX',
        'Seattle, WA',
        'Boston, MA',
        'Denver, CO',
        'Atlanta, GA',
        'Miami, FL',
        'Remote',
        'Anywhere',
    ]

    const salaryRanges = [
        'Under $30,000',
        '$30,000 - $50,000',
        '$50,000 - $75,000',
        '$75,000 - $100,000',
        '$100,000 - $150,000',
        '$150,000 - $200,000',
        '$200,000+',
        'Negotiable',
    ]

    const handleAddJobType = () => {
        if (
            newJobType.trim() &&
            !formData.preferred_job_types.includes(newJobType.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                preferred_job_types: [
                    ...prev.preferred_job_types,
                    newJobType.trim(),
                ],
            }))
            setNewJobType('')
        }
    }

    const handleRemoveJobType = (jobType: string) => {
        setFormData((prev) => ({
            ...prev,
            preferred_job_types: prev.preferred_job_types.filter(
                (type) => type !== jobType,
            ),
        }))
    }

    const handleAddLocation = () => {
        if (
            newLocation.trim() &&
            !formData.preferred_locations.includes(newLocation.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                preferred_locations: [
                    ...prev.preferred_locations,
                    newLocation.trim(),
                ],
            }))
            setNewLocation('')
        }
    }

    const handleRemoveLocation = (location: string) => {
        setFormData((prev) => ({
            ...prev,
            preferred_locations: prev.preferred_locations.filter(
                (loc) => loc !== location,
            ),
        }))
    }

    const handleAddPopularJobType = (jobType: string) => {
        if (!formData.preferred_job_types.includes(jobType)) {
            setFormData((prev) => ({
                ...prev,
                preferred_job_types: [...prev.preferred_job_types, jobType],
            }))
        }
    }

    const handleAddPopularLocation = (location: string) => {
        if (!formData.preferred_locations.includes(location)) {
            setFormData((prev) => ({
                ...prev,
                preferred_locations: [...prev.preferred_locations, location],
            }))
        }
    }

    const handleNext = () => {
        onUpdate(formData)
        onNext()
    }

    const handlePrevious = () => {
        onUpdate(formData)
        onPrevious()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Job Preferences
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Tell us about your job preferences and desired locations
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <Form layout="vertical">
                    {/* Job Types */}
                    <FormItem label="Preferred Job Types">
                        <div className="flex gap-2 mb-4">
                            <Input
                                value={newJobType}
                                onChange={(e) => setNewJobType(e.target.value)}
                                placeholder="Add a job type"
                                className="flex-1"
                            />
                            <Button
                                variant="solid"
                                onClick={handleAddJobType}
                                disabled={!newJobType.trim()}
                            >
                                Add
                            </Button>
                        </div>

                        {formData.preferred_job_types.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.preferred_job_types.map(
                                    (jobType, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                        >
                                            <span>{jobType}</span>
                                            <button
                                                onClick={() =>
                                                    handleRemoveJobType(jobType)
                                                }
                                                className="ml-1 text-green-600 hover:text-green-800"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {popularJobTypes.map((jobType) => (
                                <Button
                                    key={jobType}
                                    size="sm"
                                    variant={
                                        formData.preferred_job_types.includes(
                                            jobType,
                                        )
                                            ? 'solid'
                                            : 'default'
                                    }
                                    onClick={() =>
                                        handleAddPopularJobType(jobType)
                                    }
                                    disabled={formData.preferred_job_types.includes(
                                        jobType,
                                    )}
                                >
                                    {jobType}
                                </Button>
                            ))}
                        </div>
                    </FormItem>

                    {/* Locations */}
                    <FormItem label="Preferred Locations">
                        <div className="flex gap-2 mb-4">
                            <Input
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                placeholder="Add a location"
                                className="flex-1"
                            />
                            <Button
                                variant="solid"
                                onClick={handleAddLocation}
                                disabled={!newLocation.trim()}
                            >
                                Add
                            </Button>
                        </div>

                        {formData.preferred_locations.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.preferred_locations.map(
                                    (location, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                        >
                                            <span>{location}</span>
                                            <button
                                                onClick={() =>
                                                    handleRemoveLocation(
                                                        location,
                                                    )
                                                }
                                                className="ml-1 text-purple-600 hover:text-purple-800"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {popularLocations.map((location) => (
                                <Button
                                    key={location}
                                    size="sm"
                                    variant={
                                        formData.preferred_locations.includes(
                                            location,
                                        )
                                            ? 'solid'
                                            : 'default'
                                    }
                                    onClick={() =>
                                        handleAddPopularLocation(location)
                                    }
                                    disabled={formData.preferred_locations.includes(
                                        location,
                                    )}
                                >
                                    {location}
                                </Button>
                            ))}
                        </div>
                    </FormItem>

                    {/* Salary Expectation */}
                    <FormItem label="Salary Expectation">
                        <Select
                            value={formData.salary_expectation}
                            onChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    salary_expectation: value || '',
                                }))
                            }
                            placeholder="Select salary range"
                            options={salaryRanges}
                        />
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

export default PreferencesStep
