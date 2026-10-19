import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_MODE } from "../../services/config";
import useApp from "../../hooks/useApp";
import Icon from "../../components/common/Icon";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Field from "../../components/common/Field";
import Notice from "../../components/common/Notice";
export default function Register() {
  const {
    register
  } = useApp();
  const [role, setRole] = useState("buyer");
  const navigate = useNavigate();
  return <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <p className="eyebrow mb-3">JOIN THE AVIATION NETWORK</p>
        <h1>Create your corporate account</h1>
        <p className="muted mt-3">
          One connected workspace for your next mission.
        </p>
      </div>
      <Notice>
        {API_MODE ? "Your registration is submitted to the backend." : "Registration saves an account in this browser. No server account is created."}
      </Notice>
      <Form className="card p-6 md:p-9 mt-6 space-y-8" onSubmit={async data => {
      if (data.get("password") !== data.get("confirm")) throw Error("Passwords do not match.");
      const {
        confirm,
        terms,
        ...form
      } = Object.fromEntries(data);
      const u = await register({
        ...form,
        role
      });
      navigate(`/${u.role}/dashboard`);
    }}>
        <div>
          <h2 className="form-heading">01 · Choose your workspace</h2>
          <div className="grid grid-cols-2 gap-3">
            {["buyer", "supplier"].map(r => <button type="button" key={r} aria-pressed={role === r} onClick={() => setRole(r)} className={"role-card " + (role === r ? "selected" : "")}>
                <Icon name={r === "buyer" ? "plane" : "building"} />
                <b>
                  {r === "buyer" ? "Airline / MRO buyer" : "Aerospace supplier"}
                </b>
                <span>
                  {r === "buyer" ? "Source components and monitor your fleet." : "List products and fulfil customer orders."}
                </span>
              </button>)}
          </div>
        </div>
        <div>
          <h2 className="form-heading">02 · Account information</h2>
          <div className="form-grid">
            <Field label="Full name" name="name" required autoComplete="name" />
            <Field label="Work email" name="email" type="email" required autoComplete="email" />
            <Field label="Password" name="password" type="password" minLength={8} required autoComplete="new-password" />
            <Field label="Confirm password" name="confirm" type="password" required autoComplete="new-password" />
          </div>
        </div>
        <div>
          <h2 className="form-heading">03 · Company information</h2>
          <div className="form-grid">
            <Field label="Legal company name" name="companyName" required />
            <Field label="Business / tax ID" name="taxId" required />
            <Field label="Country">
              <select name="country" className="input" required>
                {["United States", "Vietnam", "United Kingdom", "France", "Singapore", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Business phone" name="phone" type="tel" />
          </div>
        </div>
        <label className="flex items-start gap-3 muted">
          <input type="checkbox" name="terms" required /><span><span className="required-marker" aria-hidden="true">*</span> I confirm the account
          details and understand this environment does not provide real aviation
          certification or a payment gateway.</span>
        </label>
        <Button type="submit" className="w-full">
          Create corporate account <Icon name="arrow" size={14} />
        </Button>
      </Form>
      <p className="text-center muted mt-5">
        Already registered?{" "}
        <Link className="text-accent" to="/login">
          Sign in
        </Link>
      </p>
    </div>;
}
