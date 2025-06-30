import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const MAIN_PREFIX = '/main'

export const navigationConfig: NavigationTree[] = [
    {
        key: 'main.all',
        path: `${MAIN_PREFIX}/dashboard`,
        title: 'All',
        translateKey: 'nav.main.all',
        icon: 'apps',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: [],
    },
    {
        key: 'main.questionnaire',
        path: `${MAIN_PREFIX}/questionnaire`,
        title: 'Анкета',
        translateKey: 'nav.main.questionnaire',
        icon: 'fileText',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: [],
    },
    {
        key: 'main.vacancies',
        path: `${MAIN_PREFIX}/vacancies`,
        title: 'Вакансии',
        translateKey: 'nav.main.vacancies',
        icon: 'briefcase',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: [],
    },
    {
        key: 'main.ai-chat',
        path: `${MAIN_PREFIX}/ai-chat`,
        title: 'Чат с ИИ',
        translateKey: 'nav.main.ai-chat',
        icon: 'messageCircle',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: [],
    },
    {
        key: 'main.profile',
        path: `${MAIN_PREFIX}/profile`,
        title: 'Профиль',
        translateKey: 'nav.main.profile',
        icon: 'user',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: [],
    },
    {
        key: 'main.responses',
        path: `${MAIN_PREFIX}/responses`,
        title: 'Мои отклики',
        translateKey: 'nav.main.responses',
        icon: 'heart',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: [],
    },
    {
        key: 'main.interviews',
        path: `${MAIN_PREFIX}/interviews`,
        title: 'Пробные собеседования',
        translateKey: 'nav.main.interviews',
        icon: 'video',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: [],
    },
    {
        key: 'main.settings',
        path: `${MAIN_PREFIX}/settings`,
        title: 'Настройки профиля',
        translateKey: 'nav.main.settings',
        icon: 'settings',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: [],
    },
]

export default navigationConfig
