# TeamPulse - Workforce & Attendance Management UI Clone

A 1:1, pixel-perfect, fully interactive clone of the **TeamPulse** web application (`teampulse.royalbengal.ai`), meticulously created from all 18 reference screenshots.

---

## 🚀 Features & Included Views

Every view from the screenshots has been accurately recreated with its identical layouts, typography, color palette, active states, and empty states:

1. **Dashboard (`#dashboard`)** (Screenshot 1)
   - 4 Metric KPI cards: Total employees, Present today, On leave, Pending approvals.
   - Interactive SVG heartbeat waveform for "Team pulse - This week's activity".
   - Split "Who's in today" and "Pending approvals" sections.
   - Interactive October 2026 mini-calendar with weekend and today (26th) highlights.
   - Announcements panel with "Post" and "View all" actions.

2. **Employees (`#employees`)** (Screenshot 2)
   - "0 of 1 members used on the Free plan" counter.
   - Search input, data table, and pagination controls.
   - Interactive `+ Invite employee` modal.

3. **Attendance (`#attendance`)** (Screenshot 3)
   - Live presence metrics: Present now, On break, On leave, Offline.
   - "Who's in right now" table and collapsible "Daily log" accordion.

4. **Leaves (`#leaves`)** (Screenshot 4)
   - "Pending approvals" and "On leave now" cards with policy guidance.

5. **Projects (`#projects`)** (Screenshot 5)
   - Tabs: `Boards`, `Requests`, `Activity log`, `Report`, `Labels`.
   - Empty state matching screenshot 5 with `+ New project` modal.
   - Populated Kanban board view in Demo Mode.

6. **Chat (`#chat`)** (Screenshot 6)
   - Sidebar channel list with `#general` company channel.
   - 30-day message retention disclaimer.
   - Live interactive message input bar and instant message sending.

7. **Announcements (`#announcements`)** (Screenshot 7)
   - Company-wide posts board with `+ Post announcement` modal and history log.

8. **Employee History (`#history`)** (Screenshot 8)
   - Multi-period filters: `Today`, `7 days`, `15 days`, `30 days`, `This month`.
   - Date range selector and Export CSV trigger.
   - 14-column responsive employee attendance & overtime table.

9. **Bank Approvals (`#bank`)** (Screenshot 9)
   - Sensitive financial change review empty-state screen.

10. **Teams (`#teams`)** (Screenshot 10)
    - Groups management with `+ New team` modal.

11. **Roles & Permissions (`#roles`)** (Screenshot 11)
    - Owner (Fixed, full access) vs. Member role selector cards.
    - Fine-grained permission checklist across Team & People, and Work.

12. **Analytics (`#analytics`)** (Screenshot 12)
    - 5 Key trend statistics (Avg attendance, Overtime, Leave days taken, Tasks completed, Active projects).
    - Attendance weekly trend, Leave usage breakdown, and Tasks by team.

13. **Activity Log (`#audit`)** (Screenshot 13)
    - Audit trail for admin actions.

14. **Company Settings (`#settings`)** (Screenshots 14, 15, 16)
    - Plan & billing tiers: Free ($0/mo), Starter ($4.99/mo), Growth ($9.99/mo), Scale ($14.99/mo).
    - Editable Leave categories (Annual, Sick, Casual, Unpaid) with add/delete actions.
    - Paid allowance settings, working day selectors (Sun–Thu), and timezone selector (`Asia/Dhaka (UTC+6)`).
    - Holiday schedule management form.

15. **Profile & Account (`#profile`)** (Screenshots 17, 18)
    - Avatar, user details form for `mr diu` (`kn766395@gmail.com`).
    - Bank details input fields.
    - 8 Customizable notification preference toggles.
    - Google account sign-in security notice.

---

## 🎛 State Switcher (Empty State vs Demo Data)

In the top header bar, you'll find a **Demo Toggle button**:
- **Empty State (Exact)**: Matches the screenshots 1:1 down to the exact 0 values, empty table states, and placeholders.
- **Demo Mode (Populated)**: Populates all tables, kanban boards, live chat conversations, and analytics trends with sample company data.

---

## 💻 Running Locally

The app is currently running at:
```
http://localhost:3000
```

To run or restart the server at any time:
```bash
python3 -m http.server 3000
```
or
```bash
npx serve -l 3000
```
