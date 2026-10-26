/**
 * TeamPulse - Main Application Logic & Interactivity
 * 1:1 clone of teampulse.royalbengal.ai
 */

// Application State
const state = {
  currentRoute: 'dashboard',
  isDemoMode: false, // Default is false: exact 1:1 empty state matching screenshots
  
  // Dynamic collections
  employees: [],
  attendance: [],
  projects: [],
  announcements: [],
  teams: [],
  chatMessages: [],
  holidays: [],
  
  // Calendar state for October 2026 (matches screenshots)
  calendarYear: 2026,
  calendarMonth: 9 // 0-indexed: 9 = October
};

// Realistic mock data for "Demo Mode"
const demoDataset = {
  employees: [
    { id: 1, name: 'mr diu', email: 'kn766395@gmail.com', role: 'Owner', team: 'Management', status: 'Active' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@company.com', role: 'Team Lead', team: 'Engineering', status: 'Active' },
    { id: 3, name: 'Alex Rivera', email: 'alex.r@company.com', role: 'Member', team: 'Design', status: 'Active' },
    { id: 4, name: 'David Chen', email: 'd.chen@company.com', role: 'Member', team: 'Product', status: 'Active' }
  ],
  attendance: [
    { name: 'Sarah Jenkins', team: 'Engineering', status: 'Active', since: '09:02 AM' },
    { name: 'Alex Rivera', team: 'Design', status: 'On break', since: '12:45 PM' },
    { name: 'David Chen', team: 'Product', status: 'Active', since: '09:30 AM' }
  ],
  chatMessages: [
    { id: 1, author: 'System', text: 'Welcome to the #general channel for company-wide updates!', time: '09:00 AM' },
    { id: 2, author: 'Sarah Jenkins', text: 'Good morning everyone! Reminder that the Q4 sprint review is at 3 PM today.', time: '09:15 AM' }
  ],
  announcements: [
    { id: 1, title: 'Q4 Product Roadmap Kickoff', date: 'Oct 24, 2026', author: 'mr diu', body: 'We are thrilled to begin our Q4 goals today. Check the Projects board for details.' }
  ],
  teams: [
    { name: 'Engineering', lead: 'Sarah Jenkins', membersCount: 5, desc: 'Core platform and frontend systems.' },
    { name: 'Product & Design', lead: 'Alex Rivera', membersCount: 3, desc: 'UI/UX and design system architecture.' }
  ],
  audit: [
    { action: 'Team Created', target: 'Engineering', actor: 'mr diu', time: '2 days ago' },
    { action: 'Role Updated', target: 'Member permissions', actor: 'mr diu', time: 'Yesterday' }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initCalendar();
  initGlobalSearch();
  initDemoToggle();
});

// ROUTER SYSTEM
function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  
  // Initial route
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  navigateTo(hash);
  
  // Intercept nav clicks
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      navigateTo(page);
    });
  });
}

function navigateTo(pageId) {
  state.currentRoute = pageId;
  window.location.hash = pageId;
  
  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Show target page view
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(`view-${pageId}`);
  if (targetView) {
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function handleRoute() {
  const page = window.location.hash.replace('#', '') || 'dashboard';
  navigateTo(page);
}

// LOGOUT HANDLER
function handleLogout(e) {
  e.preventDefault();
  showToast('Logged out session. Refreshing demo...');
  setTimeout(() => {
    navigateTo('dashboard');
  }, 1000);
}

// CALENDAR COMPONENT (Matches Screenshot 1 - October 2026)
function initCalendar() {
  renderCalendar();
  
  const prevBtn = document.getElementById('calPrev');
  const nextBtn = document.getElementById('calNext');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      state.calendarMonth--;
      if (state.calendarMonth < 0) {
        state.calendarMonth = 11;
        state.calendarYear--;
      }
      renderCalendar();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      state.calendarMonth++;
      if (state.calendarMonth > 11) {
        state.calendarMonth = 0;
        state.calendarYear++;
      }
      renderCalendar();
    });
  }
}

function renderCalendar() {
  const grid = document.getElementById('calendarDaysGrid');
  const title = document.getElementById('calMonthTitle');
  if (!grid || !title) return;
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  title.textContent = `${monthNames[state.calendarMonth]} ${state.calendarYear}`;
  grid.innerHTML = '';
  
  // Calculate first day of month and total days
  const firstDayIndex = new Date(state.calendarYear, state.calendarMonth, 1).getDay();
  const daysInMonth = new Date(state.calendarYear, state.calendarMonth + 1, 0).getDate();
  
  // Empty offset cells
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'cal-cell empty';
    grid.appendChild(emptyCell);
  }
  
  // Render month days
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.className = 'cal-cell';
    cell.textContent = day;
    
    // Day of week (0 = Sun, 5 = Fri, 6 = Sat)
    const dayOfWeek = (firstDayIndex + day - 1) % 7;
    
    // Weekend highlight (FR and SA as in screenshot)
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      cell.classList.add('weekend');
    }
    
    // Day 26 October 2026 highlight (matches screenshot 1)
    if (state.calendarYear === 2026 && state.calendarMonth === 9 && day === 26) {
      cell.classList.add('today');
    }
    
    grid.appendChild(cell);
  }
}

// DEMO MODE TOGGLE (EMPTY STATE vs POPULATED DEMO)
function initDemoToggle() {
  const toggleBtn = document.getElementById('demoModeBtn');
  if (!toggleBtn) return;
  
  toggleBtn.addEventListener('click', () => {
    state.isDemoMode = !state.isDemoMode;
    
    const textSpan = toggleBtn.querySelector('.demo-text');
    if (state.isDemoMode) {
      toggleBtn.classList.add('active');
      textSpan.textContent = 'Demo Mode (Populated)';
      applyDemoModeData();
      showToast('Switched to Populated Demo Data');
    } else {
      toggleBtn.classList.remove('active');
      textSpan.textContent = 'Empty State (Exact)';
      resetToEmptyState();
      showToast('Restored exact 1:1 screenshot state');
    }
  });
}

function applyDemoModeData() {
  // Update Dashboard numbers
  document.getElementById('dashTotalEmployees').textContent = '4';
  document.getElementById('dashPresentToday').textContent = '3';
  document.getElementById('dashOnLeave').textContent = '1';
  document.getElementById('dashPendingApprovals').textContent = '2';
  
  // Update Dashboard boxes
  document.getElementById('dashWhosInBox').innerHTML = `
    <div style="text-align: left; padding: 4px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <strong>Sarah Jenkins</strong> <span class="tag tag-green">Present (09:02 AM)</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <strong>David Chen</strong> <span class="tag tag-green">Present (09:30 AM)</span>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <strong>Alex Rivera</strong> <span class="tag tag-amber">On Break</span>
      </div>
    </div>
  `;
  
  document.getElementById('dashPendingBox').innerHTML = `
    <div style="text-align: left; padding: 4px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span>Sarah Jenkins: Leave (Annual - 2 days)</span>
        <button class="btn btn-outline-sm" onclick="showToast('Leave approved')">Approve</button>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>David Chen: Bank Detail Change</span>
        <button class="btn btn-outline-sm" onclick="showToast('Bank details approved')">Approve</button>
      </div>
    </div>
  `;
  
  // Update Employees table
  const empTbody = document.getElementById('employeesTableBody');
  empTbody.innerHTML = demoDataset.employees.map(emp => `
    <tr>
      <td><strong>${emp.name}</strong><br><span style="font-size:12px; color:#64748b;">${emp.email}</span></td>
      <td>${emp.role}</td>
      <td>${emp.team}</td>
      <td><span class="badge badge-amber">${emp.status}</span></td>
      <td><button class="btn btn-outline-sm" onclick="showToast('Editing ${emp.name}')">Edit</button></td>
    </tr>
  `).join('');
  document.getElementById('employeesPageCount').textContent = 'Showing 1-4 of 4';
  
  // Update Attendance stats
  document.getElementById('attPresentNow').textContent = '2';
  document.getElementById('attOnBreak').textContent = '1';
  document.getElementById('attOnLeave').textContent = '1';
  document.getElementById('attOffline').textContent = '0';
  
  const whosInBody = document.getElementById('whosInTableBody');
  whosInBody.innerHTML = demoDataset.attendance.map(a => `
    <tr>
      <td><strong>${a.name}</strong></td>
      <td>${a.team}</td>
      <td><span class="tag ${a.status === 'Active' ? 'tag-green' : 'tag-amber'}">${a.status}</span></td>
      <td>${a.since}</td>
    </tr>
  `).join('');
  
  // Update Daily log
  document.getElementById('dailyLogTableBody').innerHTML = `
    <tr>
      <td>Today (Oct 26, 2026)</td>
      <td>09:00 AM</td>
      <td>--</td>
      <td>30 min</td>
      <td>4h 12m</td>
    </tr>
  `;
  
  // Update Projects Kanban
  document.getElementById('projectsEmptyState').classList.add('hidden');
  document.getElementById('projectsKanbanView').classList.remove('hidden');
  
  // Update Chat
  document.getElementById('chatEmptyMessage').classList.add('hidden');
  const chatList = document.getElementById('chatMessageList');
  chatList.innerHTML = demoDataset.chatMessages.map(msg => `
    <div class="chat-msg-row">
      <div class="chat-msg-avatar">${msg.author.substring(0, 2).toUpperCase()}</div>
      <div class="chat-msg-body">
        <div class="chat-msg-author">${msg.author} <span style="font-size:11px; color:#94a3b8; font-weight:normal; margin-left:6px;">${msg.time}</span></div>
        <div class="chat-msg-text">${msg.text}</div>
      </div>
    </div>
  `).join('');
  
  // Update Announcements
  document.getElementById('announcementsEmptyCard').classList.add('hidden');
  const annWrapper = document.getElementById('announcementsListWrapper');
  annWrapper.classList.remove('hidden');
  annWrapper.innerHTML = `
    <div class="card mt-3">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="font-size:15px; font-weight:600;">Q4 Product Roadmap Kickoff</h3>
        <span style="font-size:12px; color:#94a3b8;">Oct 24, 2026</span>
      </div>
      <p style="font-size:13.5px; color:#475569; margin-top:8px;">We are thrilled to begin our Q4 goals today. Check the Projects board for details.</p>
      <div style="font-size:12px; color:#64748b; margin-top:12px;">Posted by <strong>mr diu</strong></div>
    </div>
  `;
  
  // Update Analytics
  document.getElementById('anaAttendance').textContent = '94%';
  document.getElementById('anaOvertime').textContent = '12h';
  document.getElementById('anaLeaveDays').textContent = '2';
  document.getElementById('anaTasksCompleted').textContent = '18';
  document.getElementById('anaActiveProjects').textContent = '3';
  document.getElementById('anaTrendBox').innerHTML = `
    <div style="padding: 10px; color:#0f172a;">
      <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
        <span>Week 1 (Oct 1 - Oct 7)</span> <strong>92%</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
        <span>Week 2 (Oct 8 - Oct 14)</span> <strong>96%</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Week 3 (Oct 15 - Oct 21)</span> <strong>94%</strong>
      </div>
    </div>
  `;
}

function resetToEmptyState() {
  // Reset Dashboard
  document.getElementById('dashTotalEmployees').textContent = '0';
  document.getElementById('dashPresentToday').textContent = '0';
  document.getElementById('dashOnLeave').textContent = '0';
  document.getElementById('dashPendingApprovals').textContent = '0';
  document.getElementById('dashWhosInBox').textContent = 'No members yet.';
  document.getElementById('dashPendingBox').textContent = 'Nothing waiting for approval.';
  
  // Reset Employees
  document.getElementById('employeesTableBody').innerHTML = `
    <tr class="empty-row">
      <td colspan="5">No results</td>
    </tr>
  `;
  document.getElementById('employeesPageCount').textContent = 'Showing 0-0 of 0';
  
  // Reset Attendance
  document.getElementById('attPresentNow').textContent = '0';
  document.getElementById('attOnBreak').textContent = '0';
  document.getElementById('attOnLeave').textContent = '0';
  document.getElementById('attOffline').textContent = '0';
  document.getElementById('whosInTableBody').innerHTML = `
    <tr class="empty-row">
      <td colspan="4">No results</td>
    </tr>
  `;
  document.getElementById('dailyLogTableBody').innerHTML = `
    <tr class="empty-row">
      <td colspan="5">No sessions yet.</td>
    </tr>
  `;
  
  // Reset Projects
  document.getElementById('projectsEmptyState').classList.remove('hidden');
  document.getElementById('projectsKanbanView').classList.add('hidden');
  
  // Reset Chat
  document.getElementById('chatEmptyMessage').classList.remove('hidden');
  document.getElementById('chatMessageList').innerHTML = '';
  
  // Reset Announcements
  document.getElementById('announcementsEmptyCard').classList.remove('hidden');
  document.getElementById('announcementsListWrapper').classList.add('hidden');
  document.getElementById('announcementsListWrapper').innerHTML = '';
  
  // Reset Analytics
  document.getElementById('anaAttendance').textContent = '0%';
  document.getElementById('anaOvertime').textContent = '0h';
  document.getElementById('anaLeaveDays').textContent = '0';
  document.getElementById('anaTasksCompleted').textContent = '0';
  document.getElementById('anaActiveProjects').textContent = '0';
  document.getElementById('anaTrendBox').textContent = 'No attendance recorded in this range yet.';
}

// PROJECTS TABS
function switchProjectTab(tabKey, tabButton) {
  document.querySelectorAll('.tabs-nav .tab-link').forEach(btn => btn.classList.remove('active'));
  tabButton.classList.add('active');
  
  document.querySelectorAll('.project-tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const targetContent = document.getElementById(`project-tab-${tabKey}`);
  if (targetContent) {
    targetContent.classList.add('active');
  }
}

// CHAT MESSAGING
function handleSendChatMessage(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  
  const chatList = document.getElementById('chatMessageList');
  const emptyMsg = document.getElementById('chatEmptyMessage');
  if (emptyMsg) emptyMsg.classList.add('hidden');
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const msgRow = document.createElement('div');
  msgRow.className = 'chat-msg-row';
  msgRow.innerHTML = `
    <div class="chat-msg-avatar">MD</div>
    <div class="chat-msg-body">
      <div class="chat-msg-author">mr diu <span style="font-size:11px; color:#94a3b8; font-weight:normal; margin-left:6px;">${timeStr}</span></div>
      <div class="chat-msg-text">${escapeHtml(text)}</div>
    </div>
  `;
  
  chatList.appendChild(msgRow);
  input.value = '';
  
  // Scroll down
  const container = document.getElementById('chatMessagesContainer');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

// ROLES SELECTOR
function selectRole(roleName, cardElement) {
  document.querySelectorAll('.role-selector-card').forEach(c => c.classList.remove('active'));
  cardElement.classList.add('active');
  
  const banner = document.getElementById('roleNoticeBanner');
  const teamBadge = document.getElementById('teamPeopleBadge');
  
  if (roleName === 'Owner') {
    banner.textContent = 'Owner always has every permission. It cannot be renamed, changed or deleted.';
    teamBadge.textContent = 'Full access';
    document.querySelectorAll('.permissions-section-card input[type="checkbox"]').forEach(cb => {
      cb.checked = true;
      cb.disabled = true;
    });
  } else {
    banner.textContent = 'Custom role permissions can be tailored according to team duties.';
    teamBadge.textContent = 'Custom';
    document.querySelectorAll('.permissions-section-card input[type="checkbox"]').forEach((cb, idx) => {
      cb.disabled = false;
      cb.checked = idx % 2 === 0;
    });
  }
}

// ACCORDION (DAILY LOG)
function toggleDailyLog() {
  const content = document.getElementById('dailyLogContent');
  const chevron = document.getElementById('dailyLogChevron');
  
  if (content.style.display === 'none') {
    content.style.display = 'block';
    chevron.classList.remove('rotated');
  } else {
    content.style.display = 'none';
    chevron.classList.add('rotated');
  }
}

// TIME PILLS IN EMPLOYEE HISTORY
function selectTimePill(btn, label) {
  document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('historyRangeText').textContent = `Showing: ${label}`;
}

// WORKING DAY PILLS IN SETTINGS
function toggleDayPill(btn) {
  btn.classList.toggle('active');
}

// LEAVE CATEGORIES DYNAMIC MANAGEMENT
function addCategoryRow() {
  const list = document.getElementById('categoryInputsList');
  const row = document.createElement('div');
  row.className = 'category-row';
  row.innerHTML = `
    <input type="text" class="input-text" placeholder="Category name..." autofocus>
    <button class="btn-remove-category" onclick="removeCategory(this)">✕</button>
  `;
  list.appendChild(row);
}

function removeCategory(btn) {
  const row = btn.closest('.category-row');
  if (row) row.remove();
}

// HOLIDAYS ADDITION
function addHolidayDemo() {
  const nameInput = document.getElementById('holidayName');
  const name = nameInput.value.trim();
  if (!name) {
    showToast('Please enter a holiday name');
    return;
  }
  
  const from = document.getElementById('holidayFrom').value || 'Upcoming';
  const container = document.getElementById('holidaysListContainer');
  
  const item = document.createElement('div');
  item.style.cssText = 'padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-top:8px; display:flex; justify-content:space-between; align-items:center;';
  item.innerHTML = `
    <div><strong>${escapeHtml(name)}</strong> <span style="font-size:12px; color:#64748b; margin-left:8px;">${escapeHtml(from)}</span></div>
    <button style="border:none; background:none; color:#ef4444; cursor:pointer;" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(item);
  nameInput.value = '';
  showToast(`Holiday "${name}" added`);
}

// MODAL HANDLERS
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// Form Handlers
function handleInviteEmployee(e) {
  e.preventDefault();
  const name = document.getElementById('inviteName').value;
  const email = document.getElementById('inviteEmail').value;
  const role = document.getElementById('inviteRole').value;
  const team = document.getElementById('inviteTeam').value;
  
  closeModal('employeeModal');
  showToast(`Invitation sent to ${email}`);
  
  // Add to table
  const tbody = document.getElementById('employeesTableBody');
  const emptyRow = tbody.querySelector('.empty-row');
  if (emptyRow) emptyRow.remove();
  
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><strong>${escapeHtml(name)}</strong><br><span style="font-size:12px; color:#64748b;">${escapeHtml(email)}</span></td>
    <td>${escapeHtml(role)}</td>
    <td>${escapeHtml(team)}</td>
    <td><span class="badge badge-amber">Invited</span></td>
    <td><button class="btn btn-outline-sm" onclick="showToast('Employee actions')">Options</button></td>
  `;
  tbody.appendChild(tr);
  
  // Update dash total employees count
  const dashEmp = document.getElementById('dashTotalEmployees');
  dashEmp.textContent = parseInt(dashEmp.textContent || '0') + 1;
}

function handleCreateProject(e) {
  e.preventDefault();
  const name = document.getElementById('projectName').value;
  closeModal('projectModal');
  showToast(`Project "${name}" created!`);
  
  // Switch to kanban view
  document.getElementById('projectsEmptyState').classList.add('hidden');
  document.getElementById('projectsKanbanView').classList.remove('hidden');
}

function handlePostAnnouncement(e) {
  e.preventDefault();
  const title = document.getElementById('announcementTitle').value;
  const body = document.getElementById('announcementBody').value;
  closeModal('announcementModal');
  showToast('Announcement posted to all members');
  
  document.getElementById('announcementsEmptyCard').classList.add('hidden');
  const wrapper = document.getElementById('announcementsListWrapper');
  wrapper.classList.remove('hidden');
  
  const card = document.createElement('div');
  card.className = 'card mt-3';
  card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3 style="font-size:15px; font-weight:600;">${escapeHtml(title)}</h3>
      <span style="font-size:12px; color:#94a3b8;">Just now</span>
    </div>
    <p style="font-size:13.5px; color:#475569; margin-top:8px;">${escapeHtml(body)}</p>
    <div style="font-size:12px; color:#64748b; margin-top:12px;">Posted by <strong>mr diu</strong></div>
  `;
  wrapper.prepend(card);
}

function handleCreateTeam(e) {
  e.preventDefault();
  const name = document.getElementById('teamNameInput').value;
  closeModal('teamModal');
  showToast(`Team "${name}" created successfully`);
}

function handleCreateRole(e) {
  e.preventDefault();
  const name = document.getElementById('roleNameInput').value;
  closeModal('roleModal');
  showToast(`Role "${name}" created!`);
}

function exportCsvDemo() {
  showToast('Downloading employee_history_report.csv...');
}

// GLOBAL SEARCH
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;
  
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) return;
      
      const routes = [
        'dashboard', 'employees', 'attendance', 'leaves', 'projects',
        'chat', 'announcements', 'history', 'bank', 'teams', 'roles',
        'analytics', 'audit', 'settings', 'profile'
      ];
      
      const match = routes.find(r => r.includes(q));
      if (match) {
        navigateTo(match);
        showToast(`Jumped to ${match}`);
      } else {
        showToast(`Search for "${q}" completed`);
      }
    }
  });
}

// TOAST NOTIFICATIONS
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a16207" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${escapeHtml(message)}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// UTILITY
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
