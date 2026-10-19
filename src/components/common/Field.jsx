import { Children, isValidElement, cloneElement } from "react";
function hasRequired(children) {
  return Children.toArray(children).some(child => isValidElement(child) && (child.props.required || hasRequired(child.props.children)));
}
function labelControls(children, label) {
  return Children.map(children, child => {
    if (!isValidElement(child)) return child;
    const control = ["input", "select", "textarea"].includes(child.type);
    return cloneElement(child, {
      ...(control && !child.props["aria-label"] && !child.props["aria-labelledby"] && typeof label === "string" ? { "aria-label": label } : {}),
      ...(child.props.children ? { children: labelControls(child.props.children, label) } : {})
    });
  });
}
export default function Field({ label, children, ...props }) {
  const required = !!props.required || hasRequired(children);
  return <label className="field">
    <span>{label}{required && <span className="required-marker" aria-hidden="true"> *</span>}</span>
    {children ? labelControls(children, label) : <input className="input" aria-label={typeof label === "string" ? label : undefined} {...props} />}
  </label>;
}
