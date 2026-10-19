import { DB_KEY, SESSION_KEY, read, seed } from "../../services/demo/database";
import { readDemo } from "../../services/demo/queries";
import { runDemoCommand } from "../../services/demo/commands";
import { useEffect, useState, useRef } from "react";
import { API_MODE } from "../../services/config";
import * as remote from "../../services/api";
import { authenticate, createAccount, publicUser, normalizeEmail } from "../../services/demo/auth";
import { Context } from "./AppContext";
export default function Provider({
  children
}) {
  const [db, setDB] = useState(() => read(DB_KEY, seed()));
  const [user, setUser] = useState(() => API_MODE ? null : (() => {
    const u = db.users.find(u => u.id === read(SESSION_KEY, null) && u.active);
    return u ? publicUser(u) : null;
  })());
  const dbRef = useRef(db);
  const commitDB = next => {
    dbRef.current = next;
    localStorage.setItem(DB_KEY, JSON.stringify(next));
    setDB(next);
  };
  const [loading, setLoading] = useState(API_MODE);
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState(null);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => {
    if (!API_MODE) localStorage.setItem(DB_KEY, JSON.stringify(db));
  }, [db]);
  useEffect(() => {
    if (!API_MODE) return;
    let active = true;
    remote.auth.current().then(u => {
      if (active) setUser(u);
    }).catch(e => {
      if (active) setNotice({
        message: e.message,
        error: true
      });
    }).finally(() => {
      if (active) setLoading(false);
    });
    const expired = () => {
      setUser(null);
      setVersion(v => v + 1);
    };
    window.addEventListener("aerorul-session-expired", expired);
    return () => {
      active = false;
      window.removeEventListener("aerorul-session-expired", expired);
    };
  }, []);
  useEffect(() => {
    function sync(e) {
      if (e.key === DB_KEY) {
        const next = read(DB_KEY, seed());
        dbRef.current = next;
        setDB(next);
      }
      if (e.key === SESSION_KEY) {
        const u = dbRef.current.users.find(u => u.id === read(SESSION_KEY, null) && u.active);
        setUser(u ? publicUser(u) : null);
        setDrawer(false);
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  async function login(email, password) {
    const u = API_MODE ? await remote.auth.login(email, password) : await authenticate(dbRef.current.users, email, password);
    setUser(u);
    setDrawer(false);
    if (!API_MODE) localStorage.setItem(SESSION_KEY, JSON.stringify(u.id));
    setVersion(v => v + 1);
    return u;
  }
  async function register(payload) {
    let u;
    if (API_MODE) u = await remote.auth.register(payload);else {
      const account = await createAccount(payload);
      const next = structuredClone(dbRef.current);
      if (next.users.some(u => normalizeEmail(u.email) === account.email)) throw Error("This email is already registered. Sign in instead.");
      next.users.push(account);
      next.profiles[account.id] = {
        companyName: account.companyName,
        email: account.email,
        taxId: account.taxId,
        country: account.country,
        phone: account.phone
      };
      if (account.role === "supplier") next.suppliers.push({
        id: account.id,
        name: account.companyName,
        verified: false,
        rating: 0,
        region: account.country
      });
      commitDB(next);
      u = publicUser(account);
      localStorage.setItem(SESSION_KEY, JSON.stringify(u.id));
    }
    setUser(u);
    setVersion(v => v + 1);
    return u;
  }
  async function logout() {
    if (API_MODE) await remote.auth.logout();else localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setDrawer(false);
    setVersion(v => v + 1);
  }
  const flash = (message, error = false) => setNotice({
    message,
    error
  });
  const demoLoad = (resource, key) => readDemo(resource, key, db, user);
  async function action(type, payload = {}) {
    if (API_MODE && !["wishlist:toggle"].includes(type)) {
      const value = await remote.command(type, payload);
      setVersion(v => v + 1);
      return value;
    }
    const {
      next,
      result
    } = runDemoCommand(type, payload, dbRef.current, user);
    commitDB(next);
    return result;
  }
  return <Context.Provider value={{
    db,
    user,
    loading,
    version,
    notice,
    setNotice,
    flash,
    drawer,
    setDrawer,
    login,
    register,
    logout,
    action,
    demoLoad
  }}>
      {children}
    </Context.Provider>;
}
