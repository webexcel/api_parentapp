# SchoolTree Parent Portal - React Project Plan

## Project Overview

- **Application**: SchoolTree Parent Portal (Web)
- **Scope**: Full Application (10 Pages)
- **Tech Stack**: React.js (Vite), JavaScript, Tailwind CSS, Axios, React Router, Context API

---

## Table of Contents

1. [Pages Overview](#pages-overview)
2. [Project Architecture](#step-1-project-architecture)
3. [Authentication Flow](#step-2-authentication-flow)
4. [Routing Plan](#step-3-routing-plan)
5. [API Integration](#step-4-api-integration)
6. [Page Compositions](#step-5-page-compositions)
7. [Development Execution Order](#step-6-development-execution-order)

---

## Pages Overview

| # | Page | Route | Description |
|---|------|-------|-------------|
| 1 | Login (OTP) | `/login` | Mobile + OTP verification |
| 2 | Dashboard | `/dashboard` | Overview with stats, activity, quick actions |
| 3 | Homework | `/homework` | Assignment list with status |
| 4 | Circulars | `/circulars` | Announcements with attachments |
| 5 | Fee Payment | `/fees` | Fee breakdown, payment methods |
| 6 | Payment Success | `/fees/success` | Transaction confirmation |
| 7 | Exam Schedule | `/exams` | Upcoming exams + timetable |
| 8 | View Marks | `/marks` | Report card, performance chart |
| 9 | Gallery | `/gallery` | Photo albums grid |
| 10 | Album View | `/gallery/:albumId` | Photos inside album |

---

## STEP 1: Project Architecture

### Folder Structure

```
src/
├── assets/                    # Static assets
│   ├── images/
│   └── icons/
│
├── components/                # Reusable UI components
│   ├── common/                # Generic components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Loader.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Avatar.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   ├── Tabs.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Pagination.jsx
│   │   ├── AudioPlayer.jsx
│   │   └── index.js
│   │
│   └── layout/                # Layout components
│       ├── Sidebar.jsx
│       ├── Header.jsx
│       ├── StudentSwitcher.jsx
│       └── index.js
│
├── context/                   # React Context providers
│   └── AuthContext.jsx
│
├── hooks/                     # Custom React hooks
│   ├── useAuth.js
│   └── useFetch.js
│
├── layouts/                   # Page layout wrappers
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
│
├── pages/                     # Page components
│   ├── Login/
│   │   ├── Login.jsx
│   │   └── index.js
│   │
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── index.js
│   │   └── components/
│   │       ├── StatsCard.jsx
│   │       ├── RecentActivity.jsx
│   │       ├── QuickActions.jsx
│   │       ├── UpNext.jsx
│   │       └── index.js
│   │
│   ├── Homework/
│   │   ├── Homework.jsx
│   │   ├── index.js
│   │   └── components/
│   │       ├── HomeworkCard.jsx
│   │       ├── HomeworkFilters.jsx
│   │       └── index.js
│   │
│   ├── Circulars/
│   │   ├── Circulars.jsx
│   │   ├── index.js
│   │   └── components/
│   │       ├── CircularCard.jsx
│   │       ├── CircularAudioPlayer.jsx
│   │       └── index.js
│   │
│   ├── Fees/
│   │   ├── FeePayment.jsx
│   │   ├── PaymentSuccess.jsx
│   │   ├── index.js
│   │   └── components/
│   │       ├── FeeBreakdown.jsx
│   │       ├── PaymentMethods.jsx
│   │       ├── PaymentSummary.jsx
│   │       ├── FeeHistory.jsx
│   │       └── index.js
│   │
│   ├── Exams/
│   │   ├── ExamSchedule.jsx
│   │   ├── index.js
│   │   └── components/
│   │       ├── UpcomingExamCard.jsx
│   │       ├── ExamTimetable.jsx
│   │       └── index.js
│   │
│   ├── Marks/
│   │   ├── ViewMarks.jsx
│   │   ├── index.js
│   │   └── components/
│   │       ├── ReportCard.jsx
│   │       ├── PerformanceChart.jsx
│   │       ├── SubjectBreakdown.jsx
│   │       └── index.js
│   │
│   ├── Gallery/
│   │   ├── Gallery.jsx
│   │   ├── AlbumView.jsx
│   │   ├── index.js
│   │   └── components/
│   │       ├── AlbumCard.jsx
│   │       ├── PhotoGrid.jsx
│   │       └── index.js
│   │
│   └── NotFound/
│       └── NotFound.jsx
│
├── routes/                    # Routing configuration
│   ├── ProtectedRoute.jsx
│   ├── PublicRoute.jsx
│   └── AppRoutes.jsx
│
├── services/                  # API layer
│   ├── api.js
│   ├── authService.js
│   ├── dashboardService.js
│   ├── homeworkService.js
│   ├── circularService.js
│   ├── feeService.js
│   ├── examService.js
│   ├── marksService.js
│   └── galleryService.js
│
├── utils/                     # Helper functions
│   ├── storage.js
│   ├── formatters.js
│   └── constants.js
│
├── App.jsx
├── main.jsx
└── index.css
```

### Component Classification

| Type | Components | Purpose |
|------|------------|---------|
| **Page Components** | Login, Dashboard, Homework, Circulars, FeePayment, PaymentSuccess, ExamSchedule, ViewMarks, Gallery, AlbumView, NotFound | Route targets |
| **Layout Components** | AuthLayout, DashboardLayout | Page wrappers |
| **Common Components** | Button, Input, Loader, Card, Badge, Avatar, Modal, Table, Tabs, SearchBar, Pagination, AudioPlayer | Reusable UI |
| **Layout Parts** | Sidebar, Header, StudentSwitcher | Dashboard structure |

---

## STEP 2: Authentication Flow

### Login Page UI (Single Page Design)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Alpha Portal                                    [Help Center]      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                         🔐                                          │
│                    Welcome Back                                     │
│         Please verify your identity to access the                   │
│                   school dashboard.                                 │
│                                                                     │
│    Mobile Number                                                    │
│    ┌─────────────────────────────────────────┬──────────┐          │
│    │  📱  (555) 000-0000                     │ GET OTP  │          │
│    └─────────────────────────────────────────┴──────────┘          │
│                           ●                                         │
│    Enter Verification Code                          ⏱ 00:30        │
│    ┌─────────────────────────────────────────────────────┐         │
│    │  ⌨️   _  _  _  _  _  _                              │         │
│    └─────────────────────────────────────────────────────┘         │
│    Code sent to mobile ending in **89          Resend Code         │
│                                                                     │
│    ┌─────────────────────────────────────────────────────┐         │
│    │              Secure Login  →                        │         │
│    └─────────────────────────────────────────────────────┘         │
│                                                                     │
│              Login with Password instead                            │
│                                                                     │
│    By logging in, you agree to Alpha Portal's Terms of Service     │
│                      and Privacy Policy.                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Authentication API Flow

```
    STEP 1: Send OTP
    ────────────────
    POST /api/auth/mobileInstallsNew

    Request:
    {
      "mobile_no": "9600037999",
      "platform_type": "Web",
      "manufacturer_name": "Browser",
      "manufacturer_model": "Chrome",
      "os_version": "1.0",
      "app_version_code": "1.0.0",
      "dbname": "cresent"
    }

    Response:
    { "success": true, "id": "11T.W06E1E" }


    STEP 2: Verify OTP
    ──────────────────
    POST /api/auth/mobileInstallerVerify

    Request:
    {
      "id": "11T.W06E1E",
      "otp": "1234",
      "dbname": "cresent"
    }

    Response:
    { "success": true, "token": "eyJ...", "user": {...} }


    STEP 3: Get Student Details (Post-Login)
    ─────────────────────────────────────────
    POST /api/auth/getMobStudentDetail

    Request:
    { "id": "11T.W06E1E" }

    Response:
    { "students": [{...}, {...}] }
```

### Login Page States

```
    STATE 1: Initial                    STATE 2: OTP Sent
    ════════════════                    ═════════════════

    • Phone input enabled               • Phone input disabled
    • GET OTP button active             • GET OTP shows "Sent ✓"
    • OTP field disabled                • OTP field enabled
    • Timer hidden                      • Timer counting (00:30)
    • Secure Login disabled             • Secure Login enabled
                                        • Resend Code clickable after timer
```

### AuthContext Design

```javascript
// State
{
  user: object | null,
  token: string | null,
  installId: string | null,
  students: array,
  selectedStudent: object | null,
  isAuthenticated: boolean,
  loading: boolean
}

// Actions
- sendOtp(mobile_no)       // Returns install_id
- verifyOtp(otp)           // Uses stored install_id
- logout()
- checkAuth()              // On app load
- switchStudent(student)   // Change active student
```

### localStorage Structure

```
localStorage:
├── auth_token        → "eyJhbGciOiJIUzI1NiIs..."
├── install_id        → "11T.W06E1E"
├── user              → '{"mobile_no": "9600037999", ...}'
├── students          → '[{...}, {...}]'
└── selected_student  → '{...}'
```

---

## STEP 3: Routing Plan

### Route Configuration

| Route | Component | Layout | Guard | Description |
|-------|-----------|--------|-------|-------------|
| `/` | — | — | — | Redirect to `/login` |
| `/login` | `Login` | `AuthLayout` | `PublicRoute` | OTP Login |
| `/dashboard` | `Dashboard` | `DashboardLayout` | `ProtectedRoute` | Main dashboard |
| `/homework` | `Homework` | `DashboardLayout` | `ProtectedRoute` | Assignments |
| `/circulars` | `Circulars` | `DashboardLayout` | `ProtectedRoute` | Announcements |
| `/fees` | `FeePayment` | `DashboardLayout` | `ProtectedRoute` | Fee payment |
| `/fees/success` | `PaymentSuccess` | `DashboardLayout` | `ProtectedRoute` | Payment confirmation |
| `/exams` | `ExamSchedule` | `DashboardLayout` | `ProtectedRoute` | Exam schedule |
| `/marks` | `ViewMarks` | `DashboardLayout` | `ProtectedRoute` | Report card |
| `/gallery` | `Gallery` | `DashboardLayout` | `ProtectedRoute` | Photo albums |
| `/gallery/:albumId` | `AlbumView` | `DashboardLayout` | `ProtectedRoute` | Album photos |
| `*` | `NotFound` | — | — | 404 page |

### Sidebar Navigation

```
STUDENTS
├── Pranav OG (Class IV-C)      ◀── Clickable to switch
└── Arivumathi V (Class I-A)

MENU
├── Dashboard                    → /dashboard
├── Homework                     → /homework
├── Circulars                    → /circulars
├── Academics                    → /marks
├── Fee Payment                  → /fees
├── Exam Schedule                → /exams
├── Gallery                      → /gallery
├── Settings                     → /settings (future)
│
└── Sign Out                     → logout()
```

---

## STEP 4: API Integration

### Service Layer Organization

```
services/
├── api.js                 # Axios instance + interceptors
├── authService.js         # Authentication APIs
├── dashboardService.js    # Dashboard APIs
├── homeworkService.js     # Homework APIs
├── circularService.js     # Circulars APIs
├── feeService.js          # Fee & Payment APIs
├── examService.js         # Exam Schedule APIs
├── marksService.js        # Report Card APIs
└── galleryService.js      # Gallery APIs
```

### API Endpoints by Service

#### authService.js
| Function | Method | Endpoint |
|----------|--------|----------|
| `sendOtp(mobile_no)` | POST | `/auth/mobileInstallsNew` |
| `verifyOtp(id, otp)` | POST | `/auth/mobileInstallerVerify` |
| `getStudentDetails(id)` | POST | `/auth/getMobStudentDetail` |
| `getStudentPhoto(adno)` | POST | `/auth/getMobStudentPhoto` |

#### dashboardService.js
| Function | Method | Endpoint |
|----------|--------|----------|
| `getLatestMessage(mobile_number)` | POST | `/dashboard/getLatestMessage` |
| `getLatestMessageWebsite()` | GET | `/dashboard/getLatestMessageWebsite` |
| `getFlashMessage()` | GET | `/dashboard/getFlashMessage` |
| `checkFeesBalance(adno)` | POST | `/dashboard/checkFeesBalance` |
| `getBatchCount(adno)` | POST | `/dashboard/batchCount` |
| `getAttendance(adno, month, year)` | POST | `/attendance/getAttendance` |

**getBatchCount Response:**
```json
{
    "data": [
        { "label": "circulars", "count": 0 },
        { "label": "attendance", "count": "100.00", "status": "No Data" },
        { "label": "homework", "count": 0 },
        { "label": "payment_due", "count": 7025, "payment_status": "Payment Due" }
    ]
}
```

**getLatestMessageWebsite Response (Flash Messages Queue):**
```json
{
    "data": [
        { "nid": 3, "links": "https://...", "Discription": "Message text", "show_flag": "0" }
    ]
}
```

#### homeworkService.js
| Function | Method | Endpoint |
|----------|--------|----------|
| `getHomework(classid, adno)` | POST | `/homework/getSaveHomeworkByClass` |

**getHomework Response:**
```json
{
    "data": [
        {
            "MSG_ID": 364,
            "CLASS": "VI-A",
            "MESSAGE": "Description text",
            "MSG_DATE": "2026-01-07T18:30:00.000Z",
            "subject": "BIOLOGY",
            "event_image": "[\"url1\",\"url2\"]" // JSON array string OR single URL
        }
    ]
}
```
Note: `event_image` can contain audio (.wav, .mp3), images, documents (.xlsx, .pdf, .docx)

#### circularService.js
| Function | Method | Endpoint |
|----------|--------|----------|
| `getCirculars(mobile_number, page_size, current_size)` | POST | `/circular/getAllMessagesByMobileNumber` |
| `getBase64Image(url)` | POST | `/circular/getBase64` |

**getCirculars Response:**
```json
{
    "data": [
        {
            "ADNO": "9230",
            "SMSdate": "07,Jan-13:53",
            "STUDENTNAME": "AASHIKA A",
            "Message": "Circular message text",
            "event_image": null | "https://..."
        }
    ],
    "total_size": 211
}
```

#### feeService.js
| Function | Method | Endpoint |
|----------|--------|----------|
| `getPayEnable(adno)` | POST | `/payments/getPayEnable` |
| `getFeeInstallment(adno)` | POST | `/payments/getFeeInstallment` |
| `getPaymentHistory(adno, classId)` | POST | `/payments/getStudentPayHistory` |
| `getPrintBill(data)` | POST | `/payments/getPrintBill` |
| `payOnline(data)` | POST | `/payments/payOnline` |
| `updateOrderId(data)` | POST | `/payments/updateOrderId` |

#### examService.js
| Function | Method | Endpoint |
|----------|--------|----------|
| `getExamSchedule(adno)` | POST | `/examSchedule/getParentExamSchedule` |

#### marksService.js
| Function | Method | Endpoint |
|----------|--------|----------|
| `getAnnualReportCard(adno)` | POST | `/reportCard/getAnnualReportcard` |
| `getTermReportCard(adno, term)` | POST | `/reportCard/getTermReportcardAdno` |
| `getTermTypes()` | GET | `/reportCard/getTermType` |
| `getExamNames(classId)` | POST | `/reportCard/selectExamName` |

#### galleryService.js
| Function | Method | Endpoint |
|----------|--------|----------|
| `getEvents()` | POST | `/newsevents/getMobileEvents` |
| `getVideoUploads(classId)` | POST | `/parentMessage/getVideoUploads` |

### Axios Configuration

```javascript
// Base Config
{
  baseURL: VITE_API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" }
}

// Request Interceptor
- Add Authorization header (Bearer token)
- Auto-inject dbname to request body/params

// Response Interceptor
- 2xx: Return response.data
- 401: Clear storage → Redirect to /login
- 400: Return error message
- 500: Show toast "Server error"
- Network Error: Show toast "Network error"
```

---

## STEP 5: Page Compositions

### 1. Dashboard Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  Welcome back, Parent                                               │
│  Here is what's happening with your children today.                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │Attendance│ │ Homework │ │ Circulars│ │ Holiday  │               │
│  │   95%    │ │ 1 Pending│ │  2 New   │ │  Friday  │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│  │      Recent Activity        │  │       Quick Actions         │  │
│  │  • Homework Assigned        │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐│  │
│  │  • Sports Day Registration  │  │  │Card│ │Fees│ │Cal │ │Bus ││  │
│  │  • Fees Due Reminder        │  │  └────┘ └────┘ └────┘ └────┘│  │
│  └─────────────────────────────┘  └─────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                        Up Next                               │   │
│  │  📘 Mathematics  11:00 AM - 12:00 PM                        │   │
│  │  🔬 Science Lab  01:00 PM - 02:00 PM                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Components:
- StatsCard.jsx (Attendance, Homework, Circulars, Holiday)
- RecentActivity.jsx (Activity list)
- QuickActions.jsx (Action buttons grid)
- UpNext.jsx (Upcoming schedule)
```

### 2. Homework Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  Homework Assignments                                    🔍 🔔 👤   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔍 Search subject or topic...      [Pranav OG] [Arivumathi V]     │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📐 Math • Mr. Anderson                      ⚠ Due Tomorrow │   │
│  │  Algebra Basics - Worksheet 4                               │   │
│  │  Complete problems 1-20 on page 42.              View Details│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🔬 Science • Mrs. Frizzle                      Due Oct 15  │   │
│  │  Volcano Project                                            │   │
│  │  Build a working model volcano...                View Details│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📖 English • Mr. Keating                   🔴 Overdue      │   │
│  │  Reading Log - Chapter 3                                    │   │
│  │  Submit summary of Chapter 3...               Submit Late   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🎨 Art • Ms. Kahlo                         ✓ Submitted     │   │
│  │  Color Theory Quiz                                          │   │
│  │  Online quiz about primary and secondary...         Review  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                    Showing 5 of 12 assignments                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Components:
- HomeworkFilters.jsx (Search + Student tabs)
- HomeworkCard.jsx (Assignment card with status badge)
```

### 3. Circulars Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  Circulars & Announcements                               🔍 🔔 👤   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔍 Search circulars...                                            │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📌 For: Pranav OG (Class IV-C)                              │   │
│  │                                                              │   │
│  │  Annual Sports Day Guidelines                    Oct 24, 2025│   │
│  │  Please find attached the detailed guidelines...             │   │
│  │                                                              │   │
│  │  📎 Sports_Day_2024.pdf                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📌 For: Arivumathi V (Class I-A)                            │   │
│  │                                                              │   │
│  │  Principal's Welcome Note                        Oct 20, 2025│   │
│  │  A special welcome message from our Principal...             │   │
│  │                                                              │   │
│  │  🔊 ▶ ━━━━━━━━━━━○━━━━━━━ 1:45                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📌 For: Pranav OG (Class IV-C)                              │   │
│  │                                                              │   │
│  │  Science Exhibition Highlights                   Oct 18, 2025│   │
│  │  We are thrilled to share some glimpses...                   │   │
│  │                                                              │   │
│  │  🖼️ [Image] [Image] [Image]                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Components:
- CircularCard.jsx (Announcement with attachments)
- CircularAudioPlayer.jsx (Audio message player)
```

### 4. Fee Payment Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  Fee Payment                                            🔒 Secure   │
│  Academic Session 2023-2024                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │TOTAL OUTSTANDING│ │  DUE DATE    │  │LAST PAYMENT  │              │
│  │   $350.00    📋│ │ Oct 15, 2023 │  │  Success ✓   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  Fee Breakdown                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ☑ Description              Term           Amount           │   │
│  │  ☑ Transport Fee            Term 2         $250.00          │   │
│  │  ☑ Lab Charges              Term 2         $100.00          │   │
│  │                                                              │   │
│  │                        Total Payable:      $350.00          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Payment Method                      Payment Summary                │
│  ┌────────┐ ┌────────┐ ┌────────┐   ┌─────────────────────────┐   │
│  │💳 Card │ │🏦 Bank │ │📱 UPI  │   │ Subtotal       $350.00 │   │
│  │   ✓    │ │        │ │        │   │ Processing Fee   $0.00 │   │
│  └────────┘ └────────┘ └────────┘   │                        │   │
│                                      │ Total         $350.00 │   │
│                                      │                        │   │
│                                      │    [ Pay Now → ]       │   │
│                                      │ 🔒 Encrypted & Secure  │   │
│                                      └─────────────────────────┘   │
│                                                                     │
│  Fee Paid History                                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Date        Description           Amount      Status       │   │
│  │  Oct 01      Tuition Fee (Term 1)  $500.00     Paid ✓      │   │
│  │  Sep 15      Books & Materials     $150.00     Paid ✓      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Components:
- FeeBreakdown.jsx (Fee table with checkboxes)
- PaymentMethods.jsx (Card, Bank, UPI selection)
- PaymentSummary.jsx (Total + Pay button)
- FeeHistory.jsx (Past payments table)
```

### 5. Payment Success Page

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│         ┌─────────────────────────────────────────────────┐        │
│         │                                                 │        │
│         │                    ✓                            │        │
│         │            Payment Successful!                  │        │
│         │    Your transaction has been completed          │        │
│         │              successfully.                      │        │
│         │                                                 │        │
│         │  AMOUNT PAID          TRANSACTION ID            │        │
│         │  $350.00              #TXN_20231024_882         │        │
│         │                                                 │        │
│         │  DATE & TIME          PAYMENT METHOD            │        │
│         │  Oct 24, 2023         💳 Credit Card           │        │
│         │  10:42 AM                                       │        │
│         │                                                 │        │
│         │  PAID FOR                                       │        │
│         │  ┌───────────────────────────────────────────┐ │        │
│         │  │ Transport Fee (Term 2)         $250.00   │ │        │
│         │  │ Lab Charges (Term 2)           $100.00   │ │        │
│         │  └───────────────────────────────────────────┘ │        │
│         │                                                 │        │
│         │  [ 📥 Download Receipt ]  [ 🕐 View History ]  │        │
│         │                                                 │        │
│         │       🔒 Payments are secure and encrypted      │        │
│         │                                                 │        │
│         └─────────────────────────────────────────────────┘        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6. Exam Schedule Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  Exam Schedule                                           🔍         │
│  Upcoming examinations and timetables for Term-I                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Term-I     │  │   Term-I     │  │   Term-I     │              │
│  │  📅 15 Nov   │  │  📅 13 Sep   │  │  📅 03 Sep   │              │
│  │  CHEMISTRY   │  │  ENGLISH     │  │  COMMERCE    │              │
│  │  ⏰ 3:10 PM  │  │  ⏰ 4:57 PM  │  │ ⏰ 9:00-12:00│              │
│  │  📝 check    │  │ 📖 All port. │  │ 📖 Ch 1-5    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  📅 Detailed Timetable                          📥 Download PDF    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Sample exam schedule for July Unit Test - 2025              │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │ DAY/DATE      │ CLASS I │ CLASS II │ CLASS III │ CLASS IV   │   │
│  ├───────────────┼─────────┼──────────┼───────────┼────────────┤   │
│  │ 02.07.2025    │  MATHS  │   EVS    │   MATHS   │  SCIENCE   │   │
│  │ WEDNESDAY     │         │          │           │            │   │
│  ├───────────────┼─────────┼──────────┼───────────┼────────────┤   │
│  │ 03.07.2025    │  TAMIL  │ ENGLISH  │  SOC.SCI  │   MATHS    │   │
│  │ THURSDAY      │         │          │           │            │   │
│  ├───────────────┼─────────┼──────────┼───────────┼────────────┤   │
│  │ 04.07.2025    │   EVS   │  TAMIL   │   TAMIL   │  ENGLISH   │   │
│  │ FRIDAY        │         │          │           │            │   │
│  └───────────────┴─────────┴──────────┴───────────┴────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Components:
- UpcomingExamCard.jsx (Exam cards)
- ExamTimetable.jsx (Timetable grid)
```

### 7. View Marks Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  Student Marks                                           🔔 👤      │
│  View and analyze academic performance                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [ ARIVUMATHI V ]  [ PRANAV OG ]  [ LAVANYA ]    (Student Tabs)    │
│                                                                     │
│  Select Year              Select Exam                               │
│  ┌─────────────────┐     ┌─────────────────┐    [ SUBMIT ]         │
│  │ 2025-2026 Sel.. ▼│     │ Term-I Selected ▼│                      │
│  └─────────────────┘     └─────────────────┘                       │
│                                                                     │
│  ┌──────────────────────────┐  ┌────────────────────────────────┐  │
│  │      Report Card         │  │    Performance Overview        │  │
│  │  ┌────────────────────┐  │  │                                │  │
│  │  │ Term-I Results     │  │  │    📈 Line Chart               │  │
│  │  │ 2025-2026    Passed│  │  │                         86.3%  │  │
│  │  │                    │  │  │    ─────────────────●          │  │
│  │  │ 📘 English    87   │  │  │                                │  │
│  │  │ 📐 Maths      80   │  │  │  Unit1  Unit2  Mid  Term1      │  │
│  │  │ 🔬 Science    92   │  │  │                                │  │
│  │  │                    │  │  │  Analysis: Consistent          │  │
│  │  │ TOTAL: 259/300     │  │  │  improvement shown. Term 1     │  │
│  │  │ PERCENTAGE: 86.3%  │  │  │  is +8.3% higher than Mid.     │  │
│  │  └────────────────────┘  │  │                                │  │
│  └──────────────────────────┘  └────────────────────────────────┘  │
│                                                                     │
│  Detailed Subject Breakdown                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ SUBJECT     │ MAX MARKS │ OBTAINED │ GRADE │ REMARKS        │   │
│  ├─────────────┼───────────┼──────────┼───────┼────────────────┤   │
│  │ English     │    100    │    87    │   A   │ Excellent      │   │
│  │ Mathematics │    100    │    80    │   B+  │ Good           │   │
│  │ Science     │    100    │    92    │   A+  │ Outstanding    │   │
│  └─────────────┴───────────┴──────────┴───────┴────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Components:
- ReportCard.jsx (Term results card)
- PerformanceChart.jsx (Line chart)
- SubjectBreakdown.jsx (Detailed table)
```

### 8. Gallery Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  School Gallery                                          🔍 Sort ▼  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔍 Search albums...                           Sort: Newest First   │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   [Image]    │  │   [Image]    │  │   [Image]    │              │
│  │              │  │              │  │              │              │
│  │ Independence │  │Annual Science│  │Creative Arts │              │
│  │ Day 2023     │  │ Exhibition   │  │  Workshop    │              │
│  │ Aug 15, 2023 │  │ Dec 10, 2023 │  │ Nov 05, 2023 │              │
│  │ [View Album] │  │ [View Album] │  │ [View Album] │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   [Image]    │  │   [Image]    │  │   [Image]    │              │
│  │              │  │              │  │              │              │
│  │Annual Sports │  │ Kindergarten │  │ Field Trip   │              │
│  │    Meet      │  │  Graduation  │  │  to the Zoo  │              │
│  │ Dec 12, 2023 │  │ Mar 20, 2024 │  │ Apr 15, 2024 │              │
│  │ [View Album] │  │ [View Album] │  │ [View Album] │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Components:
- AlbumCard.jsx (Album thumbnail with title)
```

### 9. Album View Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  Gallery > Independence Day                        ← Back to Gallery│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Independence Day Celebration 2023                                  │
│  📅 Aug 15, 2023  •  📷 24 Photos                                   │
│                                                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                    │
│  │ Photo  │  │ Photo  │  │ Photo  │  │ Photo  │                    │
│  │   1    │  │   2    │  │   3    │  │   4    │                    │
│  └────────┘  └────────┘  └────────┘  └────────┘                    │
│                                                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                    │
│  │ Photo  │  │ Photo  │  │ Photo  │  │ Photo  │                    │
│  │   5    │  │   6    │  │   7    │  │   8    │                    │
│  └────────┘  └────────┘  └────────┘  └────────┘                    │
│                                                                     │
│  ┌────────┐  ┌────────┐                                            │
│  │ Photo  │  │ Photo  │                                            │
│  │   9    │  │  10    │                                            │
│  └────────┘  └────────┘                                            │
│                                                                     │
│                      [ 1 ] [ 2 ] [ 3 ] ... [ > ]                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Components:
- PhotoGrid.jsx (Photo grid with lightbox)
- Pagination.jsx (Page navigation)
```

---

## STEP 6: Development Execution Order

### Phase 1: Foundation

| Step | Task | Files |
|------|------|-------|
| 1.1 | Project setup | Vite, dependencies, Tailwind |
| 1.2 | Folder structure | Create all folders |
| 1.3 | Environment config | `.env` |
| 1.4 | Base utilities | `storage.js`, `formatters.js`, `constants.js` |
| 1.5 | Axios setup | `api.js` (basic) |
| 1.6 | Common components | Button, Input, Loader, Card, Badge, Avatar |
| 1.7 | Additional common | Modal, Table, Tabs, SearchBar, Pagination |
| 1.8 | Basic routing | AppRoutes (placeholder pages) |

**Checkpoint 1**: App runs, all routes show placeholders

---

### Phase 2: Authentication

| Step | Task | Files |
|------|------|-------|
| 2.1 | Auth Context | `AuthContext.jsx`, `useAuth.js` |
| 2.2 | Auth Service | `authService.js` |
| 2.3 | Axios interceptors | Update `api.js` |
| 2.4 | Auth Layout | `AuthLayout.jsx` |
| 2.5 | Login Page | `Login.jsx` (complete with OTP flow) |
| 2.6 | Route Guards | `ProtectedRoute.jsx`, `PublicRoute.jsx` |
| 2.7 | App Integration | Wrap with AuthProvider |

**Checkpoint 2**: Login works, routes protected, token persists

---

### Phase 3: Layout & Navigation

| Step | Task | Files |
|------|------|-------|
| 3.1 | Sidebar | `Sidebar.jsx` with all menu items |
| 3.2 | Header | `Header.jsx` with student switcher |
| 3.3 | Student Switcher | `StudentSwitcher.jsx` |
| 3.4 | Dashboard Layout | `DashboardLayout.jsx` |
| 3.5 | Update Routes | Add all routes with DashboardLayout |

**Checkpoint 3**: Navigation works, sidebar highlights active page

---

### Phase 4: Dashboard

| Step | Task | Files |
|------|------|-------|
| 4.1 | Dashboard Service | `dashboardService.js` |
| 4.2 | Stats Cards | `StatsCard.jsx` |
| 4.3 | Recent Activity | `RecentActivity.jsx` |
| 4.4 | Quick Actions | `QuickActions.jsx` |
| 4.5 | Up Next | `UpNext.jsx` |
| 4.6 | Dashboard Page | `Dashboard.jsx` (complete) |

**Checkpoint 4**: Dashboard loads with real data

---

### Phase 5: Homework

| Step | Task | Files |
|------|------|-------|
| 5.1 | Homework Service | `homeworkService.js` |
| 5.2 | Homework Card | `HomeworkCard.jsx` |
| 5.3 | Homework Filters | `HomeworkFilters.jsx` |
| 5.4 | Homework Page | `Homework.jsx` (complete) |

**Checkpoint 5**: Homework page works with filters

---

### Phase 6: Circulars

| Step | Task | Files |
|------|------|-------|
| 6.1 | Circular Service | `circularService.js` |
| 6.2 | Audio Player | `AudioPlayer.jsx` (common), `CircularAudioPlayer.jsx` |
| 6.3 | Circular Card | `CircularCard.jsx` |
| 6.4 | Circulars Page | `Circulars.jsx` (complete) |

**Checkpoint 6**: Circulars page works with audio/attachments

---

### Phase 7: Fee Payment

| Step | Task | Files |
|------|------|-------|
| 7.1 | Fee Service | `feeService.js` |
| 7.2 | Fee Breakdown | `FeeBreakdown.jsx` |
| 7.3 | Payment Methods | `PaymentMethods.jsx` |
| 7.4 | Payment Summary | `PaymentSummary.jsx` |
| 7.5 | Fee History | `FeeHistory.jsx` |
| 7.6 | Fee Payment Page | `FeePayment.jsx` (complete) |
| 7.7 | Payment Success | `PaymentSuccess.jsx` |

**Checkpoint 7**: Fee payment flow works

---

### Phase 8: Exam Schedule

| Step | Task | Files |
|------|------|-------|
| 8.1 | Exam Service | `examService.js` |
| 8.2 | Upcoming Exam Card | `UpcomingExamCard.jsx` |
| 8.3 | Exam Timetable | `ExamTimetable.jsx` |
| 8.4 | Exam Schedule Page | `ExamSchedule.jsx` (complete) |

**Checkpoint 8**: Exam schedule page works

---

### Phase 9: View Marks

| Step | Task | Files |
|------|------|-------|
| 9.1 | Marks Service | `marksService.js` |
| 9.2 | Report Card | `ReportCard.jsx` |
| 9.3 | Performance Chart | `PerformanceChart.jsx` |
| 9.4 | Subject Breakdown | `SubjectBreakdown.jsx` |
| 9.5 | View Marks Page | `ViewMarks.jsx` (complete) |

**Checkpoint 9**: Marks page works with chart

---

### Phase 10: Gallery

| Step | Task | Files |
|------|------|-------|
| 10.1 | Gallery Service | `galleryService.js` |
| 10.2 | Album Card | `AlbumCard.jsx` |
| 10.3 | Photo Grid | `PhotoGrid.jsx` |
| 10.4 | Gallery Page | `Gallery.jsx` (complete) |
| 10.5 | Album View Page | `AlbumView.jsx` (complete) |

**Checkpoint 10**: Gallery and album view work

---

### Phase 11: Polish

| Step | Task |
|------|------|
| 11.1 | Loading states (skeletons) |
| 11.2 | Error handling |
| 11.3 | Empty states |
| 11.4 | Responsive design |
| 11.5 | Final testing |
| 11.6 | Production build |

**Final Checkpoint**: Production ready

---

## File Creation Sequence

```
#    FILE                                                    PHASE
─────────────────────────────────────────────────────────────────────
1    .env                                                    1.3
2    tailwind.config.js                                      1.1
3    src/index.css                                           1.1
4    src/utils/storage.js                                    1.4
5    src/utils/formatters.js                                 1.4
6    src/utils/constants.js                                  1.4
7    src/services/api.js                                     1.5
8    src/components/common/Button.jsx                        1.6
9    src/components/common/Input.jsx                         1.6
10   src/components/common/Loader.jsx                        1.6
11   src/components/common/Card.jsx                          1.6
12   src/components/common/Badge.jsx                         1.6
13   src/components/common/Avatar.jsx                        1.6
14   src/components/common/Modal.jsx                         1.7
15   src/components/common/Table.jsx                         1.7
16   src/components/common/Tabs.jsx                          1.7
17   src/components/common/SearchBar.jsx                     1.7
18   src/components/common/Pagination.jsx                    1.7
19   src/components/common/AudioPlayer.jsx                   1.7
20   src/components/common/index.js                          1.7
21   src/pages/NotFound/NotFound.jsx                         1.8
22   src/pages/**/placeholder files                          1.8
23   src/routes/AppRoutes.jsx                                1.8
24   src/App.jsx                                             1.8
─────────────────────────────────────────────────────────────────────
     CHECKPOINT 1: App runs, routes work
─────────────────────────────────────────────────────────────────────
25   src/context/AuthContext.jsx                             2.1
26   src/hooks/useAuth.js                                    2.1
27   src/services/authService.js                             2.2
28   src/services/api.js (update)                            2.3
29   src/layouts/AuthLayout.jsx                              2.4
30   src/pages/Login/Login.jsx                               2.5
31   src/routes/ProtectedRoute.jsx                           2.6
32   src/routes/PublicRoute.jsx                              2.6
33   src/routes/AppRoutes.jsx (update)                       2.6
34   src/App.jsx (update)                                    2.7
─────────────────────────────────────────────────────────────────────
     CHECKPOINT 2: Login works, routes protected
─────────────────────────────────────────────────────────────────────
35   src/components/layout/Sidebar.jsx                       3.1
36   src/components/layout/Header.jsx                        3.2
37   src/components/layout/StudentSwitcher.jsx               3.3
38   src/components/layout/index.js                          3.3
39   src/layouts/DashboardLayout.jsx                         3.4
40   src/routes/AppRoutes.jsx (update)                       3.5
─────────────────────────────────────────────────────────────────────
     CHECKPOINT 3: Navigation works
─────────────────────────────────────────────────────────────────────
41   src/services/dashboardService.js                        4.1
42   src/pages/Dashboard/components/StatsCard.jsx            4.2
43   src/pages/Dashboard/components/RecentActivity.jsx       4.3
44   src/pages/Dashboard/components/QuickActions.jsx         4.4
45   src/pages/Dashboard/components/UpNext.jsx               4.5
46   src/pages/Dashboard/components/index.js                 4.5
47   src/pages/Dashboard/Dashboard.jsx                       4.6
─────────────────────────────────────────────────────────────────────
     CHECKPOINT 4: Dashboard works
─────────────────────────────────────────────────────────────────────
48   src/services/homeworkService.js                         5.1
49   src/pages/Homework/components/HomeworkCard.jsx          5.2
50   src/pages/Homework/components/HomeworkFilters.jsx       5.3
51   src/pages/Homework/components/index.js                  5.3
52   src/pages/Homework/Homework.jsx                         5.4
─────────────────────────────────────────────────────────────────────
     CHECKPOINT 5: Homework works
─────────────────────────────────────────────────────────────────────
53   src/services/circularService.js                         6.1
54   src/pages/Circulars/components/CircularAudioPlayer.jsx  6.2
55   src/pages/Circulars/components/CircularCard.jsx         6.3
56   src/pages/Circulars/components/index.js                 6.3
57   src/pages/Circulars/Circulars.jsx                       6.4
─────────────────────────────────────────────────────────────────────
     CHECKPOINT 6: Circulars works
─────────────────────────────────────────────────────────────────────
58   src/services/feeService.js                              7.1
59   src/pages/Fees/components/FeeBreakdown.jsx              7.2
60   src/pages/Fees/components/PaymentMethods.jsx            7.3
61   src/pages/Fees/components/PaymentSummary.jsx            7.4
62   src/pages/Fees/components/FeeHistory.jsx                7.5
63   src/pages/Fees/components/index.js                      7.5
64   src/pages/Fees/FeePayment.jsx                           7.6
65   src/pages/Fees/PaymentSuccess.jsx                       7.7
─────────────────────────────────────────────────────────────────────
     CHECKPOINT 7: Fee Payment works
─────────────────────────────────────────────────────────────────────
66   src/services/examService.js                             8.1
67   src/pages/Exams/components/UpcomingExamCard.jsx         8.2
68   src/pages/Exams/components/ExamTimetable.jsx            8.3
69   src/pages/Exams/components/index.js                     8.3
70   src/pages/Exams/ExamSchedule.jsx                        8.4
─────────────────────────────────────────────────────────────────────
     CHECKPOINT 8: Exam Schedule works
─────────────────────────────────────────────────────────────────────
71   src/services/marksService.js                            9.1
72   src/pages/Marks/components/ReportCard.jsx               9.2
73   src/pages/Marks/components/PerformanceChart.jsx         9.3
74   src/pages/Marks/components/SubjectBreakdown.jsx         9.4
75   src/pages/Marks/components/index.js                     9.4
76   src/pages/Marks/ViewMarks.jsx                           9.5
─────────────────────────────────────────────────────────────────────
     CHECKPOINT 9: View Marks works
─────────────────────────────────────────────────────────────────────
77   src/services/galleryService.js                          10.1
78   src/pages/Gallery/components/AlbumCard.jsx              10.2
79   src/pages/Gallery/components/PhotoGrid.jsx              10.3
80   src/pages/Gallery/components/index.js                   10.3
81   src/pages/Gallery/Gallery.jsx                           10.4
82   src/pages/Gallery/AlbumView.jsx                         10.5
─────────────────────────────────────────────────────────────────────
     CHECKPOINT 10: Gallery works
─────────────────────────────────────────────────────────────────────
83   Responsive updates                                      11.4
84   Loading/error improvements                              11.1-11.3
─────────────────────────────────────────────────────────────────────
     FINAL: Production ready
─────────────────────────────────────────────────────────────────────
```

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3005/api
VITE_DB_NAME=cresent
VITE_APP_VERSION=1.0.0
```

---

## Dependencies

```bash
# Core
npm install react-router-dom axios

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Optional utilities
npm install clsx
```

---

## Reference Files

```
reference/
├── PARENT_APP_API_ENDPOINTS.txt      # API documentation
├── postman_collection.json           # Postman collection
│
└── Web_ui/
    ├── otp_login_page/
    │   ├── code.html                 # Login HTML
    │   └── screen.png                # Login screenshot
    │
    ├── main_dashboard/
    │   ├── code.html                 # Dashboard HTML
    │   └── screen.png                # Dashboard screenshot
    │
    ├── Homework/
    │   ├── code.html
    │   └── screen.png
    │
    ├── Circulars/
    │   ├── code.html
    │   └── screen.png
    │
    ├── fee_payment_/
    │   ├── code.html
    │   └── screen.png
    │
    ├── Payment_successful/
    │   ├── code.html
    │   └── screen.png
    │
    ├── exam_schedule_page/
    │   ├── code.html
    │   └── screen.png
    │
    ├── view_marks_page/
    │   ├── code.html
    │   └── screen.png
    │
    ├── Gallery/
    │   ├── code.html
    │   └── screen.png
    │
    └── sub_gallery_/_album_view/
        ├── code.html
        └── screen.png
```

---

## Summary

| Total Pages | 10 |
|-------------|-----|
| Total Phases | 11 |
| Total Files | ~84 |
| Common Components | 12 |
| Layout Components | 3 |
| Services | 8 |

**Ready for implementation upon approval.**

---

## Development Log

### January 8, 2026
**Focus:** Dashboard Flash Messages, Stats Labels, Homework & Circulars API Integration

#### Tasks Completed
- [x] Flash Message Queue System - Multiple popups showing one by one
- [x] Dashboard Stats - Real data from batchCount API
- [x] Homework Page - Real API integration with media attachments
- [x] Circulars Page - Real API integration

#### New Components Created
- `FlashMessageQueue.jsx` - Queue system for flash message modals
- `MediaSlider.jsx` - Slider for images/audio/documents in homework cards

#### API Endpoints Added
| Endpoint | Purpose |
|----------|---------|
| `GET /dashboard/getLatestMessageWebsite` | Flash messages queue |
| `POST /dashboard/batchCount` | Stats labels (attendance, homework, circulars, payment) |

#### Files Modified
- `src/services/dashboardService.js` - Added new API functions
- `src/pages/Dashboard/Dashboard.jsx` - Flash queue + stats integration
- `src/pages/Homework/Homework.jsx` - Real API + media slider
- `src/pages/Circulars/Circulars.jsx` - Real API integration
