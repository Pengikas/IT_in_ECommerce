import Field from "../../components/common/Field";
import { useState } from "react";
import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Table from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
export default function Categories() {
  const {
    db,
    action
  } = useApp();
  const [edit, setEdit] = useState(null);
  return <div className="page">
      <Title eyebrow="ADMIN / CATALOG" title="Categories" description="Organize the marketplace catalog." />
      <Form key={edit?.id || "new"} className="card p-5 flex flex-wrap gap-3" onSubmit={async (data, form) => {
      const name = data.get("name").trim();
      if (!name) throw Error("Enter a category name.");
      await action("category:save", {
        id: edit?.id,
        name
      });
      setEdit(null);
      form.reset();
    }}>
        <Field label="Category name"><input className="input flex-1 w-auto" aria-label="Category name" name="name" required placeholder="Category name" defaultValue={edit?.name || ""} /></Field>
        <Button type="submit">{edit ? "Save category" : "Add category"}</Button>
        {edit && <Button tone="secondary" onClick={() => setEdit(null)}>
            Cancel
          </Button>}
      </Form>
      <Table rows={db.categories} columns={[{
      key: "name",
      label: "Category"
    }, {
      key: "id",
      label: "Reference"
    }, {
      key: "action",
      label: "Action",
      render: r => <Button tone="secondary" onClick={() => setEdit(r)}>
                Edit category
              </Button>
    }]} />
    </div>;
}
