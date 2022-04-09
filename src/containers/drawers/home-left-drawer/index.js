import React, { useCallback } from 'react'
import { useObserver } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import Drawer from '@/components/drawer'
import { useStores } from '@/stores'
import './index.scss'

// home页面左侧的抽屉，点击home页面左上角的菜单键触发
const HomeLeftDrawer = () => {
  const { triggerStore, loginStore } = useStores()

  const history = useHistory()

  const onClose = useCallback(() => {
    triggerStore.changeShowHomeLeftDrawer(false)
    // eslint-disable-next-line
  }, [])

  return useObserver(() => (
    <Drawer placement="left" visible={triggerStore.showHomeLeftDrawer} onClose={onClose}>
      <div className="home-left-drawer">
        <div className="content">
          <div className="header">
            {loginStore.isLogin ? (
              <div className="has-login">
                <div className="wrapper">
                  <div
                    className="avatar"
                    style={{
                      background: `url(${loginStore.accountInfo.profile?.avatarUrl}?parmas=200y200) center/cover no-repeat`
                    }}
                  ></div>
                  <p>{loginStore.accountInfo.profile?.nickname}</p>
                </div>
              </div>
            ) : (
              <div className="no-login">
                <div>
                  <p>登录网易云音乐</p>
                  <p>手机电脑多端同步，尽享海量高品质音乐</p>
                </div>
                <p
                  className="login-right-now"
                  onClick={() => {
                    onClose()
                    history.push('/login')
                  }}
                >
                  立即登录
                </p>
              </div>
            )}
          </div>
          <ul>
            <li>开发者：chiihoo</li>
            <li>
              GitHub：
              <a
                href="https://github.com/chiihoo/react-netease-music"
                target="_blank"
                rel="noopener noreferrer"
              >
                react-netease-music
              </a>
            </li>
          </ul>
          {loginStore.isLogin && (
            <p
              className="logout"
              onClick={async () => {
                // 由于接口做了缓存处理（2分钟），因此短时间内的再次退出登录，可能会无效
                await loginStore.logout()
                loginStore.changeLoginStatus(false)
                document.location.reload()
              }}
            >
              <i className="iconfont icon-tuichu"></i>
              <span>退出登录</span>
            </p>
          )}
        </div>
      </div>
    </Drawer>
  ))
}

export default React.memo(HomeLeftDrawer)
