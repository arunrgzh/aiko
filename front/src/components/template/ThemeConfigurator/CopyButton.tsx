import Notification from '@/components/ui/Notification'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import { themeConfig } from '@/configs/theme.config'
import useTheme from '@/utils/hooks/useTheme'
import useResponsive from '@/utils/hooks/useResponsive'
import { useTranslations } from 'next-intl'

const CopyButton = () => {
    const theme = useTheme((state) => state)
    const { larger } = useResponsive()
    const t = useTranslations('themeConfig')
    const handleCopy = () => {
        const config = {
            ...themeConfig,
            ...theme,
            layout: {
                type: theme.layout.type,
                sideNavCollapse: theme.layout.sideNavCollapse,
            },
            panelExpand: false,
        }

        navigator.clipboard.writeText(`
            
export const themeConfig: ThemeConfig = ${JSON.stringify(config, null, 2)}
`)

        toast.push(
            <Notification
                title="Copy Success"
                type="success"
                className="text-sm md:text-base"
            >
                {`Please replace themeConfig in 'src/configs/theme.config.ts'`}
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <Button
            block
            variant="solid"
            onClick={handleCopy}
            size={larger.md ? 'md' : 'sm'}
            className="text-sm md:text-base h-8 md:h-10"
        >
            {t('saveChanges')}
        </Button>
    )
}

export default CopyButton
