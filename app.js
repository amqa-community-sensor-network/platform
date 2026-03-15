// ===== DATA LAYER =====
const COMMUNITIES = [
    { id: 'anchorage', name: 'Anchorage' },
    { id: 'badger', name: 'Badger' },
    { id: 'bethel', name: 'Bethel' },
    { id: 'big-lake', name: 'Big Lake' },
    { id: 'chickaloon', name: 'Chickaloon' },
    { id: 'cordova', name: 'Cordova' },
    { id: 'delta-junction', name: 'Delta Junction' },
    { id: 'fairbanks', name: 'Fairbanks' },
    { id: 'galena', name: 'Galena' },
    { id: 'gerstle-river', name: 'Gerstle River' },
    { id: 'glennallen', name: 'Glennallen' },
    { id: 'goldstream', name: 'Goldstream' },
    { id: 'haines', name: 'Haines' },
    { id: 'homer', name: 'Homer' },
    { id: 'hoonah', name: 'Hoonah' },
    { id: 'juneau', name: 'Juneau' },
    { id: 'kenai', name: 'Kenai' },
    { id: 'ketchikan', name: 'Ketchikan' },
    { id: 'kodiak', name: 'Kodiak' },
    { id: 'kotzebue', name: 'Kotzebue' },
    { id: 'napaskiak', name: 'Napaskiak' },
    { id: 'nenana', name: 'Nenana' },
    { id: 'ninilchik', name: 'Ninilchik' },
    { id: 'nome', name: 'Nome' },
    { id: 'palmer', name: 'Palmer' },
    { id: 'salcha', name: 'Salcha' },
    { id: 'seward', name: 'Seward' },
    { id: 'sitka', name: 'Sitka' },
    { id: 'skagway', name: 'Skagway' },
    { id: 'soldotna', name: 'Soldotna' },
    { id: 'talkeetna', name: 'Talkeetna' },
    { id: 'tok', name: 'Tok' },
    { id: 'tyonek', name: 'Tyonek' },
    { id: 'valdez', name: 'Valdez' },
    { id: 'wasilla', name: 'Wasilla' },
    { id: 'willow', name: 'Willow' },
    { id: 'wrangell', name: 'Wrangell' },
    { id: 'yakutat', name: 'Yakutat' },
];

const AVAILABLE_TAGS = [
    'Regulatory Site',
    'Municipality of Anchorage Network',
    'Interior Network',
    'BLM',
];

function loadData(key, fallback) {
    try {
        const raw = localStorage.getItem('snt_' + key);
        return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
}

function saveData(key, data) {
    localStorage.setItem('snt_' + key, JSON.stringify(data));
}

let sensors = loadData('sensors', []);
let contacts = loadData('contacts', []);
let notes = loadData('notes', []);
let comms = loadData('comms', []);
let communityFiles = loadData('communityFiles', {});
let communityTags = loadData('communityTags', {});

// Initialize default tags if empty
if (Object.keys(communityTags).length === 0) {
    communityTags = {
        anchorage: ['Regulatory Site', 'Municipality of Anchorage Network'],
        fairbanks: ['Regulatory Site', 'Interior Network'],
        juneau: ['Regulatory Site'],
        glennallen: ['BLM'],
        talkeetna: ['BLM'],
    };
    saveData('communityTags', communityTags);
}

function getCommunityTags(communityId) {
    return communityTags[communityId] || [];
}

function persist() {
    saveData('sensors', sensors);
    saveData('contacts', contacts);
    saveData('notes', notes);
    saveData('comms', comms);
    saveData('communityFiles', communityFiles);
    saveData('communityTags', communityTags);
}

// ===== RECENT ACTIVITY TRACKING =====
let recentActivity = loadData('recentActivity', { communities: [], contacts: [], sensors: [] });

function trackRecent(type, id, action) {
    // type: 'communities' | 'contacts' | 'sensors'
    // action: 'viewed' | 'edited'
    const list = recentActivity[type] || [];
    // Remove existing entry for this id
    const filtered = list.filter(item => item.id !== id);
    // Add to front
    filtered.unshift({ id, action, time: new Date().toISOString() });
    // Keep only 5
    recentActivity[type] = filtered.slice(0, 5);
    saveData('recentActivity', recentActivity);
}

// Load sample data on first run
if (sensors.length === 0 && contacts.length === 0) {
    sensors = [
        { id: 'MOD-00442', soaTagId: '', type: 'Community Pod', status: [], community: 'napaskiak', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00443', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00444', soaTagId: '', type: 'Community Pod', status: [], community: 'wrangell', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00445', soaTagId: '', type: 'Community Pod', status: ['Lab Storage'], community: '', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00446', soaTagId: '', type: 'Community Pod', status: [], community: 'galena', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00447', soaTagId: '', type: 'Community Pod', status: [], community: 'delta-junction', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00448', soaTagId: '', type: 'Community Pod', status: [], community: 'goldstream', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00449', soaTagId: '', type: 'Community Pod', status: [], community: 'ketchikan', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00450', soaTagId: '', type: 'Community Pod', status: [], community: 'haines', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00451', soaTagId: '', type: 'Community Pod', status: ['Lab Storage'], community: '', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00452', soaTagId: '', type: 'Community Pod', status: [], community: 'hoonah', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00453', soaTagId: '', type: 'Community Pod', status: [], community: 'skagway', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00454', soaTagId: '', type: 'Community Pod', status: [], community: 'sitka', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00455', soaTagId: '', type: 'Community Pod', status: [], community: 'juneau', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00456', soaTagId: '', type: 'Community Pod', status: [], community: 'juneau', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00458', soaTagId: '', type: 'Community Pod', status: [], community: 'valdez', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00459', soaTagId: '', type: 'Community Pod', status: [], community: 'soldotna', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00460', soaTagId: '', type: 'Audit Pod', status: [], community: 'anchorage', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00461', soaTagId: '', type: 'Community Pod', status: [], community: 'ninilchik', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00462', soaTagId: '', type: 'Community Pod', status: [], community: 'anchorage', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00463', soaTagId: '', type: 'Permanent Pod', status: [], community: 'anchorage', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00464', soaTagId: '', type: 'Community Pod', status: [], community: 'homer', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00465', soaTagId: '', type: 'Community Pod', status: [], community: 'seward', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00466', soaTagId: '', type: 'Community Pod', status: [], community: 'glennallen', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00467', soaTagId: '', type: 'Community Pod', status: [], community: 'talkeetna', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00468', soaTagId: '', type: 'Community Pod', status: [], community: 'big-lake', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00469', soaTagId: '', type: 'Community Pod', status: [], community: 'tyonek', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00470', soaTagId: '', type: 'Community Pod', status: [], community: 'willow', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00471', soaTagId: '', type: 'Audit Pod', status: [], community: 'anchorage', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00649', soaTagId: '', type: 'Community Pod', status: [], community: 'chickaloon', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00650', soaTagId: '', type: 'Community Pod', status: [], community: 'kenai', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00651', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00652', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00653', soaTagId: '', type: 'Community Pod', status: [], community: 'tok', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00654', soaTagId: '', type: 'Community Pod', status: [], community: 'nome', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00655', soaTagId: '', type: 'Community Pod', status: [], community: 'nenana', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00656', soaTagId: '', type: 'Community Pod', status: ['Lab Storage'], community: '', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00657', soaTagId: '', type: 'Community Pod', status: [], community: 'palmer', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00658', soaTagId: '', type: 'Community Pod', status: [], community: 'yakutat', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00659', soaTagId: '', type: 'Community Pod', status: [], community: 'bethel', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00660', soaTagId: '', type: 'Community Pod', status: [], community: 'kodiak', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00662', soaTagId: '', type: 'Community Pod', status: [], community: 'kotzebue', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00663', soaTagId: '', type: 'Community Pod', status: [], community: 'wasilla', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00664', soaTagId: '', type: 'Community Pod', status: [], community: 'badger', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00665', soaTagId: '', type: 'Audit Pod', status: [], community: 'juneau', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00666', soaTagId: '', type: 'Community Pod', status: ['Lab Storage'], community: '', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00667', soaTagId: '', type: 'Community Pod', status: [], community: 'cordova', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00668', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00669', soaTagId: '', type: 'Permanent Pod', status: [], community: 'juneau', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00670', soaTagId: '', type: 'Community Pod', status: ['Lab Storage'], community: '', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00671', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: 'Anne Wien Elementary School', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00672', soaTagId: '', type: 'Community Pod', status: [], community: 'salcha', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00673', soaTagId: '', type: 'Community Pod', status: [], community: 'gerstle-river', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-00674', soaTagId: '', type: 'Community Pod', status: ['Lab Storage'], community: '', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01656', soaTagId: '', type: 'Community Pod', status: [], community: 'anchorage', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01657', soaTagId: '', type: 'Community Pod', status: [], community: 'anchorage', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01658', soaTagId: '', type: 'Community Pod', status: ['Lab Storage'], community: '', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01754', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01755', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01757', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01758', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01759', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01760', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01761', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01762', soaTagId: '', type: 'Community Pod', status: [], community: 'anchorage', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01763', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01764', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01765', soaTagId: '', type: 'Community Pod', status: [], community: 'anchorage', location: '', datePurchased: '', collocationDates: '' },
        { id: 'MOD-X-PM-01766', soaTagId: '', type: 'Community Pod', status: [], community: 'fairbanks', location: '', datePurchased: '', collocationDates: '' },
    ];
    contacts = [
        { id: 'c1', name: 'Patricia Valerio', role: 'Tribal Environmental Coordinator', community: 'kodiak', email: 'pvalerio@example.com', phone: '907-555-0101', org: 'Kodiak Area Native Association' },
        { id: 'c2', name: 'Kim Sweet', role: 'Village Administrator', community: 'bethel', email: 'ksweet@example.com', phone: '907-555-0202', org: 'Orutsararmiut Native Council' },
        { id: 'c3', name: 'James Dalton', role: 'School Principal', community: 'wrangell', email: 'jdalton@example.com', phone: '907-555-0303', org: 'Wrangell Public Schools' },
        { id: 'c4', name: 'Maria Chen', role: 'Librarian', community: 'homer', email: 'mchen@example.com', phone: '907-555-0404', org: 'Homer Public Library' },
    ];
    notes = [
        {
            id: 'n1',
            date: '2026-03-13',
            type: 'Audit',
            text: 'Kodiak sensor MOD-00660 audited by Anchorage audit pod MOD-00471 from March 5 - March 13, 2026, with coordination assistance by @Patricia Valerio.',
            taggedSensors: ['MOD-00660', 'MOD-00471'],
            taggedCommunities: ['kodiak', 'anchorage'],
            taggedContacts: ['c1'],
        }
    ];
    persist();
}

// ===== USER SYSTEM =====
let appUsers = loadData('appUsers', []);
let currentUser = null;

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';

    const list = document.getElementById('login-user-list');
    if (appUsers.length > 0) {
        list.innerHTML = appUsers.map(u =>
            `<button class="login-user-btn" onclick="loginUser('${u.replace(/'/g, "\\'")}')">
                ${u}
            </button>`
        ).join('');
    } else {
        list.innerHTML = '';
    }
}

function loginUser(name) {
    currentUser = name;
    saveData('currentUser', name);
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    document.getElementById('sidebar-user').innerHTML =
        `<span class="user-name">${currentUser}</span><span class="user-logout">Sign out</span>`;
    renderSetupModeIndicator();
    restoreLastView();
}

function addAndLoginUser() {
    const input = document.getElementById('login-new-name');
    const name = input.value.trim();
    if (!name) return;
    if (!appUsers.includes(name)) {
        appUsers.push(name);
        saveData('appUsers', appUsers);
    }
    loginUser(name);
}

function logoutUser() {
    currentUser = null;
    saveData('currentUser', null);
    showLoginScreen();
}

function getCurrentUserName() {
    return currentUser || 'Unknown';
}

// ===== SETUP MODE =====
let setupMode = loadData('setupMode', false);

function toggleSetupMode() {
    setupMode = !setupMode;
    saveData('setupMode', setupMode);
    renderSetupModeIndicator();
    // Re-render current view to reflect mode change
    const activeView = document.querySelector('.view.active');
    if (activeView) {
        if (activeView.id === 'view-all-sensors') renderSensors();
    }
}

function renderSetupModeIndicator() {
    const el = document.getElementById('setup-mode-toggle');
    if (el) {
        el.classList.toggle('active', setupMode);
        el.querySelector('.setup-mode-label').textContent = setupMode ? 'Setup Mode ON' : 'Setup Mode';
    }
}

// ===== STATE =====
let currentCommunity = null;
let currentSensor = null;
let currentContact = null;

// ===== OPEN TABS =====
let openTabs = []; // { id, type, label, icon }
let activeTabId = null;

function getTabId(type, itemId) {
    return type + ':' + itemId;
}

function openTab(type, itemId, label) {
    const tabId = getTabId(type, itemId);
    const icons = { community: '\u25CF', sensor: '\u25A0', contact: '\u263B' };
    const existing = openTabs.find(t => t.id === tabId);
    if (!existing) {
        // Insert next to the currently active tab
        const activeIdx = openTabs.findIndex(t => t.id === activeTabId);
        const insertAt = activeIdx >= 0 ? activeIdx + 1 : openTabs.length;
        openTabs.splice(insertAt, 0, { id: tabId, type, itemId, label, icon: icons[type] || '' });
    }
    activeTabId = tabId;
    renderOpenTabs();
}

function closeTab(tabId, event) {
    if (event) event.stopPropagation();
    const idx = openTabs.findIndex(t => t.id === tabId);
    if (idx < 0) return;
    openTabs.splice(idx, 1);

    if (activeTabId === tabId) {
        // Switch to nearest tab, or go to dashboard if none left
        if (openTabs.length > 0) {
            const newIdx = Math.min(idx, openTabs.length - 1);
            switchToTab(openTabs[newIdx].id);
        } else {
            activeTabId = null;
            showView('dashboard');
        }
    }
    renderOpenTabs();
}

function switchToTab(tabId) {
    const tab = openTabs.find(t => t.id === tabId);
    if (!tab) return;
    activeTabId = tabId;
    renderOpenTabs();

    // Re-render the view without creating a new tab
    if (tab.type === 'community') showCommunityView(tab.itemId);
    else if (tab.type === 'sensor') showSensorView(tab.itemId);
    else if (tab.type === 'contact') showContactView(tab.itemId);
}

function renderOpenTabs() {
    const bar = document.getElementById('open-tabs-bar');
    if (openTabs.length === 0) {
        bar.classList.remove('visible');
        bar.innerHTML = '';
        return;
    }
    bar.classList.add('visible');
    bar.innerHTML = openTabs.map(tab => {
        const isActive = tab.id === activeTabId;
        return `<div class="open-tab ${isActive ? 'active' : ''}" onclick="switchToTab('${tab.id}')" title="${tab.label}">
            <span class="open-tab-icon">${tab.icon}</span>
            <span class="open-tab-label">${tab.label}</span>
            <span class="open-tab-close" onclick="closeTab('${tab.id}', event)">&times;</span>
        </div>`;
    }).join('');
}

function clearTabHighlight() {
    // When navigating to a list view, deactivate tab highlight but keep tabs
    activeTabId = null;
    renderOpenTabs();
}

// ===== SIDEBAR =====
function getAllTags() {
    // Combine AVAILABLE_TAGS with any tags assigned to communities
    const allAssigned = Object.values(communityTags).flat();
    return [...new Set([...AVAILABLE_TAGS, ...allAssigned])];
}

// Display names for tags (sidebar & filter bubbles) — tag value stays unchanged
const TAG_DISPLAY_NAMES = {
    'Regulatory Site': 'Regulatory Sites',
};

function getTagDisplayName(tag) {
    return TAG_DISPLAY_NAMES[tag] || tag;
}

function buildSidebar() {
    const list = document.getElementById('community-list');
    const tags = getAllTags();
    list.innerHTML = tags.map(tag =>
        `<li><a href="#" data-tag="${tag}" onclick="event.preventDefault(); filterCommunitiesByTag('${tag.replace(/'/g, "\\'")}')">${getTagDisplayName(tag)}</a></li>`
    ).join('');
}

// Arrow toggles the dropdown, clicking the label navigates to communities view
document.querySelector('.community-menu-item').addEventListener('click', (e) => {
    e.preventDefault();
    // If the click was on the arrow, toggle dropdown only
    if (e.target.classList.contains('community-toggle-arrow')) {
        const list = document.getElementById('community-list');
        const arrow = e.target;
        list.classList.toggle('open');
        arrow.classList.toggle('open');
        return;
    }
    // Otherwise navigate to communities view
    showView('communities');
});

document.querySelectorAll('.menu-item[data-view]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.dataset.view;
        if (view === 'dashboard') showView('dashboard');
        if (view === 'all-sensors') showView('all-sensors');
        if (view === 'contacts') showView('contacts');
        if (view === 'communities') return; // handled by community-menu-item listener
    });
});

// ===== VIEW MANAGEMENT =====
function saveLastView(type, id) {
    saveData('lastView', { type, id });
}

function restoreLastView() {
    const last = loadData('lastView', null);
    if (!last) { showView('dashboard'); return; }

    if (last.type === 'community' && last.id) {
        const exists = COMMUNITIES.find(c => c.id === last.id);
        if (exists) { showCommunity(last.id); return; }
    } else if (last.type === 'sensor' && last.id) {
        const exists = sensors.find(s => s.id === last.id);
        if (exists) { showSensorDetail(last.id); return; }
    } else if (last.type === 'contact' && last.id) {
        const exists = contacts.find(c => c.id === last.id);
        if (exists) { showContactDetail(last.id); return; }
    } else if (last.type === 'view' && last.id) {
        showView(last.id);
        return;
    }
    showView('dashboard');
}

function showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + viewName).classList.add('active');

    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    const menuItem = document.querySelector(`.menu-item[data-view="${viewName}"]`);
    if (menuItem) menuItem.classList.add('active');

    document.querySelectorAll('.community-list a').forEach(a => a.classList.remove('active'));
    // Highlight active tag in sidebar if filtering
    if (viewName === 'communities' && communityTagFilter) {
        document.querySelectorAll('.community-list a[data-tag]').forEach(a => {
            if (a.dataset.tag === communityTagFilter) a.classList.add('active');
        });
    }

    // Deactivate tab highlight when navigating to list views
    clearTabHighlight();

    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'all-sensors') renderSensors();
    if (viewName === 'contacts') renderContacts();
    if (viewName === 'communities') renderCommunitiesList();

    saveLastView('view', viewName);
}

// ===== DASHBOARD =====
function renderDashboard() {
    // Dashboard is just the embedded AQI map — nothing to render dynamically
}

// ===== COMMUNITIES LIST VIEW =====
let communityTagFilter = '';

function renderCommunityTagFilters() {
    const container = document.getElementById('community-tag-filters');
    if (!container) return;
    const tags = getAllTags();
    container.innerHTML = tags.map(tag => {
        const isActive = communityTagFilter === tag;
        return `<button class="community-tag-filter-btn ${isActive ? 'active' : ''}" onclick="filterCommunitiesByTag('${tag.replace(/'/g, "\\'")}')">${getTagDisplayName(tag)}</button>`;
    }).join('');
}

function renderCommunitiesList() {
    const search = (document.getElementById('community-search')?.value || '').toLowerCase();
    let filtered = COMMUNITIES.filter(c => {
        if (search && !c.name.toLowerCase().includes(search)) return false;
        if (communityTagFilter && !getCommunityTags(c.id).includes(communityTagFilter)) return false;
        return true;
    });

    renderCommunityTagFilters();

    const container = document.getElementById('communities-list-container');

    container.innerHTML = filtered.map(c => {
        const commSensors = sensors.filter(s => s.community === c.id);
        const sensorListStr = commSensors.length > 0
            ? commSensors.map(s => s.id).join(', ')
            : 'No sensors';
        const tags = getCommunityTags(c.id);
        const tagsHtml = tags.map(t =>
            `<span class="community-type-badge clickable-badge" onclick="event.stopPropagation(); filterCommunitiesByTag('${t}')">${t}</span>`
        ).join(' ');
        return `
            <div class="community-card" onclick="showCommunity('${c.id}')">
                <div class="community-card-info">
                    <h3>${c.name}</h3>
                    <div class="community-card-tags">${tagsHtml || '<span style="color:var(--slate-400);font-size:12px">No tags</span>'}</div>
                </div>
                <div class="community-card-sensors">
                    <div><strong>Associated Sensors:</strong></div>
                    <div class="sensor-list">${sensorListStr}</div>
                </div>
            </div>
        `;
    }).join('') || '<div class="empty-state">No communities found.</div>';
}

function filterCommunitiesByTag(tag) {
    communityTagFilter = communityTagFilter === tag ? '' : tag;
    showView('communities');
}

function clearCommunityTagFilter() {
    communityTagFilter = '';
    renderCommunitiesList();
}

// ===== SENSORS =====
function getStatusBadgeClass(status) {
    const map = {
        'Online': 'badge-online',
        'Offline': 'badge-offline',
        'In Transit': 'badge-transit',
        'Service at Quant': 'badge-service-quant',
        'Collocation': 'badge-collocation',
        'Auditing a Community': 'badge-auditing',
        'Lab Storage': 'badge-lab-storage',
        'Needs Repair': 'badge-needs-repair',
        'Ready for Deployment': 'badge-ready',
        'PM Sensor Issue': 'badge-issue',
        'Gaseous Sensor Issue': 'badge-issue',
        'SD Card Issue': 'badge-issue',
    };
    return map[status] || 'badge-offline';
}

const SENSOR_TYPES = ['Community Pod', 'Permanent Pod', 'Audit Pod', 'Collocation/Health Check', 'Not Assigned'];

// Get status as array (handles old single-string data and new array data)
function getStatusArray(s) {
    if (Array.isArray(s.status)) return s.status;
    if (s.status) return [s.status];
    return [];
}

function getStatusDisplay(s) {
    return getStatusArray(s).join(', ') || '—';
}

function renderStatusBadges(s, clickable) {
    const statuses = getStatusArray(s);
    if (statuses.length === 0) return '—';
    return statuses.map(st => {
        const cls = clickable ? 'badge-clickable' : '';
        const onclick = clickable ? `onclick="openStatusChangeModal('${s.id}')"` : '';
        return `<span class="badge ${getStatusBadgeClass(st)} ${cls}" ${onclick}>${st}</span>`;
    }).join(' ');
}

function getCommunityName(id) {
    const c = COMMUNITIES.find(c => c.id === id);
    return c ? c.name : id || '—';
}

function renderSensors() {
    const search = (document.getElementById('sensor-search')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('sensor-status-filter')?.value || '';

    let filtered = sensors.filter(s => {
        if (search && !s.id.toLowerCase().includes(search) && !getCommunityName(s.community).toLowerCase().includes(search) && !(s.soaTagId || '').toLowerCase().includes(search)) return false;
        if (statusFilter && !getStatusArray(s).includes(statusFilter)) return false;
        return true;
    });

    if (setupMode) {
        const communityOptions = '<option value="">— None —</option>' +
            COMMUNITIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        const statusOptions = ALL_STATUSES.map(st =>
            `<option value="${st}">${st}</option>`
        ).join('');
        const typeOptions = SENSOR_TYPES.map(t =>
            `<option value="${t}">${t}</option>`
        ).join('');

        document.getElementById('sensors-tbody').innerHTML = filtered.map(s => {
            const currentStatuses = getStatusArray(s);
            const statusSelectHtml = `<select class="inline-edit-select inline-edit-status" data-sensor="${s.id}" data-field="status" multiple title="Hold Ctrl/Cmd to select multiple">
                ${ALL_STATUSES.map(st => `<option value="${st}" ${currentStatuses.includes(st) ? 'selected' : ''}>${st}</option>`).join('')}
            </select>`;

            return `<tr>
                <td>
                    <span class="clickable" onclick="showSensorDetail('${s.id}')">${s.id}</span><br>
                    <select class="inline-edit-select inline-edit-sm" data-sensor="${s.id}" data-field="type" onchange="inlineSaveSensor(this)">
                        ${SENSOR_TYPES.map(t =>
                            `<option value="${t}" ${s.type === t ? 'selected' : ''}>${t}</option>`
                        ).join('')}
                    </select>
                </td>
                <td><input class="inline-edit-input" data-sensor="${s.id}" data-field="soaTagId" value="${s.soaTagId || ''}" placeholder="SOA Tag" onblur="inlineSaveSensor(this)" onkeydown="if(event.key==='Enter')this.blur()"></td>
                <td>${statusSelectHtml}</td>
                <td><select class="inline-edit-select" data-sensor="${s.id}" data-field="community" onchange="inlineSaveSensor(this)">
                    ${('<option value="">— None —</option>' + COMMUNITIES.map(c => `<option value="${c.id}" ${s.community === c.id ? 'selected' : ''}>${c.name}</option>`).join(''))}
                </select></td>
                <td><input class="inline-edit-input" data-sensor="${s.id}" data-field="location" value="${s.location || ''}" placeholder="Location" onblur="inlineSaveSensor(this)" onkeydown="if(event.key==='Enter')this.blur()"></td>
                <td><input class="inline-edit-input" type="date" data-sensor="${s.id}" data-field="datePurchased" value="${s.datePurchased || ''}" onblur="inlineSaveSensor(this)"></td>
                <td><input class="inline-edit-input" data-sensor="${s.id}" data-field="collocationDates" value="${s.collocationDates || ''}" placeholder="e.g. Mar 5-13" onblur="inlineSaveSensor(this)" onkeydown="if(event.key==='Enter')this.blur()"></td>
                <td>
                    <button class="btn btn-sm" onclick="openMoveSensorModal('${s.id}')">Move</button>
                </td>
            </tr>`;
        }).join('') || '<tr><td colspan="8" class="empty-state">No sensors found.</td></tr>';

        // Attach change listener for multi-select status fields
        document.querySelectorAll('.inline-edit-status').forEach(sel => {
            sel.addEventListener('change', function() { inlineSaveSensor(this); });
        });
    } else {
        document.getElementById('sensors-tbody').innerHTML = filtered.map(s => `
            <tr>
                <td><span class="clickable" onclick="showSensorDetail('${s.id}')">${s.id}</span><br><small style="color:#888">${s.type}</small></td>
                <td>${s.soaTagId || '—'}</td>
                <td>${renderStatusBadges(s, true)}</td>
                <td><span class="clickable" onclick="showCommunity('${s.community}')">${getCommunityName(s.community)}</span></td>
                <td>${s.location || '—'}</td>
                <td>${s.datePurchased || '—'}</td>
                <td>${s.collocationDates || '—'}</td>
                <td>
                    <button class="btn btn-sm" onclick="openEditSensorModal('${s.id}')">Edit</button>
                    <button class="btn btn-sm" onclick="openMoveSensorModal('${s.id}')">Move</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="8" class="empty-state">No sensors found.</td></tr>';
    }
}

function inlineSaveSensor(el) {
    const sensorId = el.dataset.sensor;
    const field = el.dataset.field;
    const s = sensors.find(x => x.id === sensorId);
    if (!s) return;

    if (field === 'status') {
        s.status = Array.from(el.selectedOptions).map(o => o.value);
    } else {
        s[field] = el.value.trim();
    }
    persist();
}

function openAddSensorModal() {
    document.getElementById('sensor-modal-title').textContent = 'Add New Sensor';
    document.getElementById('sensor-form').reset();
    document.getElementById('sensor-edit-id').value = '';
    populateCommunitySelect('sensor-community-input');
    renderStatusToggleList('sensor-status-input', []);
    openModal('modal-add-sensor');
}

function openEditSensorModal(sensorId) {
    const s = sensors.find(x => x.id === sensorId);
    if (!s) return;
    document.getElementById('sensor-modal-title').textContent = 'Edit Sensor';
    document.getElementById('sensor-edit-id').value = s.id;
    document.getElementById('sensor-id-input').value = s.id;
    document.getElementById('sensor-soa-input').value = s.soaTagId || '';
    document.getElementById('sensor-type-input').value = s.type;
    renderStatusToggleList('sensor-status-input', getStatusArray(s));
    populateCommunitySelect('sensor-community-input');
    document.getElementById('sensor-community-input').value = s.community;
    document.getElementById('sensor-location-input').value = s.location || '';
    document.getElementById('sensor-purchased-input').value = s.datePurchased || '';
    document.getElementById('sensor-collocation-input').value = s.collocationDates || '';
    openModal('modal-add-sensor');
}

// Annotation queue for sequential change popups
let pendingAnnotations = [];
let currentAnnotationSensorId = null;

function saveSensor(e) {
    e.preventDefault();
    const editId = document.getElementById('sensor-edit-id').value;
    const data = {
        id: document.getElementById('sensor-id-input').value.trim(),
        soaTagId: document.getElementById('sensor-soa-input').value.trim(),
        type: document.getElementById('sensor-type-input').value,
        status: getSelectedStatuses('sensor-status-input'),
        community: document.getElementById('sensor-community-input').value,
        location: document.getElementById('sensor-location-input').value.trim(),
        datePurchased: document.getElementById('sensor-purchased-input').value,
        collocationDates: document.getElementById('sensor-collocation-input').value.trim(),
    };

    if (editId) {
        const oldSensor = sensors.find(s => s.id === editId);
        if (!oldSensor) return;

        // Detect changes
        const fieldLabels = {
            soaTagId: 'SOA Tag ID', type: 'Type', status: 'Status',
            community: 'Community', location: 'Location',
            datePurchased: 'Purchase Date', collocationDates: 'Collocation Dates'
        };

        const changes = [];
        for (const [field, label] of Object.entries(fieldLabels)) {
            const oldVal = oldSensor[field];
            const newVal = data[field];
            // Compare arrays (status) as strings
            const oldStr = Array.isArray(oldVal) ? oldVal.join(', ') : (oldVal || '');
            const newStr = Array.isArray(newVal) ? newVal.join(', ') : (newVal || '');
            if (oldStr !== newStr) {
                let oldDisplay, newDisplay;
                if (field === 'community') {
                    oldDisplay = getCommunityName(oldVal);
                    newDisplay = getCommunityName(newVal);
                } else {
                    oldDisplay = oldStr || '(empty)';
                    newDisplay = newStr || '(empty)';
                }
                changes.push({ field, label, oldVal: oldDisplay, newVal: newDisplay, sensorId: editId });
            }
        }

        // Apply the data
        const idx = sensors.findIndex(s => s.id === editId);
        if (idx >= 0) sensors[idx] = data;
        trackRecent('sensors', data.id, 'edited');
        persist();
        closeModal('modal-add-sensor');
        renderSensors();

        // If there are changes, queue annotation popups (skip in setup mode)
        if (changes.length > 0 && !setupMode) {
            currentAnnotationSensorId = editId;
            pendingAnnotations = changes.map(c => ({
                sensorId: c.sensorId,
                summary: c.field === 'community'
                    ? `Moved from ${c.oldVal} to ${c.newVal}`
                    : `${c.label} changed from "${c.oldVal}" to "${c.newVal}"`,
                field: c.field,
                oldVal: c.oldVal,
                newVal: c.newVal,
                label: c.label,
            }));
            showNextAnnotation();
        }
    } else {
        if (sensors.find(s => s.id === data.id)) {
            alert('A sensor with that ID already exists.');
            return;
        }
        sensors.push(data);
        persist();
        closeModal('modal-add-sensor');
        renderSensors();
    }
}

function showNextAnnotation() {
    if (pendingAnnotations.length === 0) {
        currentAnnotationSensorId = null;
        if (currentSensor) showSensorView(currentSensor);
        return;
    }

    const next = pendingAnnotations[0];
    document.getElementById('edit-annotation-summary').innerHTML =
        `<strong>${next.sensorId}</strong>: ${next.summary}`;
    document.getElementById('edit-annotation-text').value = '';
    document.getElementById('edit-annotation-date').value = nowDatetime();
    openModal('modal-edit-annotation');
}

function buildAnnotationNote(annotation, additionalInfo, date) {
    const isMovement = annotation.field === 'community';
    const s = sensors.find(x => x.id === annotation.sensorId);

    let noteText;
    let noteType;
    let taggedCommunities;

    if (isMovement) {
        noteText = `${annotation.sensorId} removed from ${annotation.oldVal} and brought to ${annotation.newVal}.`;
        noteType = 'Movement';
        const oldId = COMMUNITIES.find(c => c.name === annotation.oldVal)?.id;
        const newId = COMMUNITIES.find(c => c.name === annotation.newVal)?.id;
        taggedCommunities = [oldId, newId].filter(Boolean);
    } else {
        noteText = `${annotation.sensorId} ${annotation.label.toLowerCase()} changed from "${annotation.oldVal}" to "${annotation.newVal}".`;
        noteType = 'Info Edit';
        taggedCommunities = s && s.community ? [s.community] : [];
    }

    return {
        id: 'n' + Date.now() + Math.random().toString(36).slice(2, 5),
        date: date || nowDatetime(),
        type: noteType,
        text: noteText,
        additionalInfo: additionalInfo || '',
        createdBy: getCurrentUserName(),
        taggedSensors: [annotation.sensorId],
        taggedCommunities: taggedCommunities,
        taggedContacts: additionalInfo ? parseMentionedContacts(additionalInfo) : [],
    };
}

function saveEditAnnotation() {
    const annotation = pendingAnnotations.shift();
    const additionalInfo = document.getElementById('edit-annotation-text').value.trim();
    const date = document.getElementById('edit-annotation-date').value || nowDatetime();

    notes.push(buildAnnotationNote(annotation, additionalInfo, date));
    persist();
    closeModal('modal-edit-annotation');

    setTimeout(() => showNextAnnotation(), 150);
}

function skipEditAnnotation() {
    const annotation = pendingAnnotations.shift();
    const date = document.getElementById('edit-annotation-date').value || nowDatetime();

    notes.push(buildAnnotationNote(annotation, '', date));
    persist();
    closeModal('modal-edit-annotation');

    setTimeout(() => showNextAnnotation(), 150);
}

// ===== INLINE STATUS CHANGE =====
function openStatusChangeModal(sensorId) {
    const s = sensors.find(x => x.id === sensorId);
    if (!s) return;
    document.getElementById('status-change-sensor-id').value = s.id;
    document.getElementById('status-change-old').value = JSON.stringify(getStatusArray(s));
    document.getElementById('status-change-sensor-label').textContent = s.id;
    renderStatusToggleList('status-change-new', getStatusArray(s));
    document.getElementById('status-change-info').value = '';
    document.getElementById('status-change-date').value = nowDatetime();
    openModal('modal-status-change');
}

function saveStatusChange(e) {
    e.preventDefault();
    const sensorId = document.getElementById('status-change-sensor-id').value;
    const oldStatuses = JSON.parse(document.getElementById('status-change-old').value);
    const newStatuses = getSelectedStatuses('status-change-new');
    const additionalInfo = document.getElementById('status-change-info').value.trim();
    const statusDate = document.getElementById('status-change-date').value || nowDatetime();

    const oldStr = oldStatuses.join(', ') || '(none)';
    const newStr = newStatuses.join(', ') || '(none)';

    if (oldStr === newStr) {
        closeModal('modal-status-change');
        return;
    }

    const s = sensors.find(x => x.id === sensorId);
    if (!s) return;

    s.status = newStatuses;

    let noteText = `${sensorId} status changed from "${oldStr}" to "${newStr}".`;

    const mentionedContacts = parseMentionedContacts(additionalInfo);

    const note = {
        id: 'n' + Date.now(),
        date: statusDate,
        type: 'Status Change',
        text: noteText,
        additionalInfo: additionalInfo || '',
        createdBy: getCurrentUserName(),
        taggedSensors: [sensorId],
        taggedCommunities: s.community ? [s.community] : [],
        taggedContacts: mentionedContacts,
    };

    if (!setupMode) notes.push(note);
    persist();
    closeModal('modal-status-change');
    renderSensors();
    if (currentSensor === sensorId) showSensorView(sensorId);
    if (currentCommunity) showCommunityView(currentCommunity);
}

// ===== MOVE SENSOR =====
function openMoveSensorModal(sensorId) {
    const s = sensors.find(x => x.id === sensorId);
    if (!s) return;
    document.getElementById('move-sensor-id').value = s.id;
    document.getElementById('move-sensor-label').textContent = s.id;
    document.getElementById('move-from-label').textContent = getCommunityName(s.community);
    document.getElementById('move-additional-info').value = '';
    document.getElementById('move-date').value = nowDatetime();
    populateCommunitySelect('move-to-community');
    openModal('modal-move-sensor');
}

function moveSensor(e) {
    e.preventDefault();
    const sensorId = document.getElementById('move-sensor-id').value;
    const toCommunityId = document.getElementById('move-to-community').value;
    const additionalInfo = document.getElementById('move-additional-info').value.trim();
    const moveDate = document.getElementById('move-date').value || nowDatetime();

    const s = sensors.find(x => x.id === sensorId);
    if (!s) return;

    const fromId = s.community;
    const fromName = getCommunityName(fromId);
    const toName = getCommunityName(toCommunityId);

    s.community = toCommunityId;

    let noteText = `${sensorId} removed from ${fromName} and brought to ${toName}.`;

    const mentionedContacts = parseMentionedContacts(additionalInfo);
    const taggedCommunities = [fromId, toCommunityId].filter(Boolean);

    const note = {
        id: 'n' + Date.now(),
        date: moveDate,
        type: 'Movement',
        text: noteText,
        additionalInfo: additionalInfo || '',
        createdBy: getCurrentUserName(),
        taggedSensors: [sensorId],
        taggedCommunities: taggedCommunities,
        taggedContacts: mentionedContacts,
    };

    if (!setupMode) notes.push(note);
    persist();
    closeModal('modal-move-sensor');
    renderSensors();
    if (currentCommunity) showCommunityView(currentCommunity);
}

// ===== SENSOR DETAIL =====
function showSensorDetail(sensorId) {
    const s = sensors.find(x => x.id === sensorId);
    if (!s) return;
    trackRecent('sensors', sensorId, 'viewed');
    openTab('sensor', sensorId, s.id);
    showSensorView(sensorId);
    saveLastView('sensor', sensorId);
}

function showSensorView(sensorId) {
    const s = sensors.find(x => x.id === sensorId);
    if (!s) return;
    currentSensor = sensorId;

    document.getElementById('sensor-detail-title').textContent = s.id;
    document.getElementById('sensor-info-card').innerHTML = `
        <div class="info-item"><label>Type</label><p class="editable-field" onclick="inlineEditSensorType('${s.id}')">${s.type}</p></div>
        <div class="info-item"><label>SOA Tag ID</label><p class="editable-field" onclick="inlineEditSensor('${s.id}', 'soaTagId')">${s.soaTagId || '—'}</p></div>
        <div class="info-item"><label>Status</label><p>${renderStatusBadges(s, true)}</p></div>
        <div class="info-item"><label>Community</label><p><span class="editable-field" onclick="openInlineCommunityChange('${s.id}')">${getCommunityName(s.community)}</span></p><a class="move-sensor-link" onclick="openMoveSensorModal('${s.id}')">Move Sensor &rarr;</a></div>
        <div class="info-item"><label>Location</label><p class="editable-field" onclick="inlineEditSensor('${s.id}', 'location')">${s.location || '—'}</p></div>
        <div class="info-item"><label>Purchase Date</label><p class="editable-field" onclick="inlineEditSensor('${s.id}', 'datePurchased')">${s.datePurchased || '—'}</p></div>
        <div class="info-item"><label>Collocation Dates</label><p class="editable-field" onclick="inlineEditSensor('${s.id}', 'collocationDates')">${s.collocationDates || '—'}</p></div>
    `;

    // Reset filter
    const filterEl = document.getElementById('sensor-history-filter');
    if (filterEl) filterEl.value = '';

    filterSensorHistory();

    resetTabs(document.getElementById('view-sensor-detail'));

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-sensor-detail').classList.add('active');
}

function inlineEditSensor(sensorId, field) {
    const s = sensors.find(x => x.id === sensorId);
    if (!s) return;

    const labels = { soaTagId: 'SOA Tag ID', location: 'Location', datePurchased: 'Purchase Date', collocationDates: 'Collocation Dates' };
    const label = labels[field] || field;
    const oldVal = s[field] || '';
    const newVal = prompt(`Edit ${label}:`, oldVal);
    if (newVal === null || newVal.trim() === oldVal) return;

    s[field] = newVal.trim();
    persist();
    showSensorView(sensorId);

    // Queue annotation for this change (skip in setup mode)
    if (!setupMode) {
        currentAnnotationSensorId = sensorId;
        pendingAnnotations = [{
            sensorId: sensorId,
            summary: `${label} changed from "${oldVal || '(empty)'}" to "${newVal.trim()}"`,
            field: field,
            oldVal: oldVal || '(empty)',
            newVal: newVal.trim(),
            label: label,
        }];
        showNextAnnotation();
    }
}

let typeChangeSensorId = null;

function inlineEditSensorType(sensorId) {
    const s = sensors.find(x => x.id === sensorId);
    if (!s) return;
    typeChangeSensorId = sensorId;

    document.getElementById('type-change-sensor-label').textContent = s.id;
    const list = document.getElementById('type-change-options');
    list.innerHTML = SENSOR_TYPES.map(t => {
        const isCurrent = s.type === t;
        return `<button class="type-option-btn ${isCurrent ? 'current' : ''}" onclick="selectSensorType('${t}')" ${isCurrent ? 'disabled' : ''}>
            <span class="type-option-name">${t}</span>
            ${isCurrent ? '<span class="type-option-current">Current</span>' : ''}
        </button>`;
    }).join('');

    openModal('modal-type-change');
}

function selectSensorType(newType) {
    const s = sensors.find(x => x.id === typeChangeSensorId);
    if (!s) return;

    const oldVal = s.type;
    if (newType === oldVal) return;

    s.type = newType;
    trackRecent('sensors', typeChangeSensorId, 'edited');
    persist();
    closeModal('modal-type-change');
    showSensorView(typeChangeSensorId);

    // Queue annotation (skip in setup mode)
    if (!setupMode) {
        currentAnnotationSensorId = typeChangeSensorId;
        pendingAnnotations = [{
            sensorId: typeChangeSensorId,
            summary: `Type changed from "${oldVal}" to "${newType}"`,
            field: 'type',
            oldVal: oldVal,
            newVal: newType,
            label: 'Type',
        }];
        showNextAnnotation();
    }
}

// ===== COMMUNITIES =====
function showCommunity(communityId) {
    const community = COMMUNITIES.find(c => c.id === communityId);
    if (!community) return;
    trackRecent('communities', communityId, 'viewed');
    openTab('community', communityId, community.name);
    showCommunityView(communityId);
    saveLastView('community', communityId);
}

function showCommunityView(communityId) {
    const community = COMMUNITIES.find(c => c.id === communityId);
    if (!community) return;
    currentCommunity = communityId;

    document.getElementById('community-name').textContent = community.name;
    const tags = getCommunityTags(communityId);
    const badgeContainer = document.getElementById('community-type-badge');
    badgeContainer.innerHTML = tags.map(t =>
        `<span class="community-type-badge clickable-badge" onclick="filterCommunitiesByTag('${t}')">${t}</span>`
    ).join(' ') +
    ` <span class="community-tag-edit" onclick="openEditCommunityTags('${communityId}')">+ Edit Tags</span>`;

    document.querySelectorAll('.community-list a').forEach(a => a.classList.remove('active'));

    // Sensors
    const commSensors = sensors.filter(s => s.community === communityId);
    document.getElementById('community-sensors-tbody').innerHTML = commSensors.map(s => `
        <tr>
            <td><span class="clickable" onclick="showSensorDetail('${s.id}')">${s.id}</span><br><small style="color:#888">${s.type}</small></td>
            <td>${s.soaTagId || '—'}</td>
            <td>${renderStatusBadges(s, true)}</td>
            <td>${s.location || '—'}</td>
            <td>${s.datePurchased || '—'}</td>
            <td>${s.collocationDates || '—'}</td>
            <td>
                <button class="btn btn-sm" onclick="openEditSensorModal('${s.id}')">Edit</button>
                <button class="btn btn-sm" onclick="openMoveSensorModal('${s.id}')">Move</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="7" class="empty-state">No sensors in this community.</td></tr>';

    // Contacts
    const commContacts = contacts.filter(c => c.community === communityId);
    document.getElementById('community-contacts-list').innerHTML = commContacts.map(c => `
        <div class="contact-card ${c.active === false ? 'inactive' : ''}" onclick="showContactDetail('${c.id}')">
            <h3>${c.name}${c.active === false ? '<span class="contact-inactive-badge">Inactive</span>' : ''}</h3>
            <div class="contact-role">${c.role || ''}</div>
            <div class="contact-detail">${c.org || ''}</div>
            <div class="contact-detail">${c.email ? `<a href="#" class="clickable" onclick="event.stopPropagation(); openQuickEmail('${c.id}')">${c.email}</a>` : ''}</div>
            <div class="contact-detail">${c.phone ? `<a href="tel:${c.phone}" class="clickable" onclick="event.stopPropagation()">${c.phone}</a>` : ''}</div>
        </div>
    `).join('') || '<div class="empty-state">No contacts for this community.</div>';

    // History
    const commNotes = notes.filter(n => n.taggedCommunities && n.taggedCommunities.includes(communityId));
    renderTimeline('community-history-timeline', commNotes);

    // Comms
    const commComms = comms.filter(c => c.community === communityId || (c.taggedCommunities && c.taggedCommunities.includes(communityId)));
    renderTimeline('community-comms-timeline', commComms.map(c => ({
        ...c,
        type: c.commType || c.type,
    })));

    // Files
    renderCommunityFiles(communityId);

    resetTabs(document.getElementById('view-community'));

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-community').classList.add('active');
}

// ===== FILES =====
function handleFileUpload(event) {
    const files = event.target.files;
    if (!files.length || !currentCommunity) return;

    if (!communityFiles[currentCommunity]) communityFiles[currentCommunity] = [];

    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            communityFiles[currentCommunity].push({
                id: 'f' + Date.now() + Math.random().toString(36).slice(2, 6),
                name: file.name,
                type: file.type,
                data: e.target.result,
                date: nowDatetime(),
            });
            persist();
            renderCommunityFiles(currentCommunity);
        };
        reader.readAsDataURL(file);
    }

    event.target.value = '';
}

function renderCommunityFiles(communityId) {
    const files = communityFiles[communityId] || [];
    const grid = document.getElementById('community-files-grid');

    if (!files.length) {
        grid.innerHTML = '<div class="empty-state">No files uploaded yet.</div>';
        return;
    }

    grid.innerHTML = files.map(f => {
        if (f.type && f.type.startsWith('image/')) {
            return `
                <div class="file-card">
                    <img src="${f.data}" alt="${f.name}" onclick="window.open('${f.data}', '_blank')">
                    <div class="file-info">
                        <div>
                            <div class="file-name">${f.name}</div>
                            <div class="file-date">${formatDate(f.date)}</div>
                        </div>
                        <button class="btn btn-sm btn-danger" onclick="deleteFile('${communityId}', '${f.id}')">Delete</button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="file-card">
                    <div class="file-card-pdf">
                        <div class="pdf-icon">&#128196;</div>
                        <div class="pdf-label">${f.name}</div>
                    </div>
                    <div class="file-info">
                        <div>
                            <div class="file-name">${f.name}</div>
                            <div class="file-date">${formatDate(f.date)}</div>
                        </div>
                        <div>
                            <a class="btn btn-sm" href="${f.data}" download="${f.name}">Download</a>
                            <button class="btn btn-sm btn-danger" onclick="deleteFile('${communityId}', '${f.id}')">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');
}

function deleteFile(communityId, fileId) {
    if (!confirm('Delete this file?')) return;
    communityFiles[communityId] = (communityFiles[communityId] || []).filter(f => f.id !== fileId);
    persist();
    renderCommunityFiles(communityId);
}

// ===== CONTACTS =====
function renderContacts() {
    const search = (document.getElementById('contact-search')?.value || '').toLowerCase();
    let filtered = contacts.filter(c => {
        if (search && !c.name.toLowerCase().includes(search) && !getCommunityName(c.community).toLowerCase().includes(search)) return false;
        return true;
    });

    // Group by community, sorted alphabetically
    const groups = {};
    filtered.forEach(c => {
        const commName = getCommunityName(c.community);
        if (!groups[commName]) groups[commName] = [];
        groups[commName].push(c);
    });

    // Sort community names alphabetically
    const sortedCommunities = Object.keys(groups).sort();

    // Sort contacts within each community alphabetically
    sortedCommunities.forEach(comm => {
        groups[comm].sort((a, b) => a.name.localeCompare(b.name));
    });

    const container = document.getElementById('contacts-grid');
    container.innerHTML = sortedCommunities.map(commName => `
        <div class="contacts-group">
            <div class="contacts-group-header">${commName}</div>
            <div class="contacts-grid">
                ${groups[commName].map(c => `
                    <div class="contact-card ${c.active === false ? 'inactive' : ''}" onclick="showContactDetail('${c.id}')">
                        <h3>${c.name}${c.active === false ? '<span class="contact-inactive-badge">Inactive</span>' : ''}</h3>
                        <div class="contact-role">${c.role || ''}</div>
                        <div class="contact-detail">${c.org || ''}</div>
                        <div class="contact-detail">${c.email ? `<a href="#" class="clickable" onclick="event.stopPropagation(); openQuickEmail('${c.id}')">${c.email}</a>` : ''}</div>
                        <div class="contact-detail">${c.phone ? `<a href="tel:${c.phone}" class="clickable" onclick="event.stopPropagation()">${c.phone}</a>` : ''}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('') || '<div class="empty-state">No contacts found.</div>';
}

function openAddContactModal() {
    document.getElementById('contact-modal-title').textContent = 'Add New Contact';
    document.getElementById('contact-form').reset();
    document.getElementById('contact-edit-id').value = '';
    document.getElementById('contact-active-yes').checked = true;
    document.getElementById('delete-contact-btn').style.display = 'none';
    populateCommunitySelect('contact-community-input');
    openModal('modal-add-contact');
}

function openAddContactForCommunity() {
    openAddContactModal();
    if (currentCommunity) {
        document.getElementById('contact-community-input').value = currentCommunity;
    }
}

function saveContact(e) {
    e.preventDefault();
    const editId = document.getElementById('contact-edit-id').value;
    const isActive = document.getElementById('contact-active-yes').checked;
    const data = {
        id: editId || 'c' + Date.now(),
        name: document.getElementById('contact-name-input').value.trim(),
        role: document.getElementById('contact-role-input').value.trim(),
        community: document.getElementById('contact-community-input').value,
        email: document.getElementById('contact-email-input').value.trim(),
        phone: document.getElementById('contact-phone-input').value.trim(),
        org: document.getElementById('contact-org-input').value.trim(),
        active: isActive,
    };

    let statusChanged = null; // 'deactivated' or 'reactivated' or null
    if (editId) {
        const old = contacts.find(c => c.id === editId);
        if (old) {
            const wasActive = old.active !== false;
            if (wasActive && !isActive) statusChanged = 'deactivated';
            else if (!wasActive && isActive) statusChanged = 'reactivated';
        }
        const idx = contacts.findIndex(c => c.id === editId);
        if (idx >= 0) contacts[idx] = data;
        trackRecent('contacts', data.id, 'edited');
    } else {
        contacts.push(data);
        trackRecent('contacts', data.id, 'edited');
    }

    persist();
    closeModal('modal-add-contact');
    renderContacts();

    // Refresh contact detail if viewing, and update tab label
    if (currentContact === data.id) {
        const tab = openTabs.find(t => t.id === getTabId('contact', data.id));
        if (tab) tab.label = data.name;
        renderOpenTabs();
        showContactView(data.id);
    }

    // Refresh community view if open (so new contact appears)
    if (currentCommunity) showCommunityView(currentCommunity);

    // If active status changed, prompt for notes (skip in setup mode)
    if (statusChanged && !setupMode) {
        pendingContactStatusNote = {
            contactId: data.id,
            contactName: data.name,
            community: data.community,
            action: statusChanged,
        };
        document.getElementById('contact-status-note-summary').innerHTML =
            `<strong>${data.name}</strong> marked as <strong>${statusChanged === 'deactivated' ? 'Inactive' : 'Active'}</strong>`;
        document.getElementById('contact-status-note-text').value = '';
        document.getElementById('contact-status-note-date').value = nowDatetime();
        openModal('modal-contact-status-note');
    }
}

let pendingContactStatusNote = null;

function saveContactStatusNote() {
    if (!pendingContactStatusNote) return;
    const p = pendingContactStatusNote;
    const additionalInfo = document.getElementById('contact-status-note-text').value.trim();
    const date = document.getElementById('contact-status-note-date').value || nowDatetime();

    const noteText = p.action === 'deactivated'
        ? `${p.contactName} marked as inactive.`
        : `${p.contactName} reactivated.`;

    const note = {
        id: 'n' + Date.now() + Math.random().toString(36).slice(2, 5),
        date: date,
        type: 'Info Edit',
        text: noteText,
        additionalInfo: additionalInfo,
        createdBy: getCurrentUserName(),
        taggedSensors: [],
        taggedCommunities: p.community ? [p.community] : [],
        taggedContacts: [p.contactId],
    };

    notes.push(note);
    persist();
    pendingContactStatusNote = null;
    closeModal('modal-contact-status-note');

    if (currentContact === p.contactId) showContactView(p.contactId);
    if (currentCommunity) showCommunityView(currentCommunity);
}

function skipContactStatusNote() {
    if (!pendingContactStatusNote) return;
    const p = pendingContactStatusNote;
    const date = document.getElementById('contact-status-note-date').value || nowDatetime();

    const noteText = p.action === 'deactivated'
        ? `${p.contactName} marked as inactive.`
        : `${p.contactName} reactivated.`;

    const note = {
        id: 'n' + Date.now() + Math.random().toString(36).slice(2, 5),
        date: date,
        type: 'Info Edit',
        text: noteText,
        createdBy: getCurrentUserName(),
        taggedSensors: [],
        taggedCommunities: p.community ? [p.community] : [],
        taggedContacts: [p.contactId],
    };

    notes.push(note);
    persist();
    pendingContactStatusNote = null;
    closeModal('modal-contact-status-note');

    if (currentContact === p.contactId) showContactView(p.contactId);
    if (currentCommunity) showCommunityView(currentCommunity);
}

function showContactDetail(contactId) {
    const c = contacts.find(x => x.id === contactId);
    if (!c) return;
    trackRecent('contacts', contactId, 'viewed');
    openTab('contact', contactId, c.name);
    saveLastView('contact', contactId);
    showContactView(contactId);
}

function showContactView(contactId) {
    const c = contacts.find(x => x.id === contactId);
    if (!c) return;
    currentContact = contactId;

    document.getElementById('contact-detail-name').innerHTML = c.name + (c.active === false ? '<span class="contact-inactive-badge" style="margin-left:10px;font-size:12px">Inactive</span>' : '');
    document.getElementById('contact-info-card').innerHTML = `
        <div class="info-item"><label>Role</label><p>${c.role || '—'}</p></div>
        <div class="info-item"><label>Community</label><p><span class="clickable" onclick="showCommunity('${c.community}')">${getCommunityName(c.community)}</span></p></div>
        <div class="info-item"><label>Organization</label><p>${c.org || '—'}</p></div>
        <div class="info-item"><label>Email</label><p>${c.email ? `<a href="#" class="clickable" onclick="openQuickEmail('${c.id}')">${c.email}</a>` : '—'}</p></div>
        <div class="info-item"><label>Phone</label><p>${c.phone ? `<a href="tel:${c.phone}" class="clickable">${c.phone}</a>` : '—'}</p></div>
        <div class="info-item"><label>Status</label><p>${c.active === false ? 'Inactive' : 'Active'}</p></div>
    `;

    // Combine notes and comms into one list
    const contactNotes = notes.filter(n => n.taggedContacts && n.taggedContacts.includes(contactId));
    const contactComms = comms.filter(cm => cm.taggedContacts && cm.taggedContacts.includes(contactId))
        .map(cm => ({ ...cm, type: cm.commType || cm.type }));
    const allItems = [...contactNotes, ...contactComms];
    renderTimeline('contact-all-timeline', allItems);

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-contact-detail').classList.add('active');
}

function openEditCurrentContact() {
    if (!currentContact) return;
    const c = contacts.find(x => x.id === currentContact);
    if (!c) return;
    document.getElementById('contact-modal-title').textContent = 'Edit Contact';
    document.getElementById('contact-edit-id').value = c.id;
    document.getElementById('contact-name-input').value = c.name;
    document.getElementById('contact-role-input').value = c.role || '';
    populateCommunitySelect('contact-community-input');
    document.getElementById('contact-community-input').value = c.community;
    document.getElementById('contact-email-input').value = c.email || '';
    document.getElementById('contact-phone-input').value = c.phone || '';
    document.getElementById('contact-org-input').value = c.org || '';
    // Set active/inactive
    if (c.active === false) {
        document.getElementById('contact-active-no').checked = true;
    } else {
        document.getElementById('contact-active-yes').checked = true;
    }
    // Show delete button
    document.getElementById('delete-contact-btn').style.display = '';
    openModal('modal-add-contact');
}

function deleteCurrentContact() {
    if (!currentContact) return;
    const c = contacts.find(x => x.id === currentContact);
    if (!c) return;
    if (!confirm(`Delete contact "${c.name}"? This cannot be undone.`)) return;

    contacts = contacts.filter(x => x.id !== currentContact);
    persist();
    closeModal('modal-add-contact');

    // Close the tab and go to contacts list
    const tabId = getTabId('contact', currentContact);
    const tabIdx = openTabs.findIndex(t => t.id === tabId);
    if (tabIdx >= 0) openTabs.splice(tabIdx, 1);
    activeTabId = null;
    renderOpenTabs();
    currentContact = null;
    showView('contacts');
}

function openContactCommModal() {
    if (!currentContact) return;
    const c = contacts.find(x => x.id === currentContact);
    if (!c) return;
    // Open the comm modal with the contact's community, and pre-fill the contact name
    document.getElementById('comm-form').reset();
    document.getElementById('comm-community-id').value = c.community;
    document.getElementById('comm-date-input').value = nowDatetime();
    document.getElementById('comm-contacts-input').value = c.name;
    openModal('modal-comm');
}

// ===== EMAIL COMPOSER =====
function openEmailModal() {
    populateCommunitySelect('email-community-filter');
    renderEmailRecipients();
    document.getElementById('email-subject').value = '';
    document.getElementById('email-body').value = '';
    openModal('modal-email');
}

function renderEmailRecipients() {
    const list = document.getElementById('email-recipients-list');

    // Group active contacts by community alphabetically
    const groups = {};
    contacts.filter(c => c.active !== false).forEach(c => {
        const commName = getCommunityName(c.community);
        if (!groups[commName]) groups[commName] = [];
        groups[commName].push(c);
    });

    const sortedCommunities = Object.keys(groups).sort();

    list.innerHTML = sortedCommunities.map(commName => {
        const groupContacts = groups[commName].sort((a, b) => a.name.localeCompare(b.name));
        return `
            <div class="email-community-header">${commName}</div>
            ${groupContacts.map(c => `
                <div class="email-recipient-row">
                    <input type="checkbox" id="email-cb-${c.id}" data-contact-id="${c.id}" data-community="${c.community}" checked>
                    <label for="email-cb-${c.id}">${c.name}</label>
                    <span class="recipient-community">${c.email || 'no email'}</span>
                </div>
            `).join('')}
        `;
    }).join('');
}

function emailSelectAll() {
    document.querySelectorAll('#email-recipients-list input[type="checkbox"]').forEach(cb => cb.checked = true);
}

function emailDeselectAll() {
    document.querySelectorAll('#email-recipients-list input[type="checkbox"]').forEach(cb => cb.checked = false);
}

function emailShowAll() {
    document.getElementById('email-community-filter').value = '';
    renderEmailRecipients();
    emailDeselectAll();
}

function emailFilterByCommunity() {
    const commId = document.getElementById('email-community-filter').value;
    if (!commId) {
        // Show all contacts, none checked
        renderEmailRecipients();
        emailDeselectAll();
        return;
    }

    // Show only active contacts from the selected community
    const filtered = contacts.filter(c => c.community === commId && c.active !== false);
    const list = document.getElementById('email-recipients-list');
    const commName = getCommunityName(commId);

    list.innerHTML = `
        <div class="email-community-header">${commName}</div>
        ${filtered.sort((a, b) => a.name.localeCompare(b.name)).map(c => `
            <div class="email-recipient-row">
                <input type="checkbox" id="email-cb-${c.id}" data-contact-id="${c.id}" data-community="${c.community}" checked>
                <label for="email-cb-${c.id}">${c.name}</label>
                <span class="recipient-community">${c.email || 'no email'}</span>
            </div>
        `).join('')}
    `;

    if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state">No contacts in this community.</div>';
    }
}

function sendEmail() {
    const subject = document.getElementById('email-subject').value.trim();
    const body = document.getElementById('email-body').value.trim();

    // Get checked contacts
    const checkedBoxes = document.querySelectorAll('#email-recipients-list input[type="checkbox"]:checked');
    const selectedContactIds = Array.from(checkedBoxes).map(cb => cb.dataset.contactId);
    const selectedContacts = selectedContactIds.map(id => contacts.find(c => c.id === id)).filter(Boolean);
    const emails = selectedContacts.map(c => c.email).filter(Boolean);

    if (emails.length === 0) {
        alert('No contacts with email addresses are selected.');
        return;
    }

    if (!subject || !body) {
        alert('Please enter both a subject and body before sending.');
        return;
    }

    // Open mailto link (works with Outlook and other mail clients)
    const mailtoLink = `mailto:${emails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    // Log the communication under each involved contact and community
    const involvedCommunities = [...new Set(selectedContacts.map(c => c.community))];

    const comm = {
        id: 'comm' + Date.now(),
        date: nowDatetime(),
        type: 'Communication',
        commType: 'Email',
        subject: subject,
        fullBody: body,
        text: `[Email] Subject: ${subject}`,
        createdBy: getCurrentUserName(),
        community: involvedCommunities[0] || '',
        taggedContacts: selectedContactIds,
        taggedCommunities: involvedCommunities,
    };

    comms.push(comm);
    persist();
    closeModal('modal-email');
}

function openQuickEmail(contactId) {
    const c = contacts.find(x => x.id === contactId);
    if (!c || !c.email) return;

    // Open the email modal with just this contact selected
    populateCommunitySelect('email-community-filter');

    // Render only this contact as a recipient
    const list = document.getElementById('email-recipients-list');
    list.innerHTML = `
        <div class="email-community-header">${getCommunityName(c.community)}</div>
        <div class="email-recipient-row">
            <input type="checkbox" id="email-cb-${c.id}" data-contact-id="${c.id}" data-community="${c.community}" checked>
            <label for="email-cb-${c.id}">${c.name}</label>
            <span class="recipient-community">${c.email}</span>
        </div>
    `;

    document.getElementById('email-subject').value = '';
    document.getElementById('email-body').value = '';
    document.getElementById('email-community-filter').value = c.community;
    openModal('modal-email');
}

// ===== NOTES =====
function openAddNoteModal(contextId, contextType) {
    document.getElementById('note-form').reset();
    document.getElementById('note-context-id').value = contextId;
    document.getElementById('note-context-type').value = contextType;
    document.getElementById('note-date-input').value = nowDatetime();

    // Clear all chip containers
    document.querySelectorAll('#modal-add-note .tag-chip').forEach(c => c.remove());

    // Pre-fill based on context
    if (contextType === 'community') {
        prefillChip('tag-communities-container', getCommunityName(contextId));
    } else if (contextType === 'sensor') {
        prefillChip('tag-sensors-container', contextId);
    }

    // Init tag chip inputs
    setupTagChipInput('tag-sensors-container',
        () => sensors,
        s => s.id
    );
    setupTagChipInput('tag-communities-container',
        () => COMMUNITIES,
        c => c.name
    );
    setupTagChipInput('tag-contacts-container',
        () => contacts,
        c => c.name
    );

    openModal('modal-add-note');
}

function saveNote(e) {
    e.preventDefault();

    const text = document.getElementById('note-text-input').value.trim();
    const type = document.getElementById('note-type-input').value;
    const noteDate = document.getElementById('note-date-input').value || nowDatetime();

    const sensorTags = getChipValues('tag-sensors-container');

    const communityTags = getChipValues('tag-communities-container')
        .map(name => {
            const c = COMMUNITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
            return c ? c.id : null;
        }).filter(Boolean);

    const contactTags = getChipValues('tag-contacts-container')
        .map(name => {
            const c = contacts.find(c => c.name.toLowerCase() === name.toLowerCase());
            return c ? c.id : null;
        }).filter(Boolean);

    // Also parse @mentions from the note text itself
    const textMentions = parseMentionedContacts(text);
    textMentions.forEach(id => {
        if (!contactTags.includes(id)) contactTags.push(id);
    });

    const note = {
        id: 'n' + Date.now(),
        date: noteDate,
        type: type,
        text: text,
        createdBy: getCurrentUserName(),
        taggedSensors: sensorTags,
        taggedCommunities: communityTags,
        taggedContacts: contactTags,
    };

    notes.push(note);
    persist();
    closeModal('modal-add-note');

    if (currentCommunity) showCommunityView(currentCommunity);
    if (currentSensor) showSensorView(currentSensor);
}

// ===== COMMUNICATIONS =====
function openCommModal(communityId) {
    document.getElementById('comm-form').reset();
    document.getElementById('comm-community-id').value = communityId;
    document.getElementById('comm-date-input').value = nowDatetime();
    openModal('modal-comm');
}

function saveComm(e) {
    e.preventDefault();

    const communityId = document.getElementById('comm-community-id').value;
    const commType = document.getElementById('comm-type-input').value;
    const commDate = document.getElementById('comm-date-input').value || nowDatetime();
    const text = document.getElementById('comm-text-input').value.trim();
    const contactNames = document.getElementById('comm-contacts-input').value
        .split(',').map(s => s.trim()).filter(Boolean);

    const taggedContacts = contactNames.map(name => {
        const c = contacts.find(c => c.name.toLowerCase() === name.toLowerCase());
        return c ? c.id : null;
    }).filter(Boolean);

    const comm = {
        id: 'comm' + Date.now(),
        date: commDate,
        type: 'Communication',
        commType: commType,
        text: `[${commType}] ${text}`,
        createdBy: getCurrentUserName(),
        community: communityId,
        taggedContacts: taggedContacts,
        taggedCommunities: [communityId],
    };

    comms.push(comm);
    persist();
    closeModal('modal-comm');

    if (currentCommunity) showCommunityView(currentCommunity);
}

// ===== TIMELINE RENDERER =====
function renderTimeline(containerId, items) {
    const container = document.getElementById(containerId);
    if (!items.length) {
        container.innerHTML = '<div class="empty-state">No history yet.</div>';
        return;
    }

    items.sort((a, b) => b.date.localeCompare(a.date));

    container.innerHTML = items.map(item => {
        const typeClass = getTimelineTypeClass(item.type);
        const tags = buildTagsHTML(item);
        const hasFullBody = item.fullBody;
        const expandable = hasFullBody ? `onclick="this.querySelector('.timeline-text-full').classList.toggle('open')" style="cursor:pointer"` : '';

        const additionalInfoHtml = item.additionalInfo
            ? `<div class="timeline-additional-info"><em>${highlightMentions(item.additionalInfo)}</em></div>`
            : '';

        const attribution = item.createdBy
            ? `<div class="timeline-attribution">Changed by ${item.createdBy}, ${formatDate(item.date)}</div>`
            : '';

        return `
            <div class="timeline-item ${typeClass}" ${expandable}>
                <div class="timeline-date">${formatDate(item.date)}</div>
                <div class="timeline-type">${item.commType || item.type}</div>
                <div class="timeline-text">${highlightMentions(item.text)}${hasFullBody ? ' <small style="color:#2563eb">(click to expand)</small>' : ''}</div>
                ${additionalInfoHtml}
                ${hasFullBody ? `<div class="timeline-text-full">${item.fullBody}</div>` : ''}
                ${attribution}
                ${tags ? `<div class="timeline-tags">${tags}</div>` : ''}
            </div>
        `;
    }).join('');
}

function getTimelineTypeClass(type) {
    const map = {
        'Audit': 'type-audit',
        'Movement': 'type-movement',
        'Issue': 'type-issue',
        'Communication': 'type-comm',
        'Status Change': 'type-status',
        'Info Edit': 'type-edit',
    };
    return map[type] || '';
}

function buildTagsHTML(item) {
    let tags = '';
    if (item.taggedSensors) {
        tags += item.taggedSensors.map(s =>
            `<span class="tag tag-sensor" onclick="event.stopPropagation(); showSensorDetail('${s}')">${s}</span>`
        ).join('');
    }
    if (item.taggedCommunities) {
        tags += item.taggedCommunities.map(c =>
            `<span class="tag tag-community" onclick="event.stopPropagation(); showCommunity('${c}')">${getCommunityName(c)}</span>`
        ).join('');
    }
    if (item.taggedContacts) {
        tags += item.taggedContacts.map(cId => {
            const contact = contacts.find(x => x.id === cId);
            return contact ? `<span class="tag tag-contact" onclick="event.stopPropagation(); showContactDetail('${cId}')">${contact.name}</span>` : '';
        }).join('');
    }
    return tags;
}

function highlightMentions(text) {
    return text.replace(/@([\w\s]+?)(?=\.|,|$|@)/g, '<strong style="color:#6c3483">@$1</strong>');
}

function nowDatetime() {
    const now = new Date();
    return now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + 'T' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    // Handle both "2026-03-14" and "2026-03-14T10:30" formats
    const hasTime = dateStr.includes('T') && dateStr.split('T')[1];
    let d;
    if (hasTime) {
        d = new Date(dateStr);
    } else {
        d = new Date(dateStr + 'T00:00:00');
    }
    const datePart = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    if (hasTime) {
        const timePart = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        return `${datePart} at ${timePart}`;
    }
    return datePart;
}

// ===== @ MENTION AUTOCOMPLETE =====
function setupMentionAutocomplete(textarea, dropdown) {
    let mentionStart = -1;

    textarea.addEventListener('input', function() {
        const val = this.value;
        const cursorPos = this.selectionStart;

        // Find the last @ before the cursor
        const beforeCursor = val.substring(0, cursorPos);
        const atIndex = beforeCursor.lastIndexOf('@');

        if (atIndex >= 0) {
            const afterAt = beforeCursor.substring(atIndex + 1);
            // Only show dropdown if no newline between @ and cursor
            if (!afterAt.includes('\n')) {
                mentionStart = atIndex;
                const query = afterAt.toLowerCase();
                const matches = contacts.filter(c =>
                    c.name.toLowerCase().includes(query)
                );

                if (matches.length > 0 && query.length > 0) {
                    dropdown.innerHTML = matches.map((c, i) =>
                        `<div class="mention-option${i === 0 ? ' selected' : ''}" data-name="${c.name}" data-community="${getCommunityName(c.community)}">
                            <span>${c.name}</span>
                            <span class="mention-community">${getCommunityName(c.community)}</span>
                        </div>`
                    ).join('');
                    dropdown.classList.add('visible');

                    dropdown.querySelectorAll('.mention-option').forEach(opt => {
                        opt.addEventListener('mousedown', function(e) {
                            e.preventDefault();
                            insertMention(textarea, dropdown, mentionStart, this.dataset.name);
                        });
                    });
                    return;
                }
            }
        }

        dropdown.classList.remove('visible');
    });

    textarea.addEventListener('keydown', function(e) {
        if (!dropdown.classList.contains('visible')) return;

        const options = dropdown.querySelectorAll('.mention-option');
        const selected = dropdown.querySelector('.mention-option.selected');
        let selectedIndex = Array.from(options).indexOf(selected);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedIndex < options.length - 1) {
                options[selectedIndex]?.classList.remove('selected');
                options[selectedIndex + 1]?.classList.add('selected');
                options[selectedIndex + 1]?.scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedIndex > 0) {
                options[selectedIndex]?.classList.remove('selected');
                options[selectedIndex - 1]?.classList.add('selected');
                options[selectedIndex - 1]?.scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (selected) {
                e.preventDefault();
                insertMention(textarea, dropdown, mentionStart, selected.dataset.name);
            }
        } else if (e.key === 'Escape') {
            dropdown.classList.remove('visible');
        }
    });

    textarea.addEventListener('blur', function() {
        setTimeout(() => dropdown.classList.remove('visible'), 200);
    });
}

function insertMention(textarea, dropdown, startPos, name) {
    const before = textarea.value.substring(0, startPos);
    const after = textarea.value.substring(textarea.selectionStart);
    textarea.value = before + '@' + name + ' ' + after;
    const newPos = startPos + name.length + 2;
    textarea.setSelectionRange(newPos, newPos);
    textarea.focus();
    dropdown.classList.remove('visible');
}

// ===== HELPER: Parse @mentions from text =====
function parseMentionedContacts(text) {
    const mentioned = [];
    const mentionRegex = /@([\w\s]+?)(?=\.|,|$|@)/g;
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
        const name = match[1].trim();
        const contact = contacts.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (contact && !mentioned.includes(contact.id)) mentioned.push(contact.id);
    }
    return mentioned;
}

// ===== ADD COMMUNITY =====
let newCommunitySelectedTags = [];

function openAddCommunityModal() {
    document.getElementById('community-name-input').value = '';
    newCommunitySelectedTags = [];
    renderNewCommunityTags();
    openModal('modal-add-community');
}

function renderNewCommunityTags() {
    const allTags = getAllTags();
    document.getElementById('new-community-tags').innerHTML = allTags.map(tag => {
        const isActive = newCommunitySelectedTags.includes(tag);
        return `<span class="edit-tag-option ${isActive ? 'active' : ''}" onclick="toggleNewCommunityTag('${tag.replace(/'/g, "\\'")}')">${tag}</span>`;
    }).join('');
}

function toggleNewCommunityTag(tag) {
    if (newCommunitySelectedTags.includes(tag)) {
        newCommunitySelectedTags = newCommunitySelectedTags.filter(t => t !== tag);
    } else {
        newCommunitySelectedTags.push(tag);
    }
    renderNewCommunityTags();
}

function saveCommunity(e) {
    e.preventDefault();
    const name = document.getElementById('community-name-input').value.trim();
    if (!name) return;

    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check for duplicates
    if (COMMUNITIES.find(c => c.id === id)) {
        alert('A community with that name already exists.');
        return;
    }

    // Add to communities list (sorted)
    COMMUNITIES.push({ id, name });
    COMMUNITIES.sort((a, b) => a.name.localeCompare(b.name));

    // Set tags if any selected
    if (newCommunitySelectedTags.length > 0) {
        communityTags[id] = [...newCommunitySelectedTags];
    }

    persist();
    buildSidebar();
    closeModal('modal-add-community');
    renderCommunitiesList();
    showCommunity(id);
}

// ===== COMMUNITY TAG EDITING =====
let editingTagsCommunity = null;

function openEditCommunityTags(communityId) {
    editingTagsCommunity = communityId;
    const community = COMMUNITIES.find(c => c.id === communityId);
    document.getElementById('edit-tags-community-name').textContent = community.name;
    document.getElementById('custom-tag-input').value = '';
    renderEditTagsList();
    openModal('modal-edit-community-tags');
}

function renderEditTagsList() {
    const current = getCommunityTags(editingTagsCommunity);
    // Combine available tags with any custom tags already on this community
    const allTags = [...new Set([...AVAILABLE_TAGS, ...current])];

    document.getElementById('edit-tags-list').innerHTML = allTags.map(tag => {
        const isActive = current.includes(tag);
        return `<span class="edit-tag-option ${isActive ? 'active' : ''}" onclick="toggleCommunityTag('${tag}')">${tag}</span>`;
    }).join('');
}

function toggleCommunityTag(tag) {
    if (!editingTagsCommunity) return;
    const current = getCommunityTags(editingTagsCommunity);
    const community = COMMUNITIES.find(c => c.id === editingTagsCommunity);

    if (current.includes(tag)) {
        // Remove tag
        communityTags[editingTagsCommunity] = current.filter(t => t !== tag);

        const note = {
            id: 'n' + Date.now() + Math.random().toString(36).slice(2, 5),
            date: nowDatetime(),
            type: 'Info Edit',
            text: `Tag "${tag}" removed from ${community.name}.`,
            createdBy: getCurrentUserName(),
            taggedSensors: [],
            taggedCommunities: [editingTagsCommunity],
            taggedContacts: [],
        };
        if (!setupMode) notes.push(note);
    } else {
        // Add tag
        if (!communityTags[editingTagsCommunity]) communityTags[editingTagsCommunity] = [];
        communityTags[editingTagsCommunity].push(tag);

        const note = {
            id: 'n' + Date.now() + Math.random().toString(36).slice(2, 5),
            date: nowDatetime(),
            type: 'Info Edit',
            text: `Tag "${tag}" added to ${community.name}.`,
            createdBy: getCurrentUserName(),
            taggedSensors: [],
            taggedCommunities: [editingTagsCommunity],
            taggedContacts: [],
        };
        if (!setupMode) notes.push(note);
    }

    trackRecent('communities', editingTagsCommunity, 'edited');
    persist();
    renderEditTagsList();
    buildSidebar(); // Update sidebar tag list
    // Refresh community view if it's showing
    if (currentCommunity === editingTagsCommunity) showCommunityView(editingTagsCommunity);
}

function addCustomTag() {
    const input = document.getElementById('custom-tag-input');
    const tag = input.value.trim();
    if (!tag || !editingTagsCommunity) return;

    // Add to AVAILABLE_TAGS if not already there
    if (!AVAILABLE_TAGS.includes(tag)) AVAILABLE_TAGS.push(tag);

    const current = getCommunityTags(editingTagsCommunity);
    if (!current.includes(tag)) {
        if (!communityTags[editingTagsCommunity]) communityTags[editingTagsCommunity] = [];
        communityTags[editingTagsCommunity].push(tag);

        const community = COMMUNITIES.find(c => c.id === editingTagsCommunity);
        const note = {
            id: 'n' + Date.now() + Math.random().toString(36).slice(2, 5),
            date: nowDatetime(),
            type: 'Info Edit',
            text: `Tag "${tag}" added to ${community.name}.`,
            createdBy: getCurrentUserName(),
            taggedSensors: [],
            taggedCommunities: [editingTagsCommunity],
            taggedContacts: [],
        };
        if (!setupMode) notes.push(note);
        persist();
    }

    input.value = '';
    renderEditTagsList();
    buildSidebar(); // Update sidebar with new tag
    if (currentCommunity === editingTagsCommunity) showCommunityView(editingTagsCommunity);
}

// ===== STATUS TOGGLE LIST =====
const ALL_STATUSES = [
    'Online', 'Offline', 'In Transit', 'Service at Quant', 'Collocation',
    'Auditing a Community', 'Lab Storage', 'Needs Repair', 'Ready for Deployment',
    'PM Sensor Issue', 'Gaseous Sensor Issue', 'SD Card Issue'
];

function renderStatusToggleList(containerId, selectedStatuses) {
    const container = document.getElementById(containerId);
    container.innerHTML = ALL_STATUSES.map(st => {
        const isActive = selectedStatuses.includes(st);
        const badgeClass = getStatusBadgeClass(st);
        return `<span class="status-toggle-option ${isActive ? 'active' : ''}" data-status="${st}" onclick="toggleStatusOption(this)">
            <span class="badge ${badgeClass}" style="pointer-events:none">${st}</span>
        </span>`;
    }).join('');
}

function toggleStatusOption(el) {
    el.classList.toggle('active');
}

function getSelectedStatuses(containerId) {
    const container = document.getElementById(containerId);
    return Array.from(container.querySelectorAll('.status-toggle-option.active')).map(el => el.dataset.status);
}

function filterSensorHistory() {
    if (!currentSensor) return;
    const filterVal = document.getElementById('sensor-history-filter')?.value || '';

    let sensorNotes = notes.filter(n => n.taggedSensors && n.taggedSensors.includes(currentSensor));

    if (filterVal) {
        sensorNotes = sensorNotes.filter(n => n.type === filterVal);
    }

    renderTimeline('sensor-history-timeline', sensorNotes);
}

// ===== INLINE COMMUNITY CHANGE (sensor detail) =====
function openInlineCommunityChange(sensorId) {
    // Reuse the move sensor modal
    openMoveSensorModal(sensorId);
}

// ===== TAG-CHIP INPUTS (Facebook Marketplace style) =====
function setupTagChipInput(containerId, getOptions, getLabel) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const chips = container.querySelector('.tag-chips');
    const input = container.querySelector('.tag-chip-input');
    const dropdown = container.querySelector('.tag-chip-dropdown');

    if (!input || !dropdown) return;

    input.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (query.length === 0) {
            dropdown.classList.remove('visible');
            return;
        }

        const currentTags = getChipValues(containerId);
        const options = getOptions().filter(opt =>
            getLabel(opt).toLowerCase().includes(query) &&
            !currentTags.includes(getLabel(opt))
        );

        if (options.length > 0) {
            dropdown.innerHTML = options.map((opt, i) =>
                `<div class="mention-option${i === 0 ? ' selected' : ''}" data-value="${getLabel(opt)}">
                    <span>${getLabel(opt)}</span>
                </div>`
            ).join('');
            dropdown.classList.add('visible');

            dropdown.querySelectorAll('.mention-option').forEach(opt => {
                opt.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    addChip(containerId, this.dataset.value);
                    input.value = '';
                    dropdown.classList.remove('visible');
                    input.focus();
                });
            });
        } else {
            dropdown.classList.remove('visible');
        }
    });

    input.addEventListener('keydown', function(e) {
        if (dropdown.classList.contains('visible')) {
            const options = dropdown.querySelectorAll('.mention-option');
            const selected = dropdown.querySelector('.mention-option.selected');
            let idx = Array.from(options).indexOf(selected);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (idx < options.length - 1) {
                    options[idx]?.classList.remove('selected');
                    options[idx + 1]?.classList.add('selected');
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (idx > 0) {
                    options[idx]?.classList.remove('selected');
                    options[idx - 1]?.classList.add('selected');
                }
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                if (selected) {
                    e.preventDefault();
                    addChip(containerId, selected.dataset.value);
                    input.value = '';
                    dropdown.classList.remove('visible');
                }
            } else if (e.key === 'Escape') {
                dropdown.classList.remove('visible');
            }
        }

        // Backspace to remove last chip
        if (e.key === 'Backspace' && input.value === '') {
            const lastChip = chips.querySelector('.tag-chip:last-of-type');
            if (lastChip) lastChip.remove();
        }
    });

    input.addEventListener('blur', function() {
        setTimeout(() => dropdown.classList.remove('visible'), 200);
    });
}

function addChip(containerId, value) {
    const container = document.getElementById(containerId);
    const chips = container.querySelector('.tag-chips');
    const input = container.querySelector('.tag-chip-input');

    // Don't add duplicates
    const existing = chips.querySelectorAll('.tag-chip');
    for (const chip of existing) {
        if (chip.dataset.value === value) return;
    }

    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.dataset.value = value;
    chip.innerHTML = `${value} <span class="tag-chip-remove" onclick="this.parentElement.remove()">&times;</span>`;
    chips.insertBefore(chip, input);
}

function getChipValues(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    return Array.from(container.querySelectorAll('.tag-chip')).map(c => c.dataset.value);
}

function prefillChip(containerId, value) {
    if (value) addChip(containerId, value);
}

// ===== TABS =====
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab')) {
        const tabId = e.target.dataset.tab;
        const container = e.target.closest('.view');

        container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');

        container.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        document.getElementById('tab-' + tabId).classList.add('active');
    }
});

function resetTabs(container) {
    const tabs = container.querySelectorAll('.tab');
    const contents = container.querySelectorAll('.tab-content');
    tabs.forEach((t, i) => t.classList.toggle('active', i === 0));
    contents.forEach((c, i) => c.classList.toggle('active', i === 0));
}

// ===== MODALS =====
function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });
});

// ===== HELPERS =====
function populateCommunitySelect(selectId) {
    const select = document.getElementById(selectId);
    const currentVal = select.value;
    select.innerHTML = '<option value="">— Select —</option>' +
        COMMUNITIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    if (currentVal) select.value = currentVal;
}

// ===== INIT =====
buildSidebar();

// Check if user is already logged in
const savedUser = loadData('currentUser', null);
if (savedUser) {
    loginUser(savedUser);
} else {
    showLoginScreen();
}

// Set up all mention autocomplete textareas
document.addEventListener('DOMContentLoaded', () => {
    const pairs = [
        ['note-text-input', 'note-mention-dropdown'],
        ['move-additional-info', 'move-mention-dropdown'],
        ['status-change-info', 'status-mention-dropdown'],
        ['comm-text-input', 'comm-mention-dropdown'],
    ];
    pairs.forEach(([textareaId, dropdownId]) => {
        const ta = document.getElementById(textareaId);
        const dd = document.getElementById(dropdownId);
        if (ta && dd) setupMentionAutocomplete(ta, dd);
    });
});

// Fallback: if DOMContentLoaded already fired
if (document.readyState !== 'loading') {
    const pairs = [
        ['note-text-input', 'note-mention-dropdown'],
        ['move-additional-info', 'move-mention-dropdown'],
        ['status-change-info', 'status-mention-dropdown'],
        ['comm-text-input', 'comm-mention-dropdown'],
    ];
    pairs.forEach(([textareaId, dropdownId]) => {
        const ta = document.getElementById(textareaId);
        const dd = document.getElementById(dropdownId);
        if (ta && dd) setupMentionAutocomplete(ta, dd);
    });
}
