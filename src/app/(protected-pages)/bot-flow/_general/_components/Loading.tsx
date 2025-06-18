import { Spinner } from '@/components/ui/Spinner'

export default function Loading(){
    return (
        <div className={'h-96 flex flex-col items-center justify-center'}>
            <Spinner size={60} />
        </div>

    )
}