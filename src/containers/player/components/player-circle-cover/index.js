import React from 'react'
import classNames from 'classnames'
import './index.scss'

// 播放页面圆形旋转封面、以及鲸云动效
const PlayerCircleCover = props => {
  const { coverImgUrl, isPlaying } = props

  return (
    <div className="player-circle-cover">
      <div className="circle-cover-img-wrapper">
        <img
          key={coverImgUrl}
          className={classNames('rotate')}
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          src={coverImgUrl + '?params=100y100'}
          alt=""
        />
      </div>
    </div>
  )
}
export default React.memo(PlayerCircleCover)
