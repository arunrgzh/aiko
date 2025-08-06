'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { Briefcase, Palette, Star, Grid } from 'lucide-react'

interface CategoryTabsProps {
    activeCategory: 'all' | 'employment' | 'motion' | 'featured'
    onCategoryChange: (
        category: 'all' | 'employment' | 'motion' | 'featured',
    ) => void
    employmentCount?: number
    motionCount?: number
    featuredCount?: number
    totalCount?: number
    children: React.ReactNode
    className?: string
}

const CategoryTabs = ({
    activeCategory,
    onCategoryChange,
    employmentCount = 0,
    motionCount = 0,
    featuredCount = 0,
    totalCount = 0,
    children,
    className = '',
}: CategoryTabsProps) => {
    return (
        <div className={`space-y-6 ${className}`}>
            <Tabs
                value={activeCategory}
                onValueChange={(value) => onCategoryChange(value as any)}
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                        value="all"
                        className="flex items-center space-x-2"
                    >
                        <Grid className="w-4 h-4" />
                        <span className="hidden sm:inline">Все видео</span>
                        <span className="sm:hidden">Все</span>
                        {totalCount > 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {totalCount}
                            </Badge>
                        )}
                    </TabsTrigger>

                    <TabsTrigger
                        value="featured"
                        className="flex items-center space-x-2"
                    >
                        <Star className="w-4 h-4" />
                        <span className="hidden sm:inline">Рекомендуемые</span>
                        <span className="sm:hidden">Топ</span>
                        {featuredCount > 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {featuredCount}
                            </Badge>
                        )}
                    </TabsTrigger>

                    <TabsTrigger
                        value="employment"
                        className="flex items-center space-x-2"
                    >
                        <Briefcase className="w-4 h-4" />
                        <span className="hidden sm:inline">
                            Трудоустройство
                        </span>
                        <span className="sm:hidden">Работа</span>
                        {employmentCount > 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {employmentCount}
                            </Badge>
                        )}
                    </TabsTrigger>

                    <TabsTrigger
                        value="motion"
                        className="flex items-center space-x-2"
                    >
                        <Palette className="w-4 h-4" />
                        <span className="hidden sm:inline">Motion Design</span>
                        <span className="sm:hidden">Motion</span>
                        {motionCount > 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {motionCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    {children}
                </TabsContent>

                <TabsContent value="featured" className="mt-6">
                    {children}
                </TabsContent>

                <TabsContent value="employment" className="mt-6">
                    {children}
                </TabsContent>

                <TabsContent value="motion" className="mt-6">
                    {children}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default CategoryTabs
