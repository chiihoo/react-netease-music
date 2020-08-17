import React, { useCallback } from 'react'
import { useObserver } from 'mobx-react-lite'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useStores } from '@/stores'
import Dialog from '@/components/dialog'
import './index.scss'

// 清空播放列表的确认对话框
const DeleteAllDialog = () => {
  const { triggerStore, playerStore } = useStores()

  const match = useRouteMatch('/player')
  const history = useHistory()

  const onOk = useCallback(() => {
    playerStore.deleteAll()
    triggerStore.changeShowDeleteAllDialog(false)
    triggerStore.changeShowPlayListDrawer(false)
    if (match !== null) {
      history.goBack()
    }
    // eslint-disable-next-line
  }, [history, match])

  const onCancle = useCallback(() => {
    triggerStore.changeShowDeleteAllDialog(false)
    // eslint-disable-next-line
  }, [])

  return useObserver(() => (
    <Dialog visible={triggerStore.showDeleteAllDialog} onCancle={onCancle}>
      <div className="delete-all-dialog">
        <div className="content">
          <p>确定要清空播放列表？</p>
          <ul className="options">
            <li onClick={onCancle}>取消</li>
            <li onClick={onOk}>清空</li>
          </ul>
        </div>
      </div>
    </Dialog>
  ))
}

export default React.memo(DeleteAllDialog)
