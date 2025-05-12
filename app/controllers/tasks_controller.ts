import Task from '#models/task'
import { createTaskValidator, updateTaskValidator } from '#validators/task'
import type { HttpContext } from '@adonisjs/core/http'

export default class TasksController {
  async index({ auth }: HttpContext) {
    const user = await auth.user!
    await user.load('tasks')
    return user.tasks
  }
  async store({ request, response, auth }: HttpContext) {
    try {
      const { title, description } = await request.validateUsing(createTaskValidator)
      const user = auth.user!
      await user.related('tasks').create({ title, description })

      return {
        title,
        description,
      }
    } catch (error) {
      return response.status(400).json({ error: 'Error' })
    }
  }
  async show({ params, response }: HttpContext) {
    try {
      const task = await Task.findOrFail(params.id)
      return task
    } catch (error) {
      return response.status(400).json({ error: 'Task not found' })
    }
  }
  async update({ request, params, response }: HttpContext) {
    try {
      const { title, description, done } = await request.validateUsing(updateTaskValidator)
      const task = await Task.findOrFail(params.id)
      task.merge({ title, description, done })
      await task.save()
      return task
    } catch {
      return response.status(400).json({ error: 'Task not found' })
    }
  }
  async destroy({ params, response }: HttpContext) {
    try {
      const task = await Task.findOrFail(params.id)
      await task.delete()
      return response.status(204).send({ message: 'Task deleted' })
    } catch (error) {
      return response.status(400).json({ error: 'Task not found' })
    }
  }
}
