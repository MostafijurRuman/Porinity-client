import React, { useEffect, useMemo } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUserCheck, FiClipboard, FiEye, FiHeart, FiList } from 'react-icons/fi';
import useAuth from '../../Hooks/UseAuth';

const navItems = [
  { to: 'edit-biodata', icon: <FiClipboard />, label: 'Edit Biodata' },
  { to: 'view-biodata', icon: <FiEye />, label: 'View Biodata' },
  { to: 'my-contact-requests', icon: <FiList />, label: 'My Contact Requests' },
  { to: 'favourites', icon: <FiHeart />, label: 'Favourites Biodata' },
];

const focusSectionMap = {
  editBiodata: 'edit-biodata',
  viewBiodata: 'view-biodata',
  myContactRequests: 'my-contact-requests',
  favourites: 'favourites',
};

export default function Dashboard() {
  const { logout, user } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();

  const emailPrefix = useMemo(() => {
    if (!user?.email) return 'Authenticated User';
    const [localPart] = user.email.split('@');
    return localPart || user.email;
  }, [user?.email]);

  useEffect(() => {
    const focusSection = location.state?.focusSection;
    if (focusSection && focusSectionMap[focusSection]) {
      navigate(focusSectionMap[focusSection], { replace: true, state: null });
    }
  }, [location.state, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <section className="min-h-screen bg-[var(--color-bg-light)]/80 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 lg:flex-row lg:px-6">
        <aside className="w-full rounded-3xl border border-[var(--color-light-purple)]/40 bg-white/95 p-6 shadow-sm lg:w-64">
          <header className="border-b border-[var(--color-light-purple)]/40 pb-5">
            <h1 className="text-xl font-bold text-[var(--color-primary)]">User Dashboard</h1>
            <p className="mt-1 max-w-full break-all text-xs uppercase tracking-[0.3em] text-[var(--color-primary-accent)]">
              {emailPrefix}
            </p>
          </header>

          <nav className="mt-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] text-white shadow'
                      : 'bg-[var(--color-bg-light)]/60 text-[var(--color-dark-gray)] hover:bg-[var(--color-bg-light)]'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-primary-accent)]/70 px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-accent)] hover:text-white"
          >
            <FiLogOut className="text-base" /> Logout
          </button>

          <p className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--color-bg-light)]/70 px-4 py-3 text-xs text-[var(--color-medium-gray)]">
            <FiUserCheck className="text-[var(--color-primary-accent)]" /> Keep your biodata current to get faster approvals.
          </p>
        </aside>

        <main className="flex-1 rounded-3xl border border-[var(--color-light-purple)]/40 bg-white/95 p-6 shadow-sm">
          <Outlet />
        </main>
      </div>
    </section>
  );
}
