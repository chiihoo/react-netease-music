import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import toast from '@/components/toast'
import VerificationCodeInput from '@/components/verification-code-input'
import { useEventListener } from '@/hooks'
import {
  fetchCheckCellphoneExistence,
  fetchSentVerificationCode,
  fetchVerifyVerificationCode,
  fetchRegister
} from '@/api'
import { fetchLogin } from '@/api'
import { useInterval } from '@/hooks'
import { useStores } from '@/stores'
import './index.scss'

// 登录界面
const Login = props => {
  const history = useHistory()

  const { loginStore } = useStores()

  const [phone, setPhone] = useState('')

  // loginRegisterInitPage、loginPasswordPage、registerCodePage、registerPasswordPage、registerNicknamePage
  // 登录注册初始页面、登录输入密码页面、注册输入验证码页面、注册输入密码页面、注册输入昵称页面
  const [page, setPage] = useState('loginRegisterInitPage')

  const [loginPassword, setLoginPassword] = useState('') // 登录时输入的登录密码

  const [verificationCode, setVerificationCode] = useState('') // 注册时输入的验证码
  const [countdown, setCountdown] = useState(60) // 重新获取验证码倒计时

  const [registerPassword, setRegisterPassword] = useState('') // 注册时设置的密码
  const [registerNickname, setRegisterNickname] = useState('') // 注册时设置的昵称

  const [isAggrementChecked, setIsAggrementChecked] = useState(false) // 注册设置昵称页面中，是否同意服务条款

  // 返回
  const goBack = () => {
    if (page === 'loginRegisterInitPage') {
      history.goBack()
    } else if (page === 'loginPasswordPage' || page === 'registerCodePage') {
      setPage('loginRegisterInitPage')
    } else if (page === 'registerPasswordPage') {
      setPage('registerCodePage')
    } else if (page === 'registerNicknamePage') {
      setPage('registerPasswordPage')
    }
  }

  // https://blog.csdn.net/itbrand/article/details/109239620
  let reg_tel = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/ // 11位手机号码正则，\d{8}的意思是以前面3位139之类的数字开头的11位（3+8）数字

  // 登录注册初始页面的下一步
  const loginRegisterInitPageNextStep = async () => {
    if (phone.length < 11) {
      toast.info('请输入11位手机号')
    } else if (!reg_tel.test(phone)) {
      toast.info('手机号格式错误')
    } else {
      const { exist } = await fetchCheckCellphoneExistence(phone)
      if (exist === 1) {
        // 手机号已注册
        // 跳到登录输入密码页面
        setPage('loginPasswordPage')
      } else {
        // 手机号未注册
        // 发送手机验证码,并注册输入验证码页面
        setPage('registerCodePage')
        fetchSentVerificationCode(phone)
      }
    }
  }

  // 登录页面
  // 输入登录密码的下一步
  const loginPasswordPageNextStep = () => {
    fetchLogin(phone, loginPassword).then(res => {
      if (res?.code === 502) {
        // 密码错误
        toast.info(res.msg)
      } else {
        toast.info('登录成功')
        history.goBack()
        loginStore.getAccountInfo()
        loginStore.changeLoginStatus(true)
      }
    })
  }

  // 注册页面
  // 输入验证码页面的下一步，验证码输入四位后，自动进行校验
  const registerCodePageNextStep = () => {
    fetchVerifyVerificationCode(phone, verificationCode)
      .then(res => {
        // 验证码正确成功
        setPage('registerPasswordPage')
      })
      .catch(err => {
        // 验证码错误
        toast.info('验证码错误')
        setVerificationCode('')
      })
  }

  // 重新获取验证码
  const regainCode = () => {
    setCountdown(60)
    fetchSentVerificationCode(phone)
  }

  // 可以重新获取验证码时间 -1s
  useInterval(() => {
    if (page === 'registerCodePage' && countdown > 0) {
      setCountdown(countdown => countdown - 1)
    }
  }, 1000)

  // 注册设置登录密码
  const registerPasswordPageNextStep = () => {
    if (registerPassword.length >= 6) {
      setPage('registerNicknamePage')
    } else {
      toast.info('密码应不少于6位')
    }
  }

  // 注册输入昵称，下一步完成注册，并将页面跳转回去
  const registerNicknamePageNextStep = () => {
    if (isAggrementChecked) {
      fetchRegister(phone, registerPassword, verificationCode, registerNickname).then(res => {
        if (res?.code === 505) {
          // 该昵称已被占用
          toast.info(res.msg)
        } else {
          toast.info('注册成功')
          history.goBack()
        }
      })
    } else {
      toast.info('请勾选服务条款')
    }
  }

  // 监听回车
  useEventListener('keypress', e => {
    if (e.key === 'Enter') {
      switch (page) {
        case 'loginRegisterInitPage':
          loginRegisterInitPageNextStep()
          break
        case 'loginPasswordPage':
          loginPasswordPageNextStep()
          break
        case 'registerPasswordPage':
          registerPasswordPageNextStep()
          break
        case 'registerNicknamePage ':
          registerNicknamePageNextStep()
          break
        default:
          break
      }
    }
  })

  return (
    <div className="login">
      <header>
        <i className="iconfont icon-fanhui" onClick={() => goBack()}></i>
        <span>手机号登录</span>
      </header>

      {/* 登录注册：初始页面 */}
      {page === 'loginRegisterInitPage' && (
        <div className="login-register-init-page">
          <p className="notice">登录体验更多精彩</p>
          <p className="notice-small">未注册手机号登录后将自动创建账号</p>
          <div className="phone-input-box">
            <div className="phone-input">
              <span style={{ color: phone.length > 0 && '#000' }}>+86</span>
              <input
                type="text"
                placeholder="请输入手机号"
                value={phone}
                maxLength="11"
                autoFocus
                onChange={e => {
                  // 只能输入数字
                  if (/^\d*?$/.test(e.target.value)) {
                    setPhone(e.target.value)
                  }
                }}
              />
              {phone.length > 0 && (
                <i className="iconfont icon-quxiao" onClick={() => setPhone('')}></i>
              )}
            </div>
          </div>
          <button className="next-step" onClick={loginRegisterInitPageNextStep}>
            下一步
          </button>
        </div>
      )}

      {/* 登录：输入密码页面 */}
      {page === 'loginPasswordPage' && (
        <div className="login-password-page">
          <div className="password-input-box">
            <div className="password-input">
              <input
                type="password"
                placeholder="请输入密码"
                value={loginPassword}
                autoFocus
                onChange={e => setLoginPassword(e.target.value)}
              />
              <a
                href="http://reg.163.com/naq/findPassword#/verifyAccount"
                target="_blank"
                rel="noopener noreferrer"
              >
                忘记密码？
              </a>
            </div>
          </div>
          <button className="next-step" onClick={loginPasswordPageNextStep}>
            下一步
          </button>
        </div>
      )}

      {/* 注册：输入手机验证码页面 */}
      {page === 'registerCodePage' && (
        <div className="register-code-page">
          <p className="notice">请输入验证码</p>
          <p className="phone-countdown">
            <span>已发送至+86 {phone.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')}</span>
            {countdown > 0 ? (
              <span>{countdown}s</span>
            ) : (
              <span className="again-gain" onClick={regainCode}>
                重新获取
              </span>
            )}
          </p>
          <VerificationCodeInput
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            codeLength={4}
            callback={registerCodePageNextStep}
          />
        </div>
      )}

      {/* 注册：输入密码页面 */}
      {page === 'registerPasswordPage' && (
        <div className="register-password-page">
          <div className="password-input-box">
            <div className="password-input">
              <input
                type="password"
                placeholder="设置登录密码，不少于6位"
                value={registerPassword}
                autoFocus
                onChange={e => setRegisterPassword(e.target.value)}
              />
              {registerPassword.length > 0 && (
                <i className="iconfont icon-quxiao" onClick={() => setRegisterPassword('')}></i>
              )}
            </div>
          </div>
          <button className="next-step" onClick={registerPasswordPageNextStep}>
            下一步
          </button>
        </div>
      )}

      {/* 注册：输入昵称页面 */}
      {page === 'registerNicknamePage' && (
        <div className="register-nickname-page">
          <p className="notice">你希望大家怎么称呼你呢？</p>
          <div className="nickname-input-box">
            <div className="nickname-input">
              <input
                type="text"
                placeholder="请输入昵称"
                value={registerNickname}
                autoFocus
                onChange={e => setRegisterNickname(e.target.value)}
              />
              {registerNickname.length > 0 && (
                <i className="iconfont icon-quxiao" onClick={() => setRegisterNickname('')}></i>
              )}
            </div>
          </div>
          <button className="next-step" onClick={registerNicknamePageNextStep}>
            开启云音乐
          </button>
          <label>
            <input
              type="checkbox"
              checked={isAggrementChecked}
              onChange={e => {
                setIsAggrementChecked(e.target.checked)
              }}
            />
            <span>
              同意以下协议
              <a
                href="https://music.163.com/html/web2/service.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                《网易云音乐服务条款》
              </a>
            </span>
          </label>
        </div>
      )}
    </div>
  )
}

export default React.memo(Login)
