import { useState, useEffect } from 'react'
import {Button, Input, Card} from '@/components/ui'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from '@hello-pangea/dnd'
import { HiOutlineTrash, HiOutlineMenu } from 'react-icons/hi'
import {Instruction} from "../types"

interface InstructionsInputProps {
    value: Instruction[]
    onChange: (instructions: Instruction[]) => void
}

export default function InstructionsInput({ value, onChange }: InstructionsInputProps) {
    const [instructions, setInstructions] = useState<Instruction[]>([])

    useEffect(() => {
        const sorted = [...value].sort((a, b) => a.order - b.order)
        setInstructions(sorted)
    }, [value])

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const updatedList = Array.from(instructions)
        const [moved] = updatedList.splice(result.source.index, 1)
        updatedList.splice(result.destination.index, 0, moved)

        const reordered = updatedList.map((inst, idx) => ({ ...inst, order: idx + 1 }))
        setInstructions(reordered)
        onChange(reordered)
    }

    const handleTextChange = (index: number, text: string) => {
        const updated = instructions.map((inst, idx) =>
            idx === index ? { ...inst, text } : inst
        )
        setInstructions(updated)
        onChange(updated)
    }

    const handleDelete = (index: number) => {
        const filtered = instructions.filter((_, idx) => idx !== index)
        const reindexed = filtered.map((inst, idx) => ({ ...inst, order: idx + 1 }))
        setInstructions(reindexed)
        onChange(reindexed)
    }

    const handleAdd = () => {
        const nextOrder = instructions.length + 1
        const newList = [...instructions, { order: nextOrder, text: '' }]
        setInstructions(newList)
        onChange(newList)
    }


    return (
        <div>
            <div className={'overflow-y-scroll max-h-[524px] mb-3'}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="instructions-droppable">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {instructions.map((inst, idx) => (
                                <Draggable
                                    key={inst.order}
                                    draggableId={`${inst.order}`}
                                    index={idx}
                                >
                                    {(provided) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            bodyClass={'flex items-center mb-2 p-2'}
                                            className={'mb-2'}
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className="mr-2 cursor-grab "
                                            >
                                                <HiOutlineMenu size={20} />
                                            </div>
                                            <Input
                                                type="text"
                                                value={inst.text}
                                                onChange={(e) => {
                                                    handleTextChange(idx, e.target.value)
                                                }}
                                                placeholder={`Шаг ${inst.order}`}
                                            />
                                            <Button
                                                variant={'plain'}
                                                type="button"
                                                onClick={() => handleDelete(idx)}
                                            >
                                                <HiOutlineTrash size={20} />
                                            </Button>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            </div>
            <Button
                type="button"
                onClick={handleAdd}
            >
                Добавить шаг
            </Button>
        </div>
    )
}
