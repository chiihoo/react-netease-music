import React, { useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '@/stores'
import HotwallNav from './components/hotwall-nav'
import './index.scss'

// 云村
const Yuncun = () => {
  const { yuncunStore } = useStores()

  useEffect(() => {
    yuncunStore.getYuncunData()
    // eslint-disable-next-line
  }, [])

  return useObserver(() => (
    <div className="yun-cun">
      <div className="hotwall-nav-wrapper">
        {yuncunStore.hotwallNavList?.length > 0 && (
          <HotwallNav hotwallNavList={yuncunStore.hotwallNavList} />
        )}
      </div>
      <p>此页面接口失效，暂不显示</p>
    </div>
  ))
}
export default React.memo(Yuncun)
