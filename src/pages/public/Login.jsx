import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { API_MODE } from "../../services/config";
import useApp from "../../hooks/useApp";
import Icon from "../../components/common/Icon";
import Logo from "../../components/common/Logo";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Field from "../../components/common/Field";
import Notice from "../../components/common/Notice";
import Badge from "../../components/common/Badge";
export default function Login() {
  const {
    login
  } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [show, setShow] = useState(false);
  return <div className="auth-shell">
      <aside className="auth-aside">
        <Logo />
        <div>
          <p className="eyebrow text-sky-300 mb-5">
            INTELLIGENT AVIATION SOURCING
          </p>
          <h2>
            Aviation parts marketplace with RUL-based replacement planning.
          </h2>
          <p className="mt-5">
            Connecting enterprise airlines, certified MROs and verified
            aerospace suppliers with intelligent procurement.
          </p>
          <div className="auth-features">
            {[["chart", "Predictive replacement planning", "Turn remaining useful life into a sourcing priority."], ["shield", "Verified global suppliers", "Compare compatible components and seller offers."], ["plane", "Fast B2B procurement", "From replacement options to order tracking."]].map(([icon, title, text]) => <div className="auth-feature" key={title}>
                <Icon name={icon} />
                <div>
                  <b>{title}</b>
                  <small>{text}</small>
                </div>
              </div>)}
          </div>
        </div>
        <p className="eyebrow">PRECISION PARTS. INFORMED DECISIONS.</p>
      </aside>
      <div className="auth-body">
        <div className="flex justify-between mb-10">
          <Badge>EN · English</Badge>
          <span className="tiny muted">Enterprise workspace</span>
        </div>
        <h1>Enterprise account sign in</h1>
        <p className="muted mt-3 mb-6">
          Welcome back. Continue to your AeroRUL workspace.
        </p>
        <Notice>
          {API_MODE ? "Use your backend account. The server determines your permissions." : "Use your registered demo account or the sample credentials listed below. Your account determines your workspace."}
        </Notice>
        <Form className="mt-6 space-y-5" onSubmit={async data => {
        const u = await login(data.get("email"), data.get("password"));
        const redirect = params.get("redirect");
        navigate(u.role === "buyer" && redirect?.startsWith("/buyer/") ? redirect : `/${u.role}/dashboard`);
      }}>
          <Field label="Business email" name="email" type="email" required autoComplete="username" />
          <Field label="Password">
            <div className="relative">
              <input className="input pr-16" name="password" type={show ? "text" : "password"} required autoComplete="current-password" placeholder={"Your password"} />
              <button type="button" className="password-toggle" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </Field>
          <Button type="submit" className="w-full">
            Sign in <Icon name="arrow" size={14} />
          </Button>
        </Form>
        {!API_MODE && <div className="demo-credentials mt-5"><p className="font-semibold mb-2">Sample accounts</p><p>Buyer: procurement@skywest-demo.com · Buyer@2026!</p><p>Supplier: seller@safran-demo.com · Supplier@2026!</p><p>Admin: admin@aerorul-demo.com · Admin@2026!</p><p className="mt-2">New accounts start with an empty workspace. Sample fleet and orders belong to the sample buyer.</p></div>}
        <p className="muted text-center mt-7">
          New to AeroRUL?{" "}
          <Link className="text-accent font-semibold" to="/register">
            Create a corporate account
          </Link>
        </p>
        <p className="tiny muted text-center mt-10">
          B2B aviation marketplace ·{" "}
          {API_MODE ? "API environment" : "Demo environment"}
        </p>
      </div>
    </div>;
}
