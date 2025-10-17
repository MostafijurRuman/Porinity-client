import React from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import AdminOverview from './Admin/AdminOverview';

export default function DashboardLanding() {
  const context = useOutletContext() || {};
  const isAdmin = Boolean(context.isAdmin);

  if (isAdmin) {
    return <AdminOverview />;
  }

  return <Navigate to="edit-biodata" replace />;
}
