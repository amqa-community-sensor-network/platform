// ===== QUANTAQ INTEGRATION =====
// Connects to QuantAQ API to auto-detect sensor issues

const QUANTAQ_API = '/quantaq-api'; // Local proxy — will be Supabase Edge Function in production
const QUANTAQ_OFFLINE_THRESHOLD_MIN = 60;

// QuantAQ flag bitmask values
const QUANTAQ_FLAGS = {
    FLAG_STARTUP: 1,
    FLAG_OPC: 2,        // PM sensor (optical particle counter)
    FLAG_NEPH: 4,       // PM sensor (nephelometer)
    FLAG_RHTP: 8,       // Temperature/humidity sensor
    FLAG_CO: 16,
    FLAG_NO: 32,
    FLAG_NO2: 64,
    FLAG_O3: 128,
    FLAG_SD: 8192,      // SD card failure
};

// Map QuantAQ flags to app status names
const QUANTAQ_FLAG_TO_STATUS = {
    FLAG_OPC: 'PM Sensor Issue',
    FLAG_NEPH: 'PM Sensor Issue',
    FLAG_CO: 'Gaseous Sensor Issue',
    FLAG_NO: 'Gaseous Sensor Issue',
    FLAG_NO2: 'Gaseous Sensor Issue',
    FLAG_O3: 'Gaseous Sensor Issue',
    FLAG_SD: 'SD Card Issue',
};

// In-memory alert state
let quantaqAlerts = [];
let quantaqLastCheck = null;
let quantaqChecking = false;
let quantaqFilter = ''; // '' = all, or 'Offline', 'PM Sensor Issue', etc.

// ===== API CALLS =====

async function quantaqApiCall(path) {
    const resp = await fetch(QUANTAQ_API + path);
    if (!resp.ok) throw new Error(`QuantAQ API error: ${resp.status}`);
    return resp.json();
}

async function quantaqGetAllDevices() {
    let all = [];
    let page = 1;
    let pages = 1;
    while (page <= pages) {
        const data = await quantaqApiCall(`/devices/?per_page=100&page=${page}`);
        all = all.concat(data.data);
        pages = data.meta.pages;
        page++;
    }
    return all;
}

async function quantaqGetLatestRaw(sn) {
    try {
        const data = await quantaqApiCall(`/devices/${sn}/data/raw/?per_page=1&sort=timestamp,desc`);
        return data.data?.[0] || null;
    } catch(e) {
        return null;
    }
}

// ===== FLAG DECODING =====

function quantaqDecodeFlags(flagValue) {
    const active = [];
    for (const [name, val] of Object.entries(QUANTAQ_FLAGS)) {
        if (flagValue & val) active.push(name);
    }
    return active;
}

function quantaqFlagsToStatuses(flags) {
    const statuses = new Set();
    for (const flag of flags) {
        if (QUANTAQ_FLAG_TO_STATUS[flag]) statuses.add(QUANTAQ_FLAG_TO_STATUS[flag]);
    }
    return [...statuses];
}

// ===== MAIN CHECK =====

async function runQuantAQCheck() {
    if (quantaqChecking) return;
    quantaqChecking = true;

    const previousAlerts = [...quantaqAlerts];
    const newAlerts = [];
    const now = new Date();

    try {
        updateQuantAQStatus('Fetching sensor list...');
        const devices = await quantaqGetAllDevices();

        // Process in parallel batches of 10
        const BATCH = 10;
        for (let b = 0; b < devices.length; b += BATCH) {
            const batch = devices.slice(b, b + BATCH);
            updateQuantAQStatus(`Checking sensors ${b+1}–${Math.min(b+BATCH, devices.length)} of ${devices.length}...`);

            await Promise.all(batch.map(async (d) => {
                // Match to app sensor
                const appSensor = sensors.find(s => s.id === d.sn);
                const issues = [];

                // Offline check
                const lastSeen = new Date(d.last_seen + 'Z');
                const minsSinceLastSeen = (now - lastSeen) / 60000;
                if (minsSinceLastSeen > QUANTAQ_OFFLINE_THRESHOLD_MIN) {
                    issues.push({
                        type: 'Offline',
                        detail: `Last seen ${quantaqTimeSince(d.last_seen)}`,
                    });
                }

                // Flag check (only for online sensors — offline ones won't have fresh data)
                if (minsSinceLastSeen <= QUANTAQ_OFFLINE_THRESHOLD_MIN) {
                    const raw = await quantaqGetLatestRaw(d.sn);
                    if (raw && raw.flag && raw.flag > 0) {
                        const activeFlags = quantaqDecodeFlags(raw.flag);
                        const nonStartup = activeFlags.filter(f => f !== 'FLAG_STARTUP');
                        const statuses = quantaqFlagsToStatuses(nonStartup);
                        for (const status of statuses) {
                            issues.push({
                                type: status,
                                detail: `Flags: ${nonStartup.join(', ')} (raw: ${raw.flag})`,
                                dataTimestamp: raw.timestamp,
                            });
                        }
                    }
                }

                for (const issue of issues) {
                    // Check if this alert already existed
                    const existing = previousAlerts.find(a =>
                        a.sensorSn === d.sn && a.issueType === issue.type && a.status === 'active'
                    );

                    if (existing) {
                        // Ongoing alert — carry it forward
                        newAlerts.push({ ...existing, lastChecked: now.toISOString(), detail: issue.detail });
                    } else {
                        // New alert
                        newAlerts.push({
                            id: 'qa_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                            sensorSn: d.sn,
                            sensorModel: d.model,
                            communityName: appSensor ? getCommunityName(appSensor.community) : (d.city || ''),
                            issueType: issue.type,
                            detail: issue.detail,
                            status: 'active',
                            isNew: true,
                            detectedAt: now.toISOString(),
                            lastChecked: now.toISOString(),
                            acknowledgedBy: null,
                            notes: [],
                        });

                        // Auto-update sensor status in the app
                        if (appSensor && issue.type !== 'Offline') {
                            const currentStatuses = getStatusArray(appSensor);
                            if (!currentStatuses.includes(issue.type)) {
                                appSensor.status = [...currentStatuses, issue.type];
                                persistSensor(appSensor);
                            }
                        }
                    }
                }
            }));
        }

        // Find resolved alerts (were active before, not in new alerts)
        for (const prev of previousAlerts) {
            if (prev.status === 'active') {
                const stillActive = newAlerts.find(a =>
                    a.sensorSn === prev.sensorSn && a.issueType === prev.issueType && a.status === 'active'
                );
                if (!stillActive) {
                    // Resolved!
                    newAlerts.push({
                        ...prev,
                        status: 'resolved',
                        resolvedAt: now.toISOString(),
                        isNew: true,
                    });

                    // Auto-remove status from sensor
                    const appSensor = sensors.find(s => s.id === prev.sensorSn);
                    if (appSensor && prev.issueType !== 'Offline') {
                        const currentStatuses = getStatusArray(appSensor);
                        const updated = currentStatuses.filter(st => st !== prev.issueType);
                        if (updated.length !== currentStatuses.length) {
                            appSensor.status = updated.length > 0 ? updated : ['Online'];
                            persistSensor(appSensor);
                        }
                    }
                }
            }
        }

        // Also carry forward acknowledged/resolved alerts from before (for history)
        for (const prev of previousAlerts) {
            if (prev.status === 'resolved' || prev.status === 'acknowledged') {
                if (!newAlerts.find(a => a.id === prev.id)) {
                    newAlerts.push({ ...prev, isNew: false });
                }
            }
        }

        quantaqAlerts = newAlerts;
        quantaqLastCheck = now.toISOString();
        updateQuantAQStatus('');
        renderDashboard();
        if (document.getElementById('view-quantaq-alerts')?.classList.contains('active')) {
            renderQuantAQAlertsView();
        }

    } catch(err) {
        console.error('QuantAQ check failed:', err);
        updateQuantAQStatus('Check failed: ' + err.message);
    } finally {
        quantaqChecking = false;
    }
}

// ===== HELPERS =====

function quantaqTimeSince(dateStr) {
    const diff = Date.now() - new Date(dateStr + 'Z').getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ${hrs % 24}h ago`;
}

function updateQuantAQStatus(msg) {
    const el = document.getElementById('quantaq-status');
    if (el) el.textContent = msg;
}

// ===== DASHBOARD ALERTS (inline on dashboard) =====

function renderDashboardAlerts() {
    const container = document.getElementById('dashboard-alerts-section');
    if (!container) return;

    // Update check button state
    const btn = document.getElementById('dashboard-check-btn');
    if (btn) {
        btn.disabled = quantaqChecking;
        btn.textContent = quantaqChecking ? 'Checking...' : 'Run QuantAQ Check';
    }

    // Update last check time
    const lastCheckEl = document.getElementById('dashboard-last-check');
    if (lastCheckEl && quantaqLastCheck) {
        lastCheckEl.textContent = 'Last QuantAQ check: ' + new Date(quantaqLastCheck).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    }

    const active = quantaqAlerts.filter(a => a.status === 'active');
    const newAlerts = active.filter(a => a.isNew);
    const offline = active.filter(a => a.issueType === 'Offline');
    const pmIssues = active.filter(a => a.issueType === 'PM Sensor Issue');
    const gasIssues = active.filter(a => a.issueType === 'Gaseous Sensor Issue');
    const sdIssues = active.filter(a => a.issueType === 'SD Card Issue');
    const resolved = quantaqAlerts.filter(a => a.status === 'resolved' && a.isNew);

    if (active.length === 0 && resolved.length === 0 && !quantaqLastCheck) {
        container.innerHTML = `<div class="quantaq-empty" style="padding:24px">
            <p style="font-size:14px;color:var(--slate-400)">Click "Run QuantAQ Check" to scan all sensors for issues.</p>
        </div>`;
        return;
    }

    let html = '';

    // Alert counts row — clickable to filter
    if (active.length > 0) {
        const countCard = (list, type, cls, label) => list.length > 0
            ? `<div class="quantaq-count ${cls} ${quantaqFilter === type ? 'active-filter' : ''}" onclick="filterQuantAQAlerts('${type}')"><span class="quantaq-count-num">${list.length}</span><span class="quantaq-count-label">${label}</span></div>`
            : '';
        html += `<div class="quantaq-counts" style="margin-bottom:16px">
            ${countCard(active, '', 'all', 'All Active')}
            ${countCard(offline, 'Offline', 'offline', 'Offline')}
            ${countCard(pmIssues, 'PM Sensor Issue', 'pm', 'PM Issue')}
            ${countCard(gasIssues, 'Gaseous Sensor Issue', 'gas', 'Gas Issue')}
            ${countCard(sdIssues, 'SD Card Issue', 'sd', 'SD Card')}
        </div>`;
        if (quantaqFilter) {
            html += `<p style="font-size:12px;color:var(--slate-400);margin-bottom:12px">Filtered by: <strong>${quantaqFilter || 'All'}</strong> <a href="#" onclick="event.preventDefault();filterQuantAQAlerts('')" style="color:var(--navy-400);margin-left:6px">Clear filter</a></p>`;
        }
        if (newAlerts.length > 0 && !quantaqFilter) html += `<p class="quantaq-new-badge">${newAlerts.length} new since last check</p>`;
        if (resolved.length > 0 && !quantaqFilter) html += `<p class="quantaq-resolved-badge">${resolved.length} resolved since last check</p>`;
    }

    // Apply filter
    const filterFn = a => !quantaqFilter || quantaqFilter === a.issueType;
    const filteredNew = newAlerts.filter(filterFn);
    const ongoing = active.filter(a => !a.isNew).filter(filterFn);
    const filteredResolved = resolved.filter(filterFn);

    // New alerts
    if (filteredNew.length > 0) {
        html += `<h3 class="quantaq-section-title" style="color:#dc2626">New Alerts (${filteredNew.length})</h3>`;
        html += renderQuantAQAlertList(filteredNew, true);
    }

    // Ongoing
    if (ongoing.length > 0) {
        html += `<h3 class="quantaq-section-title">Preexisting Alerts (${ongoing.length})</h3>`;
        html += renderQuantAQAlertList(ongoing, false);
    }

    // Resolved
    if (filteredResolved.length > 0) {
        html += `<h3 class="quantaq-section-title" style="color:#16a34a">Resolved (${filteredResolved.length})</h3>`;
        html += renderQuantAQAlertList(filteredResolved, false);
    }

    // All clear
    if (active.length === 0 && quantaqLastCheck) {
        html += `<div class="quantaq-empty" style="padding:24px">
            <span style="font-size:28px;color:#16a34a">&#10003;</span>
            <p style="font-size:15px;font-weight:600;color:var(--navy-500);margin-top:6px">All Clear</p>
            <p style="font-size:13px;color:var(--slate-400)">All sensors are online and healthy.</p>
        </div>`;
    }

    // View all link
    if (active.length > 0) {
        html += `<div style="text-align:center;margin-top:16px">
            <button class="btn btn-primary" onclick="showView('quantaq-alerts')">View Full Alert Details</button>
        </div>`;
    }

    container.innerHTML = html;
}

// ===== FULL ALERTS VIEW =====

function renderQuantAQAlertsView() {
    const container = document.getElementById('quantaq-alerts-content');
    if (!container) return;

    const active = quantaqAlerts.filter(a => a.status === 'active');
    const newActive = active.filter(a => a.isNew);
    const ongoingActive = active.filter(a => !a.isNew);
    const resolved = quantaqAlerts.filter(a => a.status === 'resolved' && a.isNew);

    const lastCheckStr = quantaqLastCheck
        ? new Date(quantaqLastCheck).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
        : 'Never';

    let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
            <div>
                <p style="font-size:13px;color:var(--slate-500)">Last check: ${lastCheckStr}</p>
                <span id="quantaq-status" style="font-size:11px;color:var(--slate-400)"></span>
            </div>
            <button class="btn btn-primary" onclick="runQuantAQCheck()" ${quantaqChecking ? 'disabled' : ''}>
                ${quantaqChecking ? 'Checking...' : 'Run Check Now'}
            </button>
        </div>
    `;

    // Summary counts
    const offline = active.filter(a => a.issueType === 'Offline');
    const pmIssues = active.filter(a => a.issueType === 'PM Sensor Issue');
    const gasIssues = active.filter(a => a.issueType === 'Gaseous Sensor Issue');
    const sdIssues = active.filter(a => a.issueType === 'SD Card Issue');

    html += `<div class="quantaq-summary-row">
        <div class="quantaq-summary-card"><span class="quantaq-summary-num ${active.length > 0 ? 'alert' : 'ok'}">${active.length}</span><span class="quantaq-summary-label">Active Alerts</span></div>
        <div class="quantaq-summary-card"><span class="quantaq-summary-num ${offline.length > 0 ? 'alert' : ''}">${offline.length}</span><span class="quantaq-summary-label">Offline</span></div>
        <div class="quantaq-summary-card"><span class="quantaq-summary-num ${pmIssues.length > 0 ? 'alert' : ''}">${pmIssues.length}</span><span class="quantaq-summary-label">PM Issues</span></div>
        <div class="quantaq-summary-card"><span class="quantaq-summary-num ${gasIssues.length > 0 ? 'alert' : ''}">${gasIssues.length}</span><span class="quantaq-summary-label">Gas Issues</span></div>
        <div class="quantaq-summary-card"><span class="quantaq-summary-num ${sdIssues.length > 0 ? 'alert' : ''}">${sdIssues.length}</span><span class="quantaq-summary-label">SD Card</span></div>
        <div class="quantaq-summary-card"><span class="quantaq-summary-num ok">${resolved.length}</span><span class="quantaq-summary-label">Resolved</span></div>
    </div>`;

    // New alerts
    if (newActive.length > 0) {
        html += `<h3 class="quantaq-section-title" style="color:#dc2626">New Since Last Check (${newActive.length})</h3>`;
        html += renderQuantAQAlertList(newActive, true);
    }

    // Ongoing alerts
    if (ongoingActive.length > 0) {
        html += `<h3 class="quantaq-section-title">Ongoing (${ongoingActive.length})</h3>`;
        html += renderQuantAQAlertList(ongoingActive, false);
    }

    // Resolved
    if (resolved.length > 0) {
        html += `<h3 class="quantaq-section-title" style="color:#16a34a">Resolved Since Last Check (${resolved.length})</h3>`;
        html += renderQuantAQAlertList(resolved, false);
    }

    if (active.length === 0 && resolved.length === 0) {
        html += `<div class="quantaq-empty">
            <span style="font-size:36px">&#10003;</span>
            <p style="font-size:15px;font-weight:600;color:var(--navy-500);margin-top:8px">All Clear</p>
            <p style="font-size:13px;color:var(--slate-400)">No active alerts. All sensors are online and healthy.</p>
        </div>`;
    }

    container.innerHTML = html;
}

function renderQuantAQAlertList(alerts, isNew) {
    return alerts.map(a => {
        const isOffline = a.issueType === 'Offline';
        const isResolved = a.status === 'resolved';
        const badgeClass = isResolved ? 'quantaq-badge-resolved'
            : isOffline ? 'quantaq-badge-offline'
            : a.issueType === 'PM Sensor Issue' ? 'quantaq-badge-pm'
            : a.issueType === 'Gaseous Sensor Issue' ? 'quantaq-badge-gas'
            : 'quantaq-badge-sd';

        const detectedStr = new Date(a.detectedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        const duration = quantaqTimeSince(a.detectedAt.replace('Z', ''));

        const notesHtml = a.notes.length > 0
            ? a.notes.map(n => `<div class="quantaq-note"><strong>${escapeHtml(n.by)}</strong> <span style="color:var(--slate-400)">${new Date(n.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span><br>${escapeHtml(n.text)}</div>`).join('')
            : '';

        return `<div class="quantaq-alert-card ${isNew ? 'new' : ''} ${isResolved ? 'resolved' : ''}">
            <div class="quantaq-alert-header">
                <div>
                    <span class="quantaq-alert-sn" onclick="showSensorDetail('${a.sensorSn}')">${a.sensorSn}</span>
                    <span class="quantaq-badge ${badgeClass}">${a.issueType}</span>
                    ${isNew && !isResolved ? '<span class="quantaq-new-tag">NEW</span>' : ''}
                </div>
                <span class="quantaq-alert-community">${escapeHtml(a.communityName)}</span>
            </div>
            <div class="quantaq-alert-body">
                <p class="quantaq-alert-detail">${escapeHtml(a.detail)}</p>
                <p class="quantaq-alert-meta">Detected: ${detectedStr} (${duration})${isResolved ? ` · Resolved: ${new Date(a.resolvedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}` : ''}</p>
                ${notesHtml}
            </div>
            ${!isResolved ? `<div class="quantaq-alert-actions">
                <button class="btn btn-sm" onclick="addQuantAQNote('${a.id}')">Add Note</button>
                <button class="btn btn-sm" onclick="acknowledgeQuantAQAlert('${a.id}')">${a.acknowledgedBy ? 'Acknowledged by ' + escapeHtml(a.acknowledgedBy) : 'Acknowledge'}</button>
            </div>` : ''}
        </div>`;
    }).join('');
}

// ===== FILTER =====

function filterQuantAQAlerts(type) {
    quantaqFilter = quantaqFilter === type ? '' : type; // toggle
    renderDashboardAlerts();
    if (document.getElementById('view-quantaq-alerts')?.classList.contains('active')) {
        renderQuantAQAlertsView();
    }
}

// ===== ALERT ACTIONS =====

function acknowledgeQuantAQAlert(alertId) {
    const alert = quantaqAlerts.find(a => a.id === alertId);
    if (!alert) return;
    alert.acknowledgedBy = currentUser || 'Unknown';
    renderQuantAQAlertsView();
}

function addQuantAQNote(alertId) {
    const alert = quantaqAlerts.find(a => a.id === alertId);
    if (!alert) return;
    const text = prompt('Add a note to this alert:');
    if (!text || !text.trim()) return;
    alert.notes.push({
        by: currentUser || 'Unknown',
        at: new Date().toISOString(),
        text: text.trim(),
    });
    renderQuantAQAlertsView();
}

