import { lazy, Suspense } from 'react'
import Loading from './Loading'
import NotFound from './NotFound'
import { STEP } from '@/app/(protected-pages)/bot-flow/_general/types'

type ContentProps = {
    step: STEP
}

const BindingForm = lazy(() => import('./FlowSteps/BindingForm'))
const ConversationStyleForm = lazy(() => import('./FlowSteps/ConversationStyleForm'))
const FlowCorrectionForm = lazy(() => import('./FlowSteps/FlowCorrectionForm'))
const NamingForm = lazy(() => import('./FlowSteps/NamingForm'))


const MAPPER = [
    NamingForm,
    ConversationStyleForm,
    FlowCorrectionForm,
    BindingForm
]

export default function Content({step, ...props } : ContentProps) {

    const Component = MAPPER[step] || <NotFound/>;
    return (
        <Suspense fallback={<Loading />}>
            {
               <Component {...props} />
            }
        </Suspense>
    )
}

