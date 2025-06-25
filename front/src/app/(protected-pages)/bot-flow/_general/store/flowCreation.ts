import { create } from 'zustand'
import {
    STEP,
    BotConfigState,
    BotConfigAction,
    CreationFlowState,
    CreationFlowAction,
    NamingFormValues,
    FlowCorrectionFormValues,
    ConversationStyleFormValues,
    BindingFormValues,

    CONVERSATION_STYLE,
    NOT_FOUND_PHRASE,
    PURPOSE, ConversationType, NotFoundPhraseType, PurposeType
} from '../types'

const flowCreationInitialState: CreationFlowState = {
    step: STEP.FIRST,
    isFirstStep: true,
    isLastStep: false,
}

export const useCreationFlowStore = create<
    CreationFlowState & CreationFlowAction
>((set, get) => ({
    ...flowCreationInitialState,

    onNext: () => {
        const currentStep = get().step
        const nextStep = currentStep + 1

        if (nextStep > STEP.FOUR) return

        set({
            step: nextStep,
            isFirstStep: nextStep === STEP.FIRST,
            isLastStep: nextStep === STEP.FOUR,
        })
    },

    onPrevious: () => {
        const currentStep = get().step
        const prevStep = currentStep - 1

        if (prevStep < STEP.FIRST) return

        set({
            step: prevStep,
            isFirstStep: prevStep === STEP.FIRST,
            isLastStep: prevStep === STEP.FOUR,
        })
    },
}))


export const useBotConfigStore = create<BotConfigState & BotConfigAction>((set, get) => ({
    company_name: '',
    assistant_name: '',

    instructions: [],

    style: ConversationType[CONVERSATION_STYLE.FRIENDLY],
    fallback_responses: [NotFoundPhraseType[NOT_FOUND_PHRASE.FIRST]],
    purpose: [PurposeType[PURPOSE.SELL]],

    instagram_url: '',
    website_url: '',
    files: [],


    getConfigForInitialize: () => ({
        company_name: get().company_name,
        assistant_name: get().assistant_name,
        instructions: get().instructions,
        style: get().style,
        fallback_responses: get().fallback_responses,
        purpose: get().purpose,
        instagram_url: get().instagram_url,
        website_url: get().website_url,
    }),

    getConfigForUpdate: (): BotConfigState => {
        return get();
    },

    setNaming: (values: NamingFormValues) =>
        set({
            company_name: values.company_name,
            assistant_name: values.assistant_name,
        }),

    setFlowCorrection: (values: FlowCorrectionFormValues) =>
        set({
            instructions: values.instructions,
        }),

    setConversationStyle: (values: ConversationStyleFormValues) =>
        set({
            style: ConversationType[values.style],
            fallback_responses: [NotFoundPhraseType[values.fallback_responses]],
            purpose: [PurposeType[values.purpose]],
        }),

    setBinding: (values: BindingFormValues) =>
        set({
            instagram_url: values.instagram_url,
            website_url: values.website_url,
            files: values.files,
        }),
}));
