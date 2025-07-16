import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // уже добавлено
    },
    typescript: {
        ignoreBuildErrors: true, // ⛔️ пропускаем ошибки TS во время билда
    },
}

export default withNextIntl(nextConfig)
