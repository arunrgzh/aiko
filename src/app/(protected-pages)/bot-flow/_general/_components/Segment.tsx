import classNames from 'classnames'
import Segment from '@/components/ui/Segment'
import { HiCheckCircle } from 'react-icons/hi'

interface FormSegmentProps<T extends { value: string; desc: string }> {
    selections: T[]
    value: T['value']
    onChange: (option: T['value']) => void
}

export default function FormSegment<T extends { value: string; desc: string }>({ selections, value, onChange, }: FormSegmentProps<T>) {
    return (
        <Segment
            onChange={(option) => {
                onChange(option as T['value'])
            }}
            defaultValue={[value]}
            className="gap-4 md:flex-row flex-col bg-transparent dark:bg-transparent flex-wrap"
        >
            {selections.map((item) => (
                <Segment.Item key={item.value} value={item.value}>
                    {({ active, value: itemValue, onSegmentItemClick, disabled }) => (
                        <div
                            className={classNames(
                                'flex',
                                'ring-1',
                                'justify-between',
                                'border',
                                'rounded-xl',
                                'dark:bg-transparent',
                                'border-gray-300',
                                'dark:border-gray-600',
                                'py-5 px-4',
                                'grow',
                                'select-none',
                                'md:w-[260px]',
                                active
                                    ? 'ring-primary border-primary'
                                    : 'ring-transparent bg-gray-100',
                                disabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:ring-primary hover:border-primary cursor-pointer',
                            )}
                            onClick={onSegmentItemClick}
                            role="button"
                        >
                            <div>
                                <h6>{itemValue}</h6>
                                <p>{item.desc}</p>
                            </div>
                            {active && <HiCheckCircle className="text-primary text-xl" />}
                        </div>
                    )}
                </Segment.Item>
            ))}
        </Segment>
    )
}
