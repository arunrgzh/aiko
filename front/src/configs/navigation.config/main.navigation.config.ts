import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM
} from '@/constants/navigation.constant';
import { ADMIN, USER } from '@/constants/roles.constant';
import type { NavigationTree } from '@/@types/navigation';

const MAIN_PREFIX = '/main';
const ASSISTANTS_PREFIX = '/assistants';

export const navigationConfig: NavigationTree[] = [
    {
                key: 'main.dashboard',
                path: `${MAIN_PREFIX}/dashboard`,
                title: 'nav.main.dashboard',
                translateKey: 'nav.main.dashboard',
                icon: 'dashboard',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: []
    },
            {
                key: 'main.pricing',
                path: `${MAIN_PREFIX}/pricing`,
                title: 'nav.main.pricing',
                translateKey: 'nav.main.pricing',
                icon: 'pricing',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: []
            },
            {
                key: 'main.blog',
                path: `${MAIN_PREFIX}/blog`,
                title: 'nav.main.blog',
                translateKey: 'nav.main.blog',
                icon: 'blog',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: []
            }
            ,

    {
        key: 'assistants',
        path: ASSISTANTS_PREFIX,
        title: 'nav.assistants.assistants',
        translateKey: 'nav.assistants.assistants',
        icon: 'assistant',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        subMenu: [
            {
                key: 'assistants.details',
                path: `${ASSISTANTS_PREFIX}/[id]`,
                title: 'nav.assistants.assistantDetails',
                translateKey: 'nav.assistants.assistantDetails',
                icon: 'details',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    {
                        key: 'assistants.main',
                        path: `${ASSISTANTS_PREFIX}/[id]/main`,
                        title: 'nav.assistants.main.main',
                        translateKey: 'nav.assistants.main.main',
                        icon: 'main',
                        type: NAV_ITEM_TYPE_COLLAPSE,
                        authority: [ADMIN, USER],
                        subMenu: [
                            {
                                key: 'assistants.main.assistant',
                                path: `${ASSISTANTS_PREFIX}/[id]/main/assistant`,
                                title: 'nav.assistants.main.assistant',
                                translateKey: 'nav.assistants.main.assistant',
                                icon: 'assistant',
                                type: NAV_ITEM_TYPE_ITEM,
                                authority: [ADMIN, USER],
                                subMenu: []
                            },
                            {
                                key: 'assistants.main.testing',
                                path: `${ASSISTANTS_PREFIX}/[id]/main/testing`,
                                title: 'nav.assistants.main.testing',
                                translateKey: 'nav.assistants.main.testing',
                                icon: 'testing',
                                type: NAV_ITEM_TYPE_ITEM,
                                authority: [ADMIN, USER],
                                subMenu: []
                            },
                            {
                                key: 'assistants.main.docs',
                                path: `${ASSISTANTS_PREFIX}/[id]/main/documents`,
                                title: 'nav.assistants.main.docs',
                                translateKey: 'nav.assistants.main.docs',
                                icon: 'docs',
                                type: NAV_ITEM_TYPE_ITEM,
                                authority: [ADMIN, USER],
                                subMenu: []
                            },
                            {
                                key: 'assistants.main.correction',
                                path: `${ASSISTANTS_PREFIX}/[id]/main/correction`,
                                title: 'nav.assistants.main.correction',
                                translateKey: 'nav.assistants.main.correction',
                                icon: 'correction',
                                type: NAV_ITEM_TYPE_ITEM,
                                authority: [ADMIN, USER],
                                subMenu: []
                            }
                        ]
                    },
                    {
                        key: 'assistants.analytics',
                        path: `${ASSISTANTS_PREFIX}/[id]/analytics`,
                        title: 'nav.assistants.analytic.analytic',
                        translateKey: 'nav.assistants.analytic.analytic',
                        icon: 'analytic',
                        type: NAV_ITEM_TYPE_COLLAPSE,
                        authority: [ADMIN, USER],
                        subMenu: [
                            {
                                key: 'assistants.analytic.statistic',
                                path: `${ASSISTANTS_PREFIX}/[id]/analytics/statistic`,
                                title: 'nav.assistants.analytic.statistic',
                                translateKey: 'nav.assistants.analytic.statistic',
                                icon: 'statistic',
                                type: NAV_ITEM_TYPE_ITEM,
                                authority: [ADMIN, USER],
                                subMenu: []
                            },
                            {
                                key: 'assistants.analytic.messages',
                                path: `${ASSISTANTS_PREFIX}/[id]/analytics/messages`,
                                title: 'nav.assistants.analytic.messages',
                                translateKey: 'nav.assistants.analytic.messages',
                                icon: 'messages',
                                type: NAV_ITEM_TYPE_ITEM,
                                authority: [ADMIN, USER],
                                subMenu: []
                            }
                        ]
                    },
                    {
                        key: 'assistants.integration',
                        path: `${ASSISTANTS_PREFIX}/[id]/integration`,
                        title: 'nav.assistants.integration.integration',
                        translateKey: 'nav.assistants.integration.integration',
                        icon: 'integration',
                        type: NAV_ITEM_TYPE_COLLAPSE,
                        authority: [ADMIN, USER],
                        subMenu: [
                            {
                                key: 'assistants.integration.messengers',
                                path: `${ASSISTANTS_PREFIX}/[id]/integration/messengers`,
                                title: 'nav.assistants.integration.messengers',
                                translateKey: 'nav.assistants.integration.messengers',
                                icon: 'messengers',
                                type: NAV_ITEM_TYPE_ITEM,
                                authority: [ADMIN, USER],
                                subMenu: []
                            },
                            {
                                key: 'assistants.integration.newsletters',
                                path: `${ASSISTANTS_PREFIX}/[id]/integration/newsletters`,
                                title: 'nav.assistants.integration.newsletters',
                                translateKey: 'nav.assistants.integration.newsletters',
                                icon: 'newsletters',
                                type: NAV_ITEM_TYPE_ITEM,
                                authority: [ADMIN, USER],
                                subMenu: []
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
export default navigationConfig;