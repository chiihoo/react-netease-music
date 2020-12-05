import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import './index.scss'

// 验证码输入框
const VerificationCodeInput = props => {
  const { verificationCode = '', setVerificationCode, codeLength = 4, callback } = props

  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (callback && verificationCode.length === codeLength) {
      callback(verificationCode)
    }
  }, [callback, verificationCode, codeLength])

  return (
    <div className="verification-code-input">
      <input
        type="text"
        id="verification-code-input"
        value={verificationCode}
        maxLength={codeLength}
        autoFocus
        readOnly={verificationCode.length === codeLength && 'readonly'}
        onChange={e => {
          // 只能输入数字
          if (/^\d*?$/.test(e.target.value)) {
            setVerificationCode(e.target.value)
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <label htmlFor="verification-code-input">
        {Array(codeLength)
          .fill('')
          .map((item, index) => (
            // 用label标签来使得点击每个小区域，都会聚焦到这个input上
            <span
              key={index}
              className={classNames({
                'coruscate-animated': focused && index === verificationCode.length
              })}
            >
              {verificationCode[index]}
            </span>
          ))}
      </label>
    </div>
  )
}

export default React.memo(VerificationCodeInput)
