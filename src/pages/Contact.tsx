import { useMemo, useState } from "react";
import type { FormEvent } from "react";

interface FormValues {
  name: string;
  email: string;
  message: string;
}

type Errors = Partial<Record<keyof FormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "请填写您的称呼。";
  if (!values.email.trim()) errors.email = "请填写邮箱地址。";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "邮箱格式不正确，请检查后重试。";
  if (!values.message.trim()) errors.message = "请简单描述您的拍摄需求。";
  return errors;
}

type SubmitState = "idle" | "sending" | "success";

export function Contact() {
  const [values, setValues] = useState<FormValues>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  // 校验未通过时禁用提交按钮（首次提交尝试后开始实时校验）
  const liveErrors = useMemo(() => (attempted ? validate(values) : {}), [attempted, values]);
  const shownErrors: Errors = attempted ? liveErrors : errors;
  const hasErrors = Object.keys(shownErrors).length > 0;

  const update = (field: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return; // 校验未通过：阻止提交
    setSubmitState("sending");
    // 前端模拟提交，无真实后端
    window.setTimeout(() => setSubmitState("success"), 900);
  };

  const reset = () => {
    setValues({ name: "", email: "", message: "" });
    setErrors({});
    setAttempted(false);
    setSubmitState("idle");
  };

  if (submitState === "success") {
    return (
      <main className="page-contact">
        <h1 className="page-title">约拍</h1>
        <div className="form-success" role="status">
          <span className="form-success-badge" aria-hidden="true">
            ✓
          </span>
          <h2 className="form-success-title">已收到您的约拍信息</h2>
          <p>
            感谢来信，{values.name.trim()}。我会通过 {values.email.trim()} 与您联系，
            通常在两个工作日内回复。
          </p>
          <button type="button" className="btn-secondary" onClick={reset}>
            再写一条
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-contact">
      <h1 className="page-title">约拍</h1>
      <p className="contact-lead">
        无论是人像约拍、高原随行记录，还是图片授权合作，都欢迎留下您的想法。
      </p>

      <form className="contact-form" onSubmit={onSubmit} noValidate>
        <div className={`form-field${shownErrors.name ? " has-error" : ""}`}>
          <label htmlFor="contact-name">称呼</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={values.name}
            onChange={update("name")}
            aria-invalid={Boolean(shownErrors.name)}
            aria-describedby={shownErrors.name ? "contact-name-error" : undefined}
            autoComplete="name"
          />
          {shownErrors.name && (
            <p className="field-error" id="contact-name-error" role="alert">
              {shownErrors.name}
            </p>
          )}
        </div>

        <div className={`form-field${shownErrors.email ? " has-error" : ""}`}>
          <label htmlFor="contact-email">邮箱</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={values.email}
            onChange={update("email")}
            aria-invalid={Boolean(shownErrors.email)}
            aria-describedby={shownErrors.email ? "contact-email-error" : undefined}
            autoComplete="email"
          />
          {shownErrors.email && (
            <p className="field-error" id="contact-email-error" role="alert">
              {shownErrors.email}
            </p>
          )}
        </div>

        <div className={`form-field${shownErrors.message ? " has-error" : ""}`}>
          <label htmlFor="contact-message">拍摄需求</label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            value={values.message}
            onChange={update("message")}
            aria-invalid={Boolean(shownErrors.message)}
            aria-describedby={shownErrors.message ? "contact-message-error" : undefined}
          />
          {shownErrors.message && (
            <p className="field-error" id="contact-message-error" role="alert">
              {shownErrors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={(attempted && hasErrors) || submitState === "sending"}
        >
          {submitState === "sending" ? "发送中…" : "发送"}
        </button>
      </form>
    </main>
  );
}
