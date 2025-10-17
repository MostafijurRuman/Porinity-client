import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiActivity, FiUsers, FiStar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Navigate, useOutletContext } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const chartColors = ['#6C5CE7', '#00B894', '#FF7675', '#0984E3'];

export default function AdminOverview() {
  const axiosSecure = useAxiosSecure();
  const { isAdmin } = useOutletContext() || {};

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => {
      const { data: response } = await axiosSecure.get('/admin/overview');
      return response;
    },
    enabled: Boolean(isAdmin),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      console.error('Failed to load admin overview', error);
      toast.error('Failed to load admin overview');
    }
  }, [isError, error]);

  const totals = data?.totals || {};
  const revenue = data?.revenue || {};
  const totalRevenue = revenue.totalRevenue || 0;
  const contactRevenue = revenue.contactRevenue || 0;
  const premiumBiodataRevenue = revenue.premiumBiodataRevenue || 0;
  const premiumUserRevenue = revenue.premiumUserRevenue || 0;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value || 0);

  const chartData = useMemo(() => {
    const segments = data?.chart?.segments || [];
    return segments.filter((segment) => typeof segment.value === 'number');
  }, [data?.chart?.segments]);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--color-light-purple)]/40 pb-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-[var(--color-medium-gray)]">
          Monitor platform performance, premium conversions, and combined revenue from biodata upgrades, memberships, and contact unlocks.
        </p>
      </header>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-[var(--color-light-purple)]/30 bg-[var(--color-bg-light)]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-[var(--color-primary)]" />
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DashboardStat
              icon={<FiActivity className="h-5 w-5" />}
              label="Total Biodata"
              value={totals.totalBiodata || 0}
              bg="from-[#6C5CE7]/10 to-[#6C5CE7]/5"
            />
            <DashboardStat
              icon={<FiUsers className="h-5 w-5" />}
              label="Male Biodata"
              value={totals.maleBiodata || 0}
              bg="from-[#00B894]/10 to-[#00B894]/5"
            />
            <DashboardStat
              icon={<FiStar className="h-5 w-5" />}
              label="Premium Biodata"
              value={totals.premiumBiodata || 0}
              bg="from-[#FF7675]/10 to-[#FF7675]/5"
              subLabel={`${totals.pendingPremium || 0} pending`}
            />
            <DashboardStat
              icon={<FiDollarSign className="h-5 w-5" />}
              label="Revenue (Approved)"
              value={totalRevenue}
              isCurrency
              bg="from-[#0984E3]/10 to-[#0984E3]/5"
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-[var(--color-light-purple)]/30 bg-white p-6 shadow-sm">
              <header className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-primary)]">Biodata Distribution</h3>
                  <p className="text-xs text-[var(--color-medium-gray)]">Breakdown of biodata by category.</p>
                </div>
                <FiTrendingUp className="h-5 w-5 text-[var(--color-primary-accent)]" />
              </header>

              {chartData.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-xl bg-[var(--color-bg-light)]/60 text-sm text-[var(--color-medium-gray)]">
                  No biodata statistics available yet.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={entry.label} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Count']} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--color-light-purple)]/30 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--color-primary)]">Quick Insights</h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--color-dark-gray)]">
                <li className="flex items-start justify-between gap-3">
                  <span>Total biodata submissions</span>
                  <strong>{totals.totalBiodata || 0}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span>Approved premium profiles</span>
                  <strong>{totals.premiumBiodata || 0}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span>Pending premium requests</span>
                  <strong>{totals.pendingPremium || 0}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span>Approved premium users</span>
                  <strong>{totals.premiumUsers || 0}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span>Pending premium user requests</span>
                  <strong>{totals.pendingPremiumUsers || 0}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span>Pending contact requests</span>
                  <strong>{totals.pendingContactRequests || 0}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span>Approved contact purchases</span>
                  <strong>{totals.approvedContactRequests || 0}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span>Total approved revenue</span>
                  <strong>{formatCurrency(totalRevenue)}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span>Revenue from premium biodata</span>
                  <strong>{formatCurrency(premiumBiodataRevenue)}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span>Revenue from premium users</span>
                  <strong>{formatCurrency(premiumUserRevenue)}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span>Revenue from contact requests</span>
                  <strong>{formatCurrency(contactRevenue)}</strong>
                </li>
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function DashboardStat({ icon, label, value, bg, subLabel, isCurrency = false }) {
  return (
    <div className={`rounded-2xl border border-[var(--color-light-purple)]/30 bg-gradient-to-br ${bg} p-5 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[var(--color-primary)] shadow">
          {icon}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">{label}</span>
      </div>
      <p className="mt-4 text-3xl font-bold text-[var(--color-primary)]">
        {isCurrency
          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0)
          : value || 0}
      </p>
      {subLabel && <p className="mt-1 text-xs text-[var(--color-medium-gray)]">{subLabel}</p>}
    </div>
  );
}
