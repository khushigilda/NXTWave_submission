import { useState, useEffect } from 'react';
import { Download, Trash2, AlertTriangle, TrendingUp, Users, Target, DollarSign, MousePointerClick, BarChart2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import {
  loadDashboardState,
  saveDashboardState,
  clearDashboardState,
  createInitialDashboardState,
  exportDashboardCSV,
  type DashboardState,
} from '../storage';
import { getEventCounts, clearEvents } from '../analytics';
import { CAMPAIGN_BUDGET, DAILY_TARGETS, BUDGET_ALLOCATIONS } from '../config';
import './DashboardPage.css';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardState>(() => {
    return loadDashboardState() || createInitialDashboardState();
  });
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    setEventCounts(getEventCounts());
  }, []);

  useEffect(() => {
    saveDashboardState({ ...dashboard, lastUpdated: new Date().toISOString() });
  }, [dashboard]);

  function updateDailyActual(dayIdx: number, value: string) {
    const parsed = Math.max(0, parseInt(value, 10) || 0);
    const updated = [...dashboard.dailyActuals];
    updated[dayIdx] = parsed;
    setDashboard({ ...dashboard, dailyActuals: updated });
  }

  function updateSpend(catIdx: number, value: string) {
    const parsed = Math.max(0, parseFloat(value) || 0);
    const updated = [...dashboard.budgetSpend];
    updated[catIdx] = { ...updated[catIdx], spent: parsed };
    setDashboard({ ...dashboard, budgetSpend: updated });
  }

  function updateSourceField(rowIdx: number, field: string, value: string) {
    const parsed = Math.max(0, parseInt(value, 10) || 0);
    const updated = [...dashboard.sourceData];
    updated[rowIdx] = { ...updated[rowIdx], [field]: parsed };
    setDashboard({ ...dashboard, sourceData: updated });
  }

  function handleExportCSV() {
    const csv = exportDashboardCSV(dashboard);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign_dashboard_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    clearDashboardState();
    clearEvents();
    setDashboard(createInitialDashboardState());
    setEventCounts({});
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  }

  const totalSpent = dashboard.budgetSpend.reduce((acc, b) => acc + b.spent, 0);
  const remaining = CAMPAIGN_BUDGET - totalSpent;
  const totalActual = dashboard.dailyActuals.reduce((a, b) => a + b, 0);
  const workshopClicks = eventCounts['workshop_cta_clicked'] || 0;
  const blueprintsDone = eventCounts['blueprint_generated'] || 0;
  const challengeStarts = eventCounts['challenge_started'] || 0;

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-page__main">
        <div className="container">
          {/* Header */}
          <div className="dashboard__header">
            <div>
              <p className="section-eyebrow">CAMPAIGN OWNER VIEW</p>
              <h1>Growth Campaign Dashboard</h1>
              <p className="text-muted mt-2">
                Tracks challenge activity locally in this browser.{' '}
                <strong>This is a prototype.</strong> Data is not shared across devices.
              </p>
            </div>
            <div className="dashboard__header-actions">
              <button className="btn btn--secondary btn--sm" onClick={handleExportCSV} id="export-csv-btn">
                <Download size={15} />
                Export CSV
              </button>
              <button className="btn btn--ghost btn--sm" onClick={() => setShowResetConfirm(true)} id="reset-demo-btn">
                <Trash2 size={15} />
                Reset Demo Data
              </button>
            </div>
          </div>

          <div className="prototype-notice mb-6">
            <AlertTriangle size={16} />
            <div>
              <strong>Prototype limitations:</strong> All data shown is locally tracked and browser-specific.
              Registration counts marked as <em>Not Connected</em> are not verified by any registration system.
              Actual campaign analytics require server-side integration.
            </div>
          </div>

          {resetSuccess && (
            <div className="toast toast--success mb-4">
              ✓ Demo data has been reset.
            </div>
          )}

          {/* KPI Cards */}
          <section className="dashboard__section">
            <h2 className="dashboard__section-title">
              <BarChart2 size={20} /> Key Metrics
            </h2>
            <div className="kpi-grid">
              <KpiCard icon={<Users size={22} />} label="Challenge Starts" value={challengeStarts} color="primary" note="Locally tracked" />
              <KpiCard icon={<TrendingUp size={22} />} label="Blueprints Generated" value={blueprintsDone} color="success" note="Locally tracked" />
              <KpiCard icon={<MousePointerClick size={22} />} label="Workshop CTA Clicks" value={workshopClicks} color="info" note="Locally tracked" />
              <KpiCard icon={<Target size={22} />} label="Confirmed Registrations" value="—" color="warning" note="Not connected · Requires registration system" isWarning />
              <KpiCard icon={<DollarSign size={22} />} label="Total Spend" value={`₹${totalSpent}`} color="accent" note="Enter actual spend below" />
              <KpiCard icon={<DollarSign size={22} />} label="Cost per Click" value={workshopClicks > 0 ? `₹${(totalSpent / workshopClicks).toFixed(0)}` : '—'} color="muted" note="Spend ÷ CTA clicks" />
            </div>
          </section>

          {/* 7-Day Target Tracker */}
          <section className="dashboard__section">
            <h2 className="dashboard__section-title">
              <Target size={20} /> 7-Day Registration Target Tracker
            </h2>
            <div className="prototype-notice mb-4">
              <span>ℹ️</span>
              <span>Enter actual daily registrations. Targets are proposed campaign goals, not verified data.</span>
            </div>
            <div className="day-tracker card">
              <table className="day-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Target (Cumulative)</th>
                    <th>Actual (Cumulative)</th>
                    <th>Daily Actual</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {DAILY_TARGETS.map((target, i) => {
                    const cumulativeActual = dashboard.dailyActuals.slice(0, i + 1).reduce((a, b) => a + b, 0);
                    const pct = Math.min(100, Math.round((cumulativeActual / target) * 100));
                    return (
                      <tr key={i}>
                        <td><strong>Day {i + 1}</strong></td>
                        <td className="target-cell">{target}</td>
                        <td className={cumulativeActual >= target ? 'text-success' : 'text-warning'}>
                          {cumulativeActual}
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            className="day-input"
                            value={dashboard.dailyActuals[i] || ''}
                            onChange={(e) => updateDailyActual(i, e.target.value)}
                            aria-label={`Day ${i + 1} actual registrations`}
                            id={`day-${i + 1}-input`}
                          />
                        </td>
                        <td>
                          <div className="day-progress">
                            <div className="progress-bar">
                              <div
                                className={`progress-bar__fill${pct >= 100 ? ' progress-bar__fill--success' : ''}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="day-pct">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="day-total-row">
                    <td><strong>Total</strong></td>
                    <td><strong>500</strong></td>
                    <td className={totalActual >= 500 ? 'text-success' : ''}><strong>{totalActual}</strong></td>
                    <td />
                    <td>
                      <div className="day-progress">
                        <div className="progress-bar">
                          <div
                            className={`progress-bar__fill${totalActual >= 500 ? ' progress-bar__fill--success' : ''}`}
                            style={{ width: `${Math.min(100, (totalActual / 500) * 100)}%` }}
                          />
                        </div>
                        <span className="day-pct">{Math.round((totalActual / 500) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Budget Tracker */}
          <section className="dashboard__section">
            <h2 className="dashboard__section-title">
              <DollarSign size={20} /> Budget Tracker
            </h2>
            <div className="prototype-notice mb-4">
              <span>ℹ️</span>
              <span>Allocations are proposed. Enter actual spend to track real usage. Total budget: ₹{CAMPAIGN_BUDGET}.</span>
            </div>
            <div className="budget-card card">
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Allocated (₹)</th>
                    <th>Actual Spend (₹)</th>
                    <th>Remaining (₹)</th>
                    <th>Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {BUDGET_ALLOCATIONS.map((alloc, i) => {
                    const spent = dashboard.budgetSpend[i]?.spent || 0;
                    const rem = alloc.allocated - spent;
                    const pct = Math.min(100, Math.round((spent / alloc.allocated) * 100));
                    return (
                      <tr key={alloc.category}>
                        <td>{alloc.category}</td>
                        <td>₹{alloc.allocated}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={alloc.allocated}
                            className="day-input"
                            value={dashboard.budgetSpend[i]?.spent || ''}
                            onChange={(e) => updateSpend(i, e.target.value)}
                            aria-label={`${alloc.category} spend`}
                            id={`budget-${i}-input`}
                          />
                        </td>
                        <td className={rem < 0 ? 'text-warning' : ''}>₹{rem}</td>
                        <td>
                          <div className="day-progress">
                            <div className="progress-bar">
                              <div
                                className={`progress-bar__fill${pct >= 100 ? ' progress-bar__fill--warning' : ''}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="day-pct">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="day-total-row">
                    <td><strong>Total</strong></td>
                    <td><strong>₹{CAMPAIGN_BUDGET}</strong></td>
                    <td><strong>₹{totalSpent}</strong></td>
                    <td className={remaining < 0 ? 'text-warning' : ''}><strong>₹{remaining}</strong></td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Source Tracker */}
          <section className="dashboard__section">
            <h2 className="dashboard__section-title">
              <Users size={20} /> Source Tracking
            </h2>
            <div className="prototype-notice mb-4">
              <span>ℹ️</span>
              <span>
                Enter actual numbers from each source. Registration counts are <strong>not connected</strong> to any registration system.
                UTM parameters (<code>utm_source</code>, <code>ref</code>) are captured from URL but not aggregated here automatically in this prototype.
              </span>
            </div>
            <div className="source-card card">
              <div className="source-table-wrap">
                <table className="source-table">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Challenge Starts</th>
                      <th>Blueprint Done</th>
                      <th>CTA Clicks</th>
                      <th>Registrations</th>
                      <th>Spend (₹)</th>
                      <th>Cost/Reg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.sourceData.map((row, i) => {
                      const costPerReg = row.confirmedRegistrations
                        ? `₹${(row.spend / row.confirmedRegistrations).toFixed(0)}`
                        : '—';
                      return (
                        <tr key={row.source}>
                          <td><strong>{row.source}</strong></td>
                          <td>
                            <input type="number" min="0" className="day-input" value={row.challengeStarts || ''} onChange={(e) => updateSourceField(i, 'challengeStarts', e.target.value)} id={`source-${i}-starts`} aria-label={`${row.source} challenge starts`} />
                          </td>
                          <td>
                            <input type="number" min="0" className="day-input" value={row.blueprintCompletions || ''} onChange={(e) => updateSourceField(i, 'blueprintCompletions', e.target.value)} id={`source-${i}-blueprints`} aria-label={`${row.source} blueprints`} />
                          </td>
                          <td>
                            <input type="number" min="0" className="day-input" value={row.workshopClicks || ''} onChange={(e) => updateSourceField(i, 'workshopClicks', e.target.value)} id={`source-${i}-clicks`} aria-label={`${row.source} CTA clicks`} />
                          </td>
                          <td>
                            <span className="badge badge--warning">Not Connected</span>
                          </td>
                          <td>
                            <input type="number" min="0" className="day-input" value={row.spend || ''} onChange={(e) => updateSourceField(i, 'spend', e.target.value)} id={`source-${i}-spend`} aria-label={`${row.source} spend`} />
                          </td>
                          <td>{costPerReg}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Event Log */}
          <section className="dashboard__section">
            <h2 className="dashboard__section-title">
              <TrendingUp size={20} /> Event Log Summary
            </h2>
            <div className="event-grid">
              {[
                'landing_page_view', 'challenge_started', 'problem_submitted',
                'blueprint_generated', 'blueprint_copied', 'blueprint_downloaded',
                'workshop_cta_clicked', 'referral_link_copied', 'share_clicked',
              ].map((evt) => (
                <div key={evt} className="event-card card">
                  <div className="event-card__count">{eventCounts[evt] || 0}</div>
                  <div className="event-card__name">{evt.replace(/_/g, ' ')}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="dashboard__footer-note">
            <p className="text-small text-muted">
              Last updated: {new Date(dashboard.lastUpdated).toLocaleString()} ·
              Data stored in this browser only. Export CSV to share with team members.
            </p>
          </div>
        </div>
      </main>

      {/* Reset confirm */}
      {showResetConfirm && (
        <div className="wizard__confirm-overlay" role="dialog" aria-modal="true">
          <div className="wizard__confirm-card card">
            <h3>Reset all demo data?</h3>
            <p className="text-muted mt-2">
              This will clear all dashboard data and event logs in this browser. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button className="btn btn--primary" onClick={handleReset} id="confirm-dashboard-reset-btn">
                Yes, reset everything
              </button>
              <button className="btn btn--secondary" onClick={() => setShowResetConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({
  icon, label, value, color, note, isWarning,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  note?: string;
  isWarning?: boolean;
}) {
  const colorMap: Record<string, string> = {
    primary: 'var(--clr-primary)',
    success: 'var(--clr-success)',
    info: 'var(--clr-info)',
    warning: 'var(--clr-warning)',
    accent: 'var(--clr-accent)',
    muted: 'var(--clr-body-muted)',
  };
  const bgMap: Record<string, string> = {
    primary: 'var(--clr-primary-light)',
    success: 'var(--clr-success-light)',
    info: 'var(--clr-info-light)',
    warning: 'var(--clr-warning-light)',
    accent: 'var(--clr-accent-light)',
    muted: 'var(--clr-border)',
  };

  return (
    <div className="kpi-card card">
      <div className="kpi-card__icon" style={{ background: bgMap[color], color: colorMap[color] }}>
        {icon}
      </div>
      <div className="kpi-card__value" style={{ color: colorMap[color] }}>{value}</div>
      <div className="kpi-card__label">{label}</div>
      {note && (
        <div className={`kpi-card__note${isWarning ? ' kpi-card__note--warning' : ''}`}>{note}</div>
      )}
    </div>
  );
}
