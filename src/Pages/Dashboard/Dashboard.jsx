import React, { useEffect, useMemo } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiLogOut,
  FiUserCheck,
  FiClipboard,
  FiEye,
  FiHeart,
  FiList,
  FiPieChart,
  FiUsers,
  FiStar,
  FiPhoneCall,
  FiBookOpen,
  FiAward,
  FiMail,
} from 'react-icons/fi';
import useAuth from '../../Hooks/UseAuth';
import useUserAccount from '../../Hooks/useUserAccount';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const navItems = [
  { to: 'edit-biodata', icon: <FiClipboard />, label: 'Edit Biodata' },
  { to: 'view-biodata', icon: <FiEye />, label: 'View Biodata' },
  { to: 'my-contact-requests', icon: <FiList />, label: 'My Contact Requests' },
  { to: 'favourites', icon: <FiHeart />, label: 'Favourites Biodata' },
];

const adminNavItems = [
  { to: '.', icon: <FiPieChart />, label: 'Admin Dashboard', end: true },
  { to: 'manage', icon: <FiUsers />, label: 'Manage Users' },
  { to: 'premium-biodata-approvals', icon: <FiStar />, label: 'Approve Premium Biodata', badgeKey: 'pendingPremium' },
  { to: 'premium-user-approvals', icon: <FiAward />, label: 'Approve Premium Users', badgeKey: 'pendingPremiumUsers' },
  { to: 'approvedContactRequest', icon: <FiPhoneCall />, label: 'Approved Contact Request', badgeKey: 'pendingContactRequests' },
  { to: 'contact-messages', icon: <FiMail />, label: 'Contact Messages', badgeKey: 'pendingContactMessages' },
  { to: 'success-stories', icon: <FiBookOpen />, label: 'Success Stories', badgeKey: 'pendingSuccessStories' },
];

const focusSectionMap = {
  editBiodata: 'edit-biodata',
  viewBiodata: 'view-biodata',
  myContactRequests: 'my-contact-requests',
  favourites: 'favourites',
};

export default function Dashboard() {
  const { logout, user } = useAuth() || {};
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    account,
    isAdmin,
    isLoadingAccount,
    isFetchingAccount,
    isAccountError,
    accountError,
  } = useUserAccount();

  const { data: adminOverviewData } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => {
      const { data: response } = await axiosSecure.get('/admin/overview');
      return response;
    },
    enabled: Boolean(isAdmin),
    staleTime: 30 * 1000,
  });

  const emailPrefix = useMemo(() => {
    if (!user?.email) return 'Authenticated User';
    const [localPart] = user.email.split('@');
    return localPart || user.email;
  }, [user?.email]);

  const adminNavItemsWithBadges = useMemo(() => {
    if (!isAdmin) return adminNavItems;

    const totals = adminOverviewData?.totals || {};

    return adminNavItems.map((item) => {
      if (!item.badgeKey) return item;
      const badgeCount = typeof totals[item.badgeKey] === 'number' ? totals[item.badgeKey] : 0;
      return { ...item, badge: badgeCount };
    });
  }, [adminOverviewData?.totals, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const focusSection = location.state?.focusSection;
    if (focusSection && focusSectionMap[focusSection]) {
      navigate(focusSectionMap[focusSection], { replace: true, state: null });
    }
  }, [isAdmin, location.state, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (isLoadingAccount || isFetchingAccount) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[var(--color-bg-light)]">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-[var(--color-primary)]" />
      </section>
    );
  }

  if (isAccountError) {
    console.error('Failed to load account info', accountError);
  }

  if (isAdmin) {
    return (
      <section className="min-h-screen bg-[var(--color-bg-light)]/80 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 lg:flex-row lg:px-6">
          <aside className="w-full rounded-3xl border border-[var(--color-light-purple)]/40 bg-white/95 p-6 shadow-sm lg:w-64">
            <header className="border-b border-[var(--color-light-purple)]/40 pb-5">
              <h1 className="text-xl font-bold text-[var(--color-primary)]">Admin Dashboard</h1>
              <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[var(--color-primary-accent)]">
                {account?.displayName || emailPrefix}
              </p>
            </header>

            <nav className="mt-6 space-y-2">
              {adminNavItemsWithBadges.map((item) => {
                const rawBadge = typeof item?.badge === 'number' ? item.badge : 0;
                const badgeValue = rawBadge > 99 ? '99+' : rawBadge;

                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] text-white shadow'
                          : 'bg-[var(--color-bg-light)]/60 text-[var(--color-dark-gray)] hover:bg-[var(--color-bg-light)]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <span className="flex w-full items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        {rawBadge > 0 && (
                          <span
                            className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${
                              isActive
                                ? 'bg-white/90 text-[var(--color-primary)]'
                                : 'bg-[var(--color-primary-accent)]/15 text-[var(--color-primary-accent)]'
                            }`}
                          >
                            {badgeValue}
                          </span>
                        )}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-primary-accent)]/70 px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-accent)] hover:text-white"
            >
              <FiLogOut className="text-base" /> Logout
            </button>
          </aside>

          <main className="flex-1 rounded-3xl border border-[var(--color-light-purple)]/40 bg-white/95 p-6 shadow-sm">
            <Outlet context={{ account, isAdmin: true }} />
          </main>
        </div>
      </section>
    );
  }

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
          <Outlet context={{ account, isAdmin: false }} />
        </main>
      </div>
    </section>
  );
}
