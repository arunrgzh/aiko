import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import appConfig from '@/configs/app.config'
import { COOKIES_KEY } from '@/constants/app.constant'

export default getRequestConfig(async () => {
    // Read locale directly from cookies instead of using server action
    const cookieStore = await cookies()
    const locale =
        cookieStore.get(COOKIES_KEY.LOCALE)?.value || appConfig.locale

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
    }
})
