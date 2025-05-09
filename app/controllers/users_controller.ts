import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  async index({}: HttpContext) {
    const users = await User.query().preload('tasks')
    return users
  }

  async store({ request }: HttpContext) {
    const { name, email, password } = await request.validateUsing(createUserValidator)
    const user = await User.create({ name, email, password })
    return user
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await User.findByOrFail('id', params.id)
      await user.load('tasks')
      return user
    } catch (error) {
      return response.status(404).json({
        error: 'User not found',
      })
    }
  }

  async update({ params, request }: HttpContext) {
    const user = await User.findBy('id', params.id)
    const { name, password } = await request.validateUsing(updateUserValidator)
    user!.merge({ name, password })
    await user!.save()
    return user
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findByOrFail('id', params.id)
      await user.delete()
      return response.status(203)
    } catch (error) {
      return response.status(404).json({
        error: 'User not found',
      })
    }
  }
}
