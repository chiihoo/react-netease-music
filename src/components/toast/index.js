import notificationObj from './notification'
import './index.scss'

let notification
const notice = (content, duration = 2000, onClose) => {
  if (!notification) notification = notificationObj
  return notification.addNotice({ content, duration, onClose })
}

export default {
  info(content, duration, onClose) {
    return notice(content, duration, onClose)
  }
}
