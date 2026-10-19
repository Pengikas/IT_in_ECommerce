import Field from "../../components/common/Field";
import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Notice from "../../components/common/Notice";
import Empty from "../../components/common/EmptyState";
export default function Reviews() {
  const {
    db,
    user,
    action
  } = useApp();
  const rows = db.reviews.filter(r => db.products.some(p => p.id === r.productId && p.supplierId === user.id));
  return <div className="page">
      <Title eyebrow="SUPPLIER / CUSTOMER EXPERIENCE" title="Customer reviews" description="Read buyer feedback and respond from your store." />
      {!rows.length ? <Empty title="No reviews yet" text="Buyer feedback on your products will appear here." link={null} /> : rows.map(r => <section key={r.id} className="card p-6">
            <b className="text-xs">
              {r.companyName} · {r.rating} / 5
            </b>
            <p className="tiny text-accent mt-2">
              {db.products.find(p => p.id === r.productId)?.name}
            </p>
            <p className="text-sm my-5">{r.text}</p>
            {r.reply ? <Notice>Store reply: {r.reply}</Notice> : <Form className="flex gap-3" onSubmit={data => action("review:reply", {
        id: r.id,
        reply: data.get("reply")
      })}>
                <Field label="Store reply"><input className="input" name="reply" aria-label="Store reply" required placeholder="Write a reply…" /></Field>
                <Button type="submit">Reply</Button>
              </Form>}
          </section>)}
    </div>;
}
