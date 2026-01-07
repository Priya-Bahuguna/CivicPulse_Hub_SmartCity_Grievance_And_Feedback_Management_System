// src/pages/Authentication/LoginPage.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, User } from "lucide-react";
import logoImg from "../../assets/Logo.jpg";
import { citizenLogin, adminLogin, officerLogin } from "../../api/auth.js";
import { toast } from "react-toastify";

const portals = [
  { id: "user", label: "User Portal", idLabel: "User Email" },
  { id: "admin", label: "Admin Portal", idLabel: "Admin Email" },
  { id: "officer", label: "Officer Portal", idLabel: "Officer Email" },
];

export default function LoginPage() {
  const [selectedPortal, setSelectedPortal] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activePortal = useMemo(
    () => portals.find((portal) => portal.id === selectedPortal),
    [selectedPortal]
  );

  const sliderLeft = useMemo(
    () =>
      `${portals.findIndex((portal) => portal.id === selectedPortal) * 33.3333}%`,
    [selectedPortal]
  );

  const handleLogin = async (e) => {
    e.preventDefault();

    // BLOCK MULTIPLE SUBMISSIONS
    if (isLoading) return;

    if (!email || !password) {
      toast.warn("Please enter both email and password!");
      return;
    }

    let loginFunc;
    if (selectedPortal === "user") loginFunc = citizenLogin;
    else if (selectedPortal === "admin") loginFunc = adminLogin;
    else if (selectedPortal === "officer") loginFunc = officerLogin;

    try {
      setIsLoading(true);

      const res = await loginFunc({ email: email.trim(), password });

      if (res?.data?.token) {
        toast.success(`${activePortal.label} Login successful!`, {
          toastId: "success_once",
        });

        localStorage.setItem("token", res.data.token);

        setTimeout(() => {
          if (selectedPortal === "user")
            window.location.href = "/user-dashboard";
          if (selectedPortal === "admin")
            window.location.href = "/admin-dashboard";
          if (selectedPortal === "officer")
            window.location.href = "/officer-dashboard";
        }, 700);

      } else {
        toast.error(res?.data?.message || "Unexpected login response.", {
          toastId: "error_once",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid Credentials!", { toastId: "invalid_once" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="app-header">
        <div className="logo-group">
          <img src={logoImg} alt="CivicPulse Hub logo" />
          <p className="logo-title">CivicPulse</p>
        </div>
      </header>

      <main className="auth-shell">
        <div className="modern-login-container">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>

          <div className="login-content">
            <div className="brand-section">
              <div className="brand-header">
                <img src={logoImg} alt="CivicPulse Hub logo" className="brand-logo" />
                <div className="brand-text">
                  <h1 className="brand-title">CivicPulse</h1>
                  <p className="brand-tagline">Smart City Solutions</p>
                </div>
              </div>
              <p className="brand-description">
                Unified platform for civic issue management and community collaboration
              </p>
            </div>

            <div className="login-form-section">
              <div className="form-header">
                <h2 className="form-title">Welcome Back</h2>
                <p className="form-subtitle">Sign in to your account</p>
              </div>

              <div className="portal-selector-modern">
                <div className="portal-buttons">
                  {portals.map((portal) => (
                    <button
                      key={portal.id}
                      type="button"
                      onClick={() => {
                        setSelectedPortal(portal.id);
                        setEmail("");
                        setPassword("");
                      }}
                      className={`portal-btn-modern ${selectedPortal === portal.id ? "selected" : ""}`}
                    >
                      <User size={16} />
                      <span>{portal.label.replace(' Portal', '')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form className="modern-login-form" onSubmit={handleLogin}>
                <div className="input-group-modern">
                  <label htmlFor="portal-email" className="input-label-modern">{activePortal?.idLabel}</label>
                  <div className="input-field-modern">
                    <User size={18} className="input-icon-modern" />
                    <input
                      id="portal-email"
                      type="email"
                      placeholder={`Enter your ${activePortal?.idLabel.toLowerCase()}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="modern-input"
                      required
                    />
                  </div>
                </div>

                <div className="input-group-modern">
                  <label htmlFor="portal-password" className="input-label-modern">Password</label>
                  <div className="input-field-modern">
                    <Lock size={18} className="input-icon-modern" />
                    <input
                      id="portal-password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="modern-input"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`modern-login-btn ${isLoading ? "processing" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="btn-spinner"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <div className="btn-arrow">→</div>
                    </>
                  )}
                </button>

                {selectedPortal !== "officer" ? (
                  <div className="modern-auth-links">
                    <Link
                      to={selectedPortal === "user" ? "/register" : "/adminsignup"}
                      className="modern-auth-link primary-link"
                    >
                      Create Account
                    </Link>
                    <Link
                      to={`/forgot-password/${selectedPortal}`}
                      className="modern-auth-link secondary-link"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                ) : (
                  <div className="officer-info-modern">
                    <p>Officers are managed by administrators</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
