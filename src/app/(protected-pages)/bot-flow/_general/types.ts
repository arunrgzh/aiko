export enum STEP {
    FIRST,
    SECOND,
    THIRD,
    FOUR
}

export enum CONVERSATION_STYLE {
    FRIENDLY = 'Дружелюбный (на ты)',
    FORMAL = 'Формальный (на Вы)',
    CUTE = 'Милый (на ты и с эмодзи)',
    ADAPTIVE = 'Адаптивный (общаться в таком стиле, в каком обратился клиент)'
}
export const ConversationType = {
    [CONVERSATION_STYLE.FRIENDLY]: 'friendly',
    [CONVERSATION_STYLE.FORMAL]: 'formal',
    [CONVERSATION_STYLE.CUTE]: 'cute',
    [CONVERSATION_STYLE.ADAPTIVE]: 'adaptive'
} as const

export enum NOT_FOUND_PHRASE {
    FIRST ='Секунду, уточню! ⏳',
    SECOND='Сейчас спрошу у коллег',
    // THIRD='Я узнаю и вернусь с ответом! 🙏',
    FOURTH='Извините, я уточню этот момент',
    FIFTH='Я уточню и сообщу вам позже'
}

export const NotFoundPhraseType = {
    [NOT_FOUND_PHRASE.FIRST]: 'secundu',
    [NOT_FOUND_PHRASE.SECOND]: 'uznayu',
    [NOT_FOUND_PHRASE.FOURTH]: 'izvinite',
    [NOT_FOUND_PHRASE.FIFTH]: 'soobshchu'
} as const

export enum PURPOSE {
    SELL = 'Продавать',
    CONSULT = 'Консультировать',
    SUPPORT = 'Тех. поддержка',
    OTHER = 'Другое'
}
export const PurposeType = {
    [PURPOSE.SELL] :'sell',
    [PURPOSE.CONSULT]: 'consult',
    [PURPOSE.SUPPORT] :'support',
    [PURPOSE.OTHER] : 'other'
} as const


export type BindingFormValues = {
    instagram_url: string
    website_url: string
    files: File[]
}


export type ConversationStyleFormValues = {
    style: CONVERSATION_STYLE
    fallback_responses: NOT_FOUND_PHRASE
    purpose: PURPOSE
}

export type FlowCorrectionFormValues = {
    instructions: Instruction[]
}

export type NamingFormValues = {
    company_name: string,
    assistant_name: string,
}

export type FormValues = NamingFormValues & FlowCorrectionFormValues & ConversationStyleFormValues & BindingFormValues;

export interface Instruction {
    order: number
    text: string
}


export type CreationFlowState = {
    step: STEP
    isLastStep: boolean
    isFirstStep: boolean
}

export type CreationFlowAction = {
    onNext: () => void
    onPrevious: () => void
}

export interface BotConfigState {
    company_name: string
    assistant_name: string
    instructions: { order: number; text: string }[]
    style: string
    fallback_responses: string[]
    purpose: string[]
    instagram_url: string
    website_url: string
    files: File[]
}


export type BotConfigAction = {
    getConfigForInitialize: () => Omit<BotConfigState, 'files'>
    getConfigForUpdate: () => BotConfigState

    setNaming: (values: NamingFormValues) => void
    setFlowCorrection: (values: FlowCorrectionFormValues) => void
    setConversationStyle: (values: ConversationStyleFormValues) => void
    setBinding: (values: BindingFormValues) => void
}