/**
 * Utility functions for handling file uploads in chat
 */

export type FileInfo = {
    name: string
    size: number
    type: string
    dataUrl?: string
}

/**
 * Convert File to base64 data URL for preview
 */
export const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

/**
 * Check if file is an image
 */
export const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/')
}

/**
 * Convert File to base64 string (without data URL prefix)
 */
export const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            // Remove data:image/jpeg;base64, prefix to get clean base64
            const base64 = result.split(',')[1]
            resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

/**
 * Convert multiple image files to base64 strings
 */
export const convertFilesToBase64 = async (
    files: File[],
): Promise<string[]> => {
    const imageFiles = files.filter(isImageFile)
    const base64Images: string[] = []

    for (const file of imageFiles) {
        try {
            const base64 = await convertToBase64(file)
            base64Images.push(base64)
        } catch (error) {
            console.error('Ошибка конвертации файла в base64:', error)
        }
    }

    return base64Images
}

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Create a message content with file information
 */
export const createFileMessage = async (
    text: string,
    files: File[],
): Promise<string> => {
    if (files.length === 0) return text

    const fileInfos: string[] = []

    for (const file of files) {
        const sizeFormatted = formatFileSize(file.size)
        const fileType = isImageFile(file) ? 'Изображение' : 'Файл'

        if (isImageFile(file)) {
            try {
                // For images, we could potentially analyze them
                fileInfos.push(`[${fileType}: ${file.name} (${sizeFormatted})]`)
            } catch (error) {
                fileInfos.push(`[${fileType}: ${file.name} (${sizeFormatted})]`)
            }
        } else {
            fileInfos.push(`[${fileType}: ${file.name} (${sizeFormatted})]`)
        }
    }

    const fileDescription = fileInfos.join('\n')

    if (text.trim()) {
        return `${text}\n\n📎 Прикрепленные файлы:\n${fileDescription}`
    } else {
        return `📎 Прикрепленные файлы:\n${fileDescription}`
    }
}

/**
 * Generate AI response for file uploads
 */
export const generateFileAnalysisPrompt = (files: File[]): string => {
    const imageFiles = files.filter(isImageFile)
    const otherFiles = files.filter((f) => !isImageFile(f))

    let prompt = 'Пользователь прикрепил файлы:\n'

    if (imageFiles.length > 0) {
        prompt += `\nИзображения (${imageFiles.length}):\n`
        imageFiles.forEach((file) => {
            prompt += `- ${file.name} (${formatFileSize(file.size)})\n`
        })
    }

    if (otherFiles.length > 0) {
        prompt += `\nДругие файлы (${otherFiles.length}):\n`
        otherFiles.forEach((file) => {
            prompt += `- ${file.name} (${formatFileSize(file.size)})\n`
        })
    }

    if (imageFiles.length > 0) {
        prompt +=
            '\n🔍 Отлично! Я могу анализировать изображения. Опишите, что на них изображено, или просто спросите, что вас интересует - помогу с анализом резюме, вакансий, документов или любых материалов для трудоустройства!'
    } else {
        prompt +=
            '\nЯ получил ваши файлы. Готов помочь с любыми вопросами о поиске работы, составлении резюме или карьерном развитии!'
    }

    return prompt
}
