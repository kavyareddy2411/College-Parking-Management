import AuthLayout from "../components/AuthLayout.jsx";

export default function Register() {
  return (
    <AuthLayout eyebrow="YOUR CAMPUS, IN MOTION" title={<>Make room for<br />what matters.</>} description="Your parking plan, one less thing to think about. Create an account to get started." legal="For demonstration use only. Account data is stored by the campus server.">
      <div className="auth-form-wrap">
        <p className="eyebrow">GET STARTED</p><h2>Create your account</h2><p className="muted">Use your college email to join Parkside.</p>
        <form id="register-form" className="form-stack">
          <label>Full name<input type="text" name="name" autoComplete="name" placeholder="Alex Morgan" required minLength={2} /></label>
          <label>College email<input type="email" name="email" autoComplete="email" placeholder="you@college.edu" required /></label>
          <label>Account type<select name="role" required><option value="student">Student</option><option value="staff">Staff</option></select></label>
          <label>Vehicle registration <span className="optional-label">Optional</span><input type="text" name="plate" placeholder="e.g. ABC 1234" maxLength={12} /></label>
          <label>Password<input type="password" name="password" autoComplete="new-password" placeholder="At least 6 characters" required minLength={6} /></label>
          <p className="form-message" id="form-message" role="status" />
          <button type="submit" className="button button-primary button-wide">Create account <span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-switch">Already registered? <a href="/login">Sign in</a></p>
      </div>
    </AuthLayout>
  );
}
