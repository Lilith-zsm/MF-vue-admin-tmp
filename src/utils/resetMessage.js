import {
  Message
} from 'element-ui'
let messageInstance = null
const resetMessage = (options) => {
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = Message(options)
}
['error', 'success', 'info', 'warning'].forEach(type => {
  resetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options,
        type: type,
        showClose: true
      }
    }
    return resetMessage(options)
  }
})
resetMessage.close = () => {
  if (messageInstance) {
    messageInstance.close()
  }
}
export const message = resetMessage
