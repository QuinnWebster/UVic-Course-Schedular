#!/usr/bin/env python3
"""
uvic_course_check.py
Checks UVic Banner course availability from the terminal.

Usage:
    python uvic_course_check.py
    python uvic_course_check.py CSC 225 202605
    python uvic_course_check.py MATH 100 202609

Term codes:
    202601 = Spring 2026
    202605 = Summer 2026
    202609 = Fall 2026
"""

import sys
import time
import requests

# ── Arguments / defaults ────────────────────────────────────────────────────
subject       = sys.argv[1] if len(sys.argv) > 1 else "CSC"
course_number = sys.argv[2] if len(sys.argv) > 2 else "111"
term          = sys.argv[3] if len(sys.argv) > 3 else "202605"

BASE_URL   = "https://banner.uvic.ca/StudentRegistrationSsb/ssb"
SESSION_ID = str(int(time.time()))

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

print()
print("━" * 51)
print(f"  UVic Course Availability Checker")
print(f"  Subject: {subject}  |  Course: {course_number}  |  Term: {term}")
print("━" * 51)

session = requests.Session()
session.headers.update(HEADERS)

try:
    # ── Step 1: Load the main page to get a JSESSIONID cookie ───────────────
    print("\n⏳ Initializing session...")
    session.get(f"{BASE_URL}/classSearch/classSearch", timeout=10)

    # ── Step 2: Reset the term selection (clears any prior state) ───────────
    print("⏳ Resetting term...")
    session.post(
        f"{BASE_URL}/classSearch/resetDataForm",
        timeout=10,
        headers={"Referer": f"{BASE_URL}/classSearch/classSearch"},
    )

    # ── Step 3: Set the term ─────────────────────────────────────────────────
    print("⏳ Setting term...")
    session.get(
        f"{BASE_URL}/term/search",
        params={"mode": "search"},
        timeout=10,
        headers={
            "X-Requested-With": "XMLHttpRequest",
            "Referer": f"{BASE_URL}/classSearch/classSearch",
        },
    )

    session.post(
        f"{BASE_URL}/term/search",
        params={"mode": "search"},
        data={"term": term, "studyPath": "", "studyPathText": "", "startDatepicker": "", "endDatepicker": ""},
        timeout=10,
        headers={
            "X-Requested-With": "XMLHttpRequest",
            "Referer": f"{BASE_URL}/classSearch/classSearch",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )

    # ── Step 4: Fetch search results ─────────────────────────────────────────
    print(f"⏳ Fetching results for {subject} {course_number}...\n")
    resp = session.get(
        f"{BASE_URL}/searchResults/searchResults",
        params={
            "txt_subject": subject,
            "txt_courseNumber": course_number,
            "txt_term": term,
            "startDatepicker": "",
            "endDatepicker": "",
            "uniqueSessionId": SESSION_ID,
            "pageOffset": 0,
            "pageMaxSize": 50,
            "sortColumn": "sequenceNumber",
            "sortDirection": "asc",
        },
        headers={
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Referer": f"{BASE_URL}/classSearch/classSearch",
        },
        timeout=10,
    )

except requests.RequestException as e:
    print(f"❌ Network error: {e}")
    sys.exit(1)

# ── Step 5: Parse response ───────────────────────────────────────────────────
try:
    data = resp.json()
except Exception:
    print("❌ Failed to parse response. Raw output:")
    print(resp.text[:500])
    sys.exit(1)

if not data.get("success"):
    print("❌ Request was not successful. Response:")
    print(data)
    sys.exit(1)

sections = data.get("data") or []
total    = data.get("totalCount", 0)

if total == 0:
    print(f"No sections found for {subject} {course_number} in term {term}.")
    sys.exit(0)

print(f"Found {total} section(s):\n")

# ── Step 6: Display results ──────────────────────────────────────────────────
for s in sections:
    crn      = s.get("courseReferenceNumber", "N/A")
    seq      = s.get("sequenceNumber", "N/A")
    title    = s.get("courseTitle", "N/A")
    method   = s.get("instructionalMethodDescription", "N/A")
    max_enr  = s.get("maximumEnrollment", 0)
    enrolled = s.get("enrollment", 0)
    seats    = s.get("seatsAvailable", 0)
    wait_cap = s.get("waitCapacity", 0)
    wait_cnt = s.get("waitCount", 0)
    wait_avl = s.get("waitAvailable", 0)
    is_open  = s.get("openSection", False)
    status   = "✅ OPEN" if is_open else "❌ CLOSED"

    # Instructors
    faculty = s.get("faculty") or []
    instructors = ", ".join(
        f["displayName"] for f in faculty if f.get("displayName")
    ) or "TBA"

    # Schedule
    schedule_lines = []
    for m in s.get("meetingsFaculty") or []:
        mt = m.get("meetingTime") or {}
        days = "".join([
            "Mo" if mt.get("monday")    else "",
            "Tu" if mt.get("tuesday")   else "",
            "We" if mt.get("wednesday") else "",
            "Th" if mt.get("thursday")  else "",
            "Fr" if mt.get("friday")    else "",
            "Sa" if mt.get("saturday")  else "",
            "Su" if mt.get("sunday")    else "",
        ]) or "TBA"
        begin = mt.get("beginTime", "")
        end   = mt.get("endTime", "")
        time_str = f"{begin[:2]}:{begin[2:]}–{end[:2]}:{end[2:]}" if begin and end else "TBA"
        start_date = mt.get("startDate", "TBA")
        end_date   = mt.get("endDate", "TBA")
        schedule_lines.append(f"    {days}  {time_str}  ({start_date} – {end_date})")

    print(f"  Section {seq}  |  CRN: {crn}  |  {status}")
    print(f"  Title      : {title}")
    print(f"  Format     : {method}")
    print(f"  Instructor : {instructors}")
    print(f"  Enrollment : {enrolled}/{max_enr}  (seats available: {seats})")
    print(f"  Waitlist   : {wait_cnt}/{wait_cap}  (waitlist available: {wait_avl})")
    if schedule_lines:
        print(f"  Schedule   :")
        for line in schedule_lines:
            print(line)
    print()

print("━" * 51)
print(f"Done. Retrieved from UVic Banner.")
print("━" * 51)