
import AssistantsList from './_components/AssistantsList'
import AdaptiveCard from '@/components/shared/AdaptiveCard'


export default async function DashboardPage(){

    return (
        <AdaptiveCard className="h-full">
            <div className="flex flex-auto h-full">
                <AssistantsList />
            </div>
        </AdaptiveCard>


    )
}