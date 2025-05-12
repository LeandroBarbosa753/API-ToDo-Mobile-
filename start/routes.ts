import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')
const SessionController = () => import('#controllers/session_controller')
const TasksController = () => import('#controllers/tasks_controller')
import { middleware } from './kernel.js'

router.post('session', [SessionController, 'store'])

router.resource('users', UsersController).apiOnly()
router
  .group(() => {
    router.resource('task', TasksController).apiOnly()
  })
  .use(middleware.auth())
