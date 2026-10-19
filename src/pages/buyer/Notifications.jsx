import { SAMPLE_NOTIFICATIONS as sampleNotifications } from "../../data/mock/notifications";
import { Link } from "react-router-dom";
import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Button from "../../components/common/Button";
import Empty from "../../components/common/EmptyState";
import Icon from "../../components/common/Icon";
export default function Notifications() {
  const {
    db,
    user,
    action
  } = useApp();
  const notifications = user.id === "buyer-1" ? sampleNotifications : [];
  const readNotifications = db.readNotifications[user.id] || [];
  return <div className="page">
      <Title eyebrow="BUYER / ACTIVITY" title="Notifications" description="Fleet, sourcing and order updates in one place." action={<Button tone="secondary" onClick={() => action("notifications:read", {
      ids: notifications.map(n => n.id)
    })}>
            Mark all as read
          </Button>} />
      {!notifications.length && <Empty title="No notifications yet" text="Your account updates will appear here." link={null} />}
      <div className="card overflow-hidden">
        {notifications.map(n => <div className={"notification-row " + (readNotifications.includes(n.id) ? "" : "unread")} key={n.id}>
            <span className="stat-icon h-fit">
              <Icon name={n.icon} />
            </span>
            <div className="flex-1">
              <Link className="text-xs font-semibold" to={n.to} onClick={() => action("notifications:read", {
            ids: [...new Set([...readNotifications, n.id])]
          })}>
                {n.title}
              </Link>
              <p className="muted my-2">{n.text}</p>
              <p className="eyebrow">{n.time}</p>
            </div>
            <Button tone="ghost" className="compact" aria-label={"Mark " + n.title + " as read"} onClick={() => action("notifications:read", {
          ids: [...new Set([...readNotifications, n.id])]
        })}>
              <Icon name="check" size={15} />
            </Button>
          </div>)}
      </div>
    </div>;
}
