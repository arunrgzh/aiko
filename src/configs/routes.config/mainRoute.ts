import { ADMIN, USER } from '@/constants/roles.constant';
import type { Routes } from '@/@types/routes';

export const routesConfig: Routes = {
    '/dashboard': {
        key: 'main.dashboard',
        authority: [ADMIN, USER]
    },
    '/pricing': {
        key: 'main.pricing',
        authority: [ADMIN, USER]
    },
    '/blog': {
        key: 'main.blog',
        authority: [ADMIN, USER]
    },

    '/assistants/[id]/main/assistant': {
        key: 'assistants.main.assistant',
        authority: [ADMIN, USER],
        dynamicRoute: true
    },
    '/assistants/[id]/main/testing': {
        key: 'assistants.main.testing',
        authority: [ADMIN, USER],
        dynamicRoute: true
    },
    '/assistants/[id]/main/docs': {
        key: 'assistants.main.docs',
        authority: [ADMIN, USER],
        dynamicRoute: true
    },
    '/assistants/[id]/main/correction': {
        key: 'assistants.main.correction',
        authority: [ADMIN, USER],
        dynamicRoute: true
    },
    '/assistants/[id]/analytic/statisk': {
        key: 'assistants.analytic.statistic',
        authority: [ADMIN, USER],
        dynamicRoute: true
    },
    '/assistants/[id]/analytic/messages': {
        key: 'assistants.analytic.messages',
        authority: [ADMIN, USER],
        dynamicRoute: true
    },
    '/assistants/[id]/integration/messengers': {
        key: 'assistants.integration.messengers',
        authority: [ADMIN, USER],
        dynamicRoute: true
    },
    '/assistants/[id]/integration/newsletters': {
        key: 'assistants.integration.newsletters',
        authority: [ADMIN, USER],
        dynamicRoute: true
    }
};

export default routesConfig;
