import { Brand } from "./AppShell.jsx";

export default function AuthLayout({ eyebrow, title, description, children, legal }) {
  return (
    <main className="auth-layout">
      <section className="auth-aside">
        <Brand light />
        <div className="auth-aside-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="auth-aside-foot">A smoother start to every campus day.</div>
      </section>
      <section className="auth-content">
        <a href="/" className="back-link">← Back to dashboard</a>
        {children}
        <p className="auth-legal">{legal}</p>
      </section>
    </main>
  );
}
