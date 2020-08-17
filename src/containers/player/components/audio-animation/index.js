import React, { useRef, useEffect, useState } from 'react'
import { useRafLoop, useEventListener } from '@/hooks'
import './index.scss'

// 播放页面音频动效
const AudioAnimation = props => {
  const { updateDataArray, dataArray, picUrl, isPlaying } = props

  const canvasWrapperRef = useRef()
  const canvasRef = useRef()
  const coverRef = useRef()

  // canvas宽高
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()
  // 图片宽
  const [coverWidth, setCoverWidth] = useState()

  useEffect(() => {
    setWidth(canvasWrapperRef.current.offsetWidth)
    setHeight(canvasWrapperRef.current.offsetHeight)
    setCoverWidth(coverRef.current.offsetWidth)
  }, [])

  useEventListener('resize', () => {
    setWidth(canvasWrapperRef.current.offsetWidth)
    setHeight(canvasWrapperRef.current.offsetHeight)
    setCoverWidth(coverRef.current.offsetWidth)
  })

  const handleRaf = () => {
    const ctx = canvasRef.current.getContext('2d')
    // canvas 360度 为 Math.PI * 2
    ctx.clearRect(0, 0, width, height)

    // 原点移动正中心
    ctx.save()
    ctx.translate(width / 2, height / 2)

    // 波浪
    // dataArray每个的取值为0~255，数组长度为256个，但是180以后几乎为0，150~180之间数字也较小
    // 这里选取50一组，分为3组
    // 先逆时针旋转1/4，让初始点在正上方
    ctx.rotate(-Math.PI / 2)
    const angle = (Math.PI * 2) / 50
    const pos = []
    // ctx.globalAlpha = 0.3
    for (let i = 0; i < 180; i++) {
      let len
      // 第1个值较大，第50个值较小，如果圆上首尾相连，容易搭不上，所以把前几个值按比例缩小
      if (i < 50) {
        len = (coverWidth / 2) * (1.05 + dataArray[i] / 255 / (5 - i / 30))
      } else {
        len = (coverWidth / 2) * (1.05 + dataArray[i] / 255 / 2)
      }
      pos.push({ x: len * Math.cos(angle * i), y: len * Math.sin(angle * i) })
    }

    for (let j = 0; j <= 100; j += 50) {
      ctx.beginPath()
      if (j === 0) {
        ctx.fillStyle = 'rgba(219, 90, 108, 0.3)'
      } else if (j === 50) {
        ctx.fillStyle = 'rgba(255, 230, 0, 0.3)'
      } else if (j === 100) {
        ctx.fillStyle = 'rgba(0, 153, 255, 0.3)'
      }
      // 贝塞尔曲线
      ctx.moveTo(pos[j].x, pos[j].y)
      for (let i = j + 1; i < j + 48; i++) {
        let x_mid = (pos[i].x + pos[i + 1].x) / 2
        let y_mid = (pos[i].y + pos[i + 1].y) / 2
        ctx.quadraticCurveTo(pos[i].x, pos[i].y, x_mid, y_mid)
      }
      let x_mid = (pos[j + 49].x + pos[j].x) / 2
      let y_mid = (pos[j + 49].y + pos[j].y) / 2
      ctx.quadraticCurveTo(pos[j + 49].x, pos[j + 49].y, x_mid, y_mid)

      x_mid = (pos[j].x + pos[j + 1].x) / 2
      y_mid = (pos[j].y + pos[j + 1].y) / 2
      ctx.quadraticCurveTo(pos[j].x, pos[j].y, x_mid, y_mid)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()

    // 线条
    // const angle = (Math.PI * 2) / 200
    // for (let i = 0; i < 200; i++) {
    //   ctx.save()
    //   ctx.rotate(angle * i)
    //   ctx.beginPath()
    //   ctx.strokeStyle = '#fff'
    //   ctx.lineWidth = 2
    //   ctx.moveTo(0, -(coverWidth / 2 + 10))
    //   ctx.lineTo(0, -(coverWidth / 2 + 10) * (1 + dataArray[i < 100 ? i : 200 - i] / 255 / 2.5))
    //   ctx.stroke()
    //   ctx.closePath()
    //   ctx.restore()
    // }
  }

  const [stopRaf, startRaf] = useRafLoop(timeDiff => {
    updateDataArray()
    // updateDataArray即analyser.getByteFrequencyData(dataArray)
    handleRaf()
  })

  // 初始化的时候，圆圈边缘没有颜色，这里在初始的时候运行一次handleRaf()
  useEffect(() => {
    handleRaf()
    // eslint-disable-next-line
  }, [width, height, coverWidth])

  useEffect(() => {
    isPlaying ? startRaf() : stopRaf()
  }, [isPlaying, startRaf, stopRaf])

  return (
    <div className="audio-animation" ref={canvasWrapperRef}>
      <canvas ref={canvasRef} width={width} height={height}></canvas>
      <div className="player-cover" ref={coverRef}>
        <img src={require('@/assets/svg-icons/cover-bg.svg')} alt="" />
        <img
          key={picUrl}
          className="rotate"
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          src={picUrl + '?param=500y500'}
          alt=""
        />
      </div>
    </div>
  )
}
export default React.memo(AudioAnimation)
