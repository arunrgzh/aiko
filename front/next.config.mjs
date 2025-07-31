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
    // Hide all development indicators and warnings
    devIndicators: false,
    // Disable development warnings
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
    // Disable Turbopack warnings if using Turbopack
    experimental: {
        // Disable Turbopack warnings
        turbo: {
            rules: {},
        },
    },
}

export default withNextIntl(nextConfig)
