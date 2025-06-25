'use client'

import NextLink from 'next/link'
import { useState,useEffect } from 'react'
import { apiGetAssistants } from '@/services/AssistantsService'
import { Card } from '@/components/ui'
type TAssistant = {
    id: number,
    config_id: number,
    company_name: string,
    assistant_name: string,
    style: string,
    purpose: string[]
}
type TAssistants = TAssistant[]
export default function AssistantsList(){
    const [assistants, setAssistants] = useState<TAssistants>([])
    useEffect(()=>{
        (async () => {
            const res = await apiGetAssistants()
            setAssistants(res)
        })()
    },[])
    return (
        <div className={'flex gap-2'}>
            {assistants.length > 0 ?
                assistants.map(assistant => (
                   <Card key={assistant.id}
                   header={{
                       content: <>{assistant.assistant_name}</>,
                   }}
                         footer={{
                             content: <>{assistant.purpose.map((p) => p)}</>
                         }}

                   >
                       <NextLink key={assistant.id} href={`/assistants/${assistant.id}/main/assistant`} className={'hover:text-zinc-800'}>Go To Detail</NextLink>
                   </Card>
                )) : <>Not Found</>}
        </div>
)
}