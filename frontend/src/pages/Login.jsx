import AuthLayout from "../components/AuthLayout.jsx";

export default function Login() {
  return (
    <AuthLayout eyebrow="CAMPUS PARKING, SIMPLIFIED" title={<>Arrive ready.<br />Park with ease.</>} description="Find a space, reserve your spot, and spend less time circling campus." legal="For demonstration use only. Do not use a real password.">
      <div className="auth-form-wrap">
        <p className="eyebrow">WELCOME BACK</p><h2>Sign in to Parkside</h2><p className="muted">Use your campus account to manage parking.</p>
        <form id="login-form" className="form-stack">
          <label>Email address<input type="email" name="email" autoComplete="username" placeholder="you@college.edu" required /></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" placeholder="Enter your password" required /></label>
          <p className="form-message" id="form-message" role="status" />
          <button type="submit" className="button button-primary button-wide">Sign in <span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-switch">New to Parkside? <a href="/register">Create an account</a></p>
        <div className="demo-note"><strong>Demo accounts</strong><span>Student: student@college.edu / student123</span><span>Admin: admin@college.edu / admin123</span></div>
      </div>
    </AuthLayout>
  );
}
