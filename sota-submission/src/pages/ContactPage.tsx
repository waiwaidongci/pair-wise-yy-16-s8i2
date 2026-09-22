import { useMemo, useState, type FormEvent } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Fields = 'name' | 'email' | 'message'
type Status = 'idle' | 'sending' | 'done'

export function ContactPage() {
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState<Record<Fields, boolean>>({
    name: false,
    email: false,
    message: false,
  })
  const [status, setStatus] = useState<Status>('idle')

  const errors = useMemo(
    () => ({
      name: values.name.trim() ? '' : '请填写你的姓名',
      email: !values.email.trim()
        ? '请填写你的邮箱'
        : EMAIL_RE.test(values.email.trim())
          ? ''
          : '请输入有效的邮箱地址',
      message: values.message.trim() ? '' : '请写几句你的拍摄计划',
    }),
    [values],
  )
  const isValid = !errors.name && !errors.email && !errors.message
  const disabled = !isValid || status === 'sending'

  const setValue = (field: Fields) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValues(v => ({ ...v, [field]: event.target.value }))

  const blur = (field: Fields) => () => setTouched(t => ({ ...t, [field]: true }))

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isValid) {
      setTouched({ name: true, email: true, message: true })
      return
    }
    // 无后端：前端模拟发送过程
    setStatus('sending')
    window.setTimeout(() => setStatus('done'), 900)
  }

  const reset = () => {
    setValues({ name: '', email: '', message: '' })
    setTouched({ name: false, email: false, message: false })
    setStatus('idle')
  }

  return (
    <div className="container contact">
      <div className="contact-intro">
        <p className="eyebrow gold">Commission</p>
        <h1>约拍</h1>
        <p>
          承接高原地区的肖像委托、纪实拍摄与图片授权。拍摄档期以季节与路况为准，建议提前一个月联系。
        </p>
        <p className="contact-mail">也可以直接写信：hello@linmu.photo</p>
      </div>

      {status === 'done' ? (
        <div className="form-success" role="status">
          <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2>谢谢你的来信</h2>
          <p>消息已经收到。我会在两个工作日内回复你，聊聊拍摄的时间与路线。</p>
          <button type="button" className="btn ghost" onClick={reset}>
            再写一封
          </button>
        </div>
      ) : (
        <form className="contact-form" noValidate onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">姓名</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={setValue('name')}
              onBlur={blur('name')}
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
            />
            {touched.name && errors.name && (
              <p className="field-error" id="name-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="email">邮箱</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={setValue('email')}
              onBlur={blur('email')}
              aria-invalid={touched.email && !!errors.email}
              aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
            />
            {touched.email && errors.email && (
              <p className="field-error" id="email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="message">留言</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={values.message}
              onChange={setValue('message')}
              onBlur={blur('message')}
              aria-invalid={touched.message && !!errors.message}
              aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
            />
            {touched.message && errors.message && (
              <p className="field-error" id="message-error">
                {errors.message}
              </p>
            )}
          </div>

          {/* 校验未通过时按钮禁用；点击禁用态按钮也会展开各字段的行内错误 */}
          <div
            className="submit-wrap"
            onClick={() => {
              if (disabled) setTouched({ name: true, email: true, message: true })
            }}
          >
            <button
              type="submit"
              className="btn submit"
              disabled={disabled}
              style={disabled ? { pointerEvents: 'none' } : undefined}
            >
              {status === 'sending' ? '发送中…' : '发送消息'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
