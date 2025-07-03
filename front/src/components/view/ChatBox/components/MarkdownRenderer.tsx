import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
    oneDark,
    oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import useTheme from '@/utils/hooks/useTheme'
import { MODE_DARK } from '@/constants/theme.constant'

interface MarkdownRendererProps {
    content: string
    className?: string
}

const MarkdownRenderer = ({
    content,
    className = '',
}: MarkdownRendererProps) => {
    const mode = useTheme((state) => state.mode)
    const isDark = mode === MODE_DARK

    // Clean up the content by handling common formatting issues
    const cleanContent = content
        // Replace multiple consecutive line breaks with double line breaks for paragraphs
        .replace(/\n{3,}/g, '\n\n')
        // Fix numbered lists
        .replace(/(\d+)\.\s+/g, '\n$1. ')
        // Fix bullet points
        .replace(/[-*]\s+/g, '\n- ')
        // Add spacing around headers
        .replace(/#{1,6}\s+(.+)/g, '\n\n$&\n')
        // Ensure proper spacing around sections marked with ###
        .replace(/---\s*#{3,}\s*\*\*(.+?)\*\*\s*#{3,}/g, '\n\n### $1\n')
        // Clean up any remaining formatting markers
        .replace(/#{3,}/g, '')
        // Fix sections that might be marked with **Part X:**
        .replace(/\*\*(.+?):\*\*/g, '\n\n**$1:**\n')
        // Ensure proper line breaks before and after major sections
        .replace(/(\n|^)(\d+\.\s+[А-Яа-я])/g, '\n\n$2')
        .trim()

    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Custom heading renderer
                    h1: ({ children }) => (
                        <h1 className="text-xl font-bold mb-3 mt-4 text-gray-900 dark:text-gray-100">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-lg font-bold mb-2 mt-3 text-gray-900 dark:text-gray-100">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-base font-bold mb-2 mt-3 text-gray-900 dark:text-gray-100">
                            {children}
                        </h3>
                    ),
                    // Custom paragraph renderer
                    p: ({ children }) => (
                        <p className="mb-3 text-gray-800 dark:text-gray-200 leading-relaxed">
                            {children}
                        </p>
                    ),
                    // Custom list renderers
                    ul: ({ children }) => (
                        <ul className="mb-3 ml-4 space-y-1 text-gray-800 dark:text-gray-200">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-3 ml-4 space-y-1 text-gray-800 dark:text-gray-200 list-decimal">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-gray-800 dark:text-gray-200 leading-relaxed">
                            {children}
                        </li>
                    ),
                    // Custom strong/bold renderer
                    strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900 dark:text-gray-100">
                            {children}
                        </strong>
                    ),
                    // Custom emphasis/italic renderer
                    em: ({ children }) => (
                        <em className="italic text-gray-800 dark:text-gray-200">
                            {children}
                        </em>
                    ),
                    // Custom code block renderer
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match ? match[1] : ''
                        const isCodeBlock =
                            language && String(children).includes('\n')

                        if (isCodeBlock) {
                            return (
                                <div className="my-4">
                                    <SyntaxHighlighter
                                        style={isDark ? oneDark : oneLight}
                                        language={language}
                                        PreTag="div"
                                        className="rounded-lg"
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            )
                        }

                        return (
                            <code
                                className="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono"
                                {...props}
                            >
                                {children}
                            </code>
                        )
                    },
                    // Custom blockquote renderer
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-3 italic text-gray-700 dark:text-gray-300">
                            {children}
                        </blockquote>
                    ),
                    // Custom horizontal rule
                    hr: () => (
                        <hr className="my-4 border-gray-300 dark:border-gray-600" />
                    ),
                    // Custom link renderer
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {children}
                        </a>
                    ),
                }}
            >
                {cleanContent}
            </ReactMarkdown>
        </div>
    )
}

export default MarkdownRenderer
