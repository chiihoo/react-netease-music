import React from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { guidGenerator } from '@/utils/tools'

class Notification extends React.Component {
  state = { notices: [] }
  transitionTime = 300

  addNotice = notice => {
    let key = guidGenerator()
    this.setState({ notices: [{ ...notice, key }, ...this.state.notices] })
    if (notice.duration > 0) {
      setTimeout(() => {
        this.removeNotice(key)
      }, notice.duration)
    }
  }
  removeNotice = key => {
    this.setState({
      notices: this.state.notices.filter(item => {
        if (item.key === key) {
          // 关闭时触发的回调函数
          item.onClose && setTimeout(item.onClose, this.transitionTime)
          return false
        }
        return true
      })
    })
  }

  render() {
    return (
      <TransitionGroup className="toast-notification">
        {this.state.notices.map(item => (
          <CSSTransition
            key={item.key}
            timeout={this.transitionTime}
            classNames="toast-notice-wrapper notice"
          >
            <p>{item.content}</p>
          </CSSTransition>
        ))}
      </TransitionGroup>
    )
  }
}

function createNotification() {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const ref = React.createRef()
  ReactDOM.render(<Notification ref={ref} />, div)
  return {
    addNotice(notice) {
      return ref.current.addNotice(notice)
    },
    destory() {
      ReactDOM.unmountComponentAtNode(div)
      document.body.removeChild(div)
    }
  }
}

export default createNotification()
