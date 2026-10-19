import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import { API_MODE } from "../../services/config";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Field from "../../components/common/Field";
import Notice from "../../components/common/Notice";
import Empty from "../../components/common/EmptyState";
export default function ProductForm() {
  const {
    id
  } = useParams();
  const query = useRecords("listings");
  const catalog = useRecords("products");
  const categories = useRecords("categories");
  const {
    action
  } = useApp();
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  const p = id ? query.data?.find(p => p.id === id) : {
    productId: "",
    name: "",
    partNumber: "",
    categoryId: "cat-turbine",
    compatibility: [],
    price: "",
    stock: 0,
    deliveryDays: 5,
    condition: "New",
    status: "Draft",
    description: ""
  };
  return <div className="page">
      <Title eyebrow="SUPPLIER / SELLER OFFER" title={id ? "Edit product" : API_MODE ? "Create seller listing" : "Add product"} description={API_MODE ? "Create an offer for an existing catalog product." : "Publish precise component details and engine references."} />
      <State query={query}>
        {!p ? <Empty title="Listing not found" text="This offer is not in your store." link="/supplier/products" action="Back to products" /> : <Form key={id || "new"} className="card p-6 md:p-8 form-grid" onSubmit={async data => {
        const values = Object.fromEntries(data);
        const compatibility = API_MODE ? p.compatibility : values.compatibility.split(",").map(s => s.trim()).filter(Boolean);
        if (!API_MODE && !compatibility.length) throw Error("Enter at least one engine reference.");
        const product = catalog.data?.find(p => p.id === values.productId);
        await action("product:save", {
          ...p,
          ...values,
          id,
          productId: product?.productId ?? values.productId,
          price: Number(values.price),
          stock: Number(values.stock),
          deliveryDays: Number(values.deliveryDays),
          compatibility
        });
        navigate("/supplier/products");
      }}>
            {API_MODE ? <div className="col-span-full">
                <Field label="Catalog product">
                  <select className="input" name="productId" required defaultValue={p.productId} disabled={!!id}>
                    <option value="">Select a catalog product</option>
                    {(catalog.data || []).map(product => <option key={product.id} value={product.id}>
                        {product.name} · {product.partNumber}
                      </option>)}
                  </select>
                </Field>
                <p className="tiny muted mt-2">
                  Catalog product creation needs an admin API; this form creates
                  a seller offer.
                </p>
              </div> : <>
                <Field label="Product name" name="name" required defaultValue={p.name} />
                <Field label="Part number / SKU" name="partNumber" required defaultValue={p.partNumber} />
                <Field label="Category">
                  <select className="input" name="categoryId" defaultValue={p.categoryId}>
                    {(categories.data || []).map(c => <option value={c.id} key={c.id}>
                        {c.name}
                      </option>)}
                  </select>
                </Field>
                <Field label="Compatible engines (comma separated)" name="compatibility" required defaultValue={p.compatibility.join(", ")} />
                <div className="col-span-full">
                  <Field label="Description">
                    <textarea className="input" name="description" rows={4} defaultValue={p.description} />
                  </Field>
                </div>
              </>}
            {[["Unit price (USD)", "price", "0.01"], ["Available stock", "stock", "1"], ["Delivery estimate (days)", "deliveryDays", "1"]].map(([label, name, step]) => <Field key={name} label={label} name={name} type="number" required min={name === "stock" ? 0 : name === "price" ? 0.01 : 1} step={step} defaultValue={p[name]} />)}
            <Field label="Condition">
              <select className="input" name="condition" defaultValue={p.condition}>
                {["New", "Refurbished", "Exchange"].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Listing status">
              <select className="input" name="status" defaultValue={p.status}>
                {["Draft", "Active", "Hidden"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <div>
              <Field label="Product photo preview">
                <input type="file" accept="image/png,image/jpeg,image/webp" className="input" onChange={e => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) return;
              const reader = new FileReader();
              reader.onload = () => setPreview(reader.result);
              reader.readAsDataURL(file);
            }} />
              </Field>
              <p className="tiny muted mt-2">
                Preview only, up to 2 MB. Persistent uploads need the media API.
              </p>
            </div>
            {preview && <img className="h-32 object-contain" src={preview} alt="Selected product preview" />}
            <div className="col-span-full">
              <Notice>
                {API_MODE ? "The backend must enforce supplier ownership and validate listing changes." : "Changes are saved in the local demonstration catalog only."}
              </Notice>
            </div>
            <div className="flex flex-wrap gap-3 col-span-full">
              <Button type="submit">
                {id ? "Save changes" : API_MODE ? "Save listing to server" : "Create product"}
              </Button>
              <Link className="btn btn-secondary" to="/supplier/products">
                Cancel
              </Link>
            </div>
          </Form>}
      </State>
    </div>;
}
