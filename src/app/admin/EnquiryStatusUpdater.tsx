'use client';

import React, { useState } from 'react';

interface EnquiryStatusUpdaterProps {
  id: string;
  currentStatus: string;
}

export default function EnquiryStatusUpdater({ id, currentStatus }: EnquiryStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setUpdating(true);
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (s: string) => {
    switch (s) {
      case 'NEW':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'CONTACTED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CLOSED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <select
      value={status}
      disabled={updating}
      onChange={(e) => handleStatusChange(e.target.value)}
      className={`text-[11px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-lg border outline-none cursor-pointer ${getStatusBadgeClass(
        status
      )}`}
    >
      <option value="NEW">NEW</option>
      <option value="CONTACTED">CONTACTED</option>
      <option value="CLOSED">CLOSED</option>
    </select>
  );
}
