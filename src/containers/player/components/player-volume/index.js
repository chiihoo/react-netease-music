import React, { useCallback } from 'react'
import Slider from '@/components/slider'

import './index.scss'

// 歌词上方的音量调节部分
const PlayerVolume = props => {
  //volume为 0~1 的小数
  const { volume, changeVolume } = props

  const onMoving = useCallback(
    stepCount => {
      changeVolume(stepCount / 10)
    },
    [changeVolume]
  )
  const onAfterChange = useCallback(
    stepCount => {
      changeVolume(stepCount / 10)
    },
    [changeVolume]
  )

  return (
    <div className="palyer-volume">
      <div className="volume-controller">
        <i className="iconfont icon-laba1"></i>
        <div className="slider-wrapper">
          <Slider
            max={10}
            step={1}
            value={volume * 10}
            onMoving={onMoving}
            onAfterChange={onAfterChange}
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(PlayerVolume)
