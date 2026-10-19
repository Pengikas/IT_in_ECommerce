export default function Steps({
  items,
  current
}) {
  return <ol className="steps">
      {items.map((s, i) => <li key={s} aria-current={i === current ? "step" : undefined}>
          <b className={i <= current ? "done" : ""}>
            {i < current ? "✓" : i + 1}
          </b>
          <span>{s}</span>
        </li>)}
    </ol>;
}
