import React, { useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '@/stores'
import HotwallNav from './components/HotwallNav'
import './index.scss'

const Yuncun = () => {
  const { YuncunStore } = useStores()

  useEffect(() => {
    YuncunStore.getYuncunData()
  }, [YuncunStore])

  return useObserver(() => (
    <div className="yun-cun">
      <div className="hotwall-nav-wrapper">
        {YuncunStore.hotwallNavList.length > 0 && (
          <HotwallNav hotwallNavList={YuncunStore.hotwallNavList} />
        )}
      </div>
    </div>
  ))
}
export default React.memo(Yuncun)
