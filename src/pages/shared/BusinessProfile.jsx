import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";
import Form from "../../components/common/Form";
export default function Profile() {
  const {
    db,
    user,
    action,
    flash
  } = useApp();
  const p = db.profiles[user.id] || {
    companyName: user.companyName,
    email: user.email,
    phone: "",
    taxId: "",
    address: "",
    description: ""
  };
  return <div className="page">
      <Title eyebrow="WORKSPACE / BUSINESS PROFILE" title={user.role === "supplier" ? "Store profile" : "Company profile"} description="Keep business contact details up to date." />
      <Form className="card p-6 form-grid max-w-4xl" onSubmit={async data => {
      await action("profile:save", Object.fromEntries(data));
      flash("Business profile saved locally.");
    }}>
        {[["Company name", "companyName", "text"], ["Contact email", "email", "email"], ["Phone", "phone", "tel"], ["Business / tax ID", "taxId", "text"]].map(([label, name, type]) => <Field key={name} label={label} name={name} type={type} required={name === "companyName" || name === "email"} defaultValue={p[name]} />)}
        <div className="col-span-full">
          <Field label="Business address">
            <textarea className="input" name="address" defaultValue={p.address} />
          </Field>
        </div>
        <div className="col-span-full">
          <Field label="Company introduction">
            <textarea className="input" rows={4} name="description" defaultValue={p.description} />
          </Field>
        </div>
        <div className="col-span-full">
          <Button type="submit">Save profile</Button>
        </div>
      </Form>
    </div>;
}
