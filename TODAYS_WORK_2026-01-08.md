# Today's Work Plan - January 8, 2026

## Overview
Today we will implement real API integrations for Dashboard, Homework, and Circulars pages with interactive media support.

---

## Task 1: Flash Message Queue System (Dashboard)
**Priority:** High | **Status:** Pending

### Description
Implement a flash message popup queue that shows multiple messages one by one. When user closes one message, the next one appears.

### API Details
- **Endpoint:** `GET https://dev1.schooltree.in/api/dashboard/getLatestMessageWebsite`
- **Response Structure:**
```json
{
    "status": true,
    "message": "Latest at pss message",
    "data": [
        {
            "nid": 3,
            "links": "https://pssenior.edu.in/other-event.php",
            "Discription": "Investiture Ceremony of the Student Council (2025-26)",
            "show_flag": "0"
        },
        ...
    ]
}
```

### Implementation Steps
1. Create new service function `getLatestMessageWebsite()` in dashboardService.js
2. Create `FlashMessageQueue.jsx` component that:
   - Accepts array of messages
   - Shows one message at a time in modal
   - Advances to next message when closed
   - Supports links and descriptions
3. Update Dashboard.jsx to use the new queue system

---

## Task 2: Dashboard Badge/Stats Labels (Dashboard)
**Priority:** High | **Status:** Pending

### Description
Update the dashboard stat cards to show real data from the batchCount API.

### API Details
- **Endpoint:** `POST https://dev1.schooltree.in/api/dashboard/batchCount`
- **Payload:** `{ "ADNO": "9269" }` (from selected_student.ADNO)
- **Response Structure:**
```json
{
    "status": true,
    "message": "Batch Count",
    "data": [
        { "label": "circulars", "count": 0 },
        { "label": "attendance", "count": "100.00", "status": "No Data" },
        { "label": "homework", "count": 0 },
        { "label": "payment_due", "count": 7025, "payment_status": "Payment Due" }
    ]
}
```

### Implementation Steps
1. Update `getBatchCount()` function to use ADNO instead of mobile_number
2. Update Dashboard.jsx stat cards to use batchCount data:
   - Attendance: `attendance.count` (percentage)
   - Homework: `homework.count` (pending count)
   - Circulars: `circulars.count` (new count)
   - Fees Due: `payment_due.count` (amount with payment_status)

---

## Task 3: Homework Page - Real API Integration
**Priority:** High | **Status:** Pending

### Description
Replace mock data with real API data and add media slider for images/attachments.

### API Details
- **Endpoint:** `POST https://dev1.schooltree.in/api/homework/getSaveHomeworkByClass`
- **Payload:** `{ "classid": "16", "adno": "9269" }`
- **Response Structure:**
```json
{
    "status": true,
    "data": [
        {
            "MSG_ID": 364,
            "CLASS": "VI-A",
            "MESSAGE": "test",
            "MSG_DATE": "2026-01-07T18:30:00.000Z",
            "subject": "BIOLOGY",
            "event_image": "[\"url1\",\"url2\",...]" // JSON string or single URL
        }
    ]
}
```

### Implementation Steps
1. Create homeworkService.js with `getHomework(classid, adno)` function
2. Update Homework.jsx:
   - Fetch data using student's classid and adno
   - Parse event_image (can be JSON array string or single URL)
   - Add MediaSlider component at bottom of each card
   - Support audio files (.wav, .mp3), images, documents
3. Create `MediaSlider.jsx` component for attachments
4. Handle different file types:
   - Images: Show in slider
   - Audio: Show audio player
   - Documents (xlsx, pdf, docx): Show download link with icon

---

## Task 4: Circulars Page - Real API Integration
**Priority:** High | **Status:** Pending

### Description
Replace mock data with real API data.

### API Details
- **Endpoint:** `POST https://dev1.schooltree.in/api/circular/getAllMessagesByMobileNumber`
- **Payload:** `{ "mobile_number": "9600037999" }`
- **Response Structure:**
```json
{
    "status": true,
    "data": [
        {
            "ADNO": "9230",
            "SMSdate": "07,Jan-13:53",
            "STUDENTNAME": "AASHIKA A",
            "Message": "You have a new flash message.",
            "event_image": null | "https://..."
        }
    ],
    "total_size": 211
}
```

### Implementation Steps
1. Update circularService.js (use existing getCirculars function)
2. Update Circulars.jsx:
   - Map API response to existing card structure
   - Handle null/empty event_image
   - Parse date format "07,Jan-13:53"
   - Group by student if needed
3. Add pagination support using total_size

---

## Files to Create/Modify

### New Files
1. `src/components/FlashMessageQueue.jsx` - Queue modal for flash messages
2. `src/components/common/MediaSlider.jsx` - Media attachment slider
3. `src/services/homeworkService.js` - Homework API service

### Modified Files
1. `src/services/dashboardService.js` - Add new endpoints
2. `src/pages/Dashboard/Dashboard.jsx` - Integrate flash queue & batchCount
3. `src/pages/Homework/Homework.jsx` - Real API + media slider
4. `src/pages/Circulars/Circulars.jsx` - Real API integration
5. `PROJECT_PLAN.md` - Update with new API changes

---

## Implementation Status
- [x] Task 1: Flash Message Queue System - COMPLETED
- [x] Task 2: Dashboard Badge/Stats Labels - COMPLETED
- [x] Task 3: Homework Page API Integration - COMPLETED
- [x] Task 4: Circulars Page API Integration - COMPLETED

## Testing Checklist
- [ ] Flash messages show one by one and close properly
- [ ] Dashboard stats show real data from API
- [ ] Homework cards display with media attachments
- [ ] Audio files play correctly in homework cards
- [ ] Image slider works with multiple images
- [ ] Circulars load from real API
- [ ] Student filtering works correctly
- [ ] Loading states display properly
- [ ] Error handling works for API failures

---

## Notes
- All images should be lazy-loaded
- Audio player should be consistent with existing AudioPlayer component
- Handle JSON parsing for event_image (can be string or array)
- Date formatting should be consistent across pages
