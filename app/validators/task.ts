import vine from '@vinejs/vine'

export const createTaskValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    description: vine.string().optional(),
  })
)

export const updateTaskValidator = vine.compile(
  vine.object({
    title: vine.string().trim().optional(),
    description: vine.string().optional(),
    done: vine.boolean().optional(),
  })
)
