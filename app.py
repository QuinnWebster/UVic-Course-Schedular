#!/usr/bin/env python3
"""
app.py — UVic Course Availability API
Run: pip install flask flask-cors requests
     python app.py
"""

import time
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_URL = "https://banner.uvic.ca/StudentRegistrationSsb/ssb"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}


def fetch_sections(subject: str, course_number: str, term: str):
    session = requests.Session()
    session.headers.update(HEADERS)
    session_id = str(int(time.time()))

    # Step 1: Init session / get JSESSIONID
    session.get(f"{BASE_URL}/classSearch/classSearch", timeout=10)

    # Step 2: Reset form state
    session.post(
        f"{BASE_URL}/classSearch/resetDataForm",
        timeout=10,
        headers={"Referer": f"{BASE_URL}/classSearch/classSearch"},
    )

    # Step 3: Register term
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

    # Step 4: Fetch results
    resp = session.get(
        f"{BASE_URL}/searchResults/searchResults",
        params={
            "txt_subject": subject,
            "txt_courseNumber": course_number,
            "txt_term": term,
            "startDatepicker": "",
            "endDatepicker": "",
            "uniqueSessionId": session_id,
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
    resp.raise_for_status()
    return resp.json()


def parse_section(s: dict) -> dict:
    """Flatten a raw Banner section into a clean dict."""
    # Build schedule
    schedule = []
    for m in s.get("meetingsFaculty") or []:
        mt = m.get("meetingTime") or {}
        days = "".join([
            "Mon" if mt.get("monday")    else "",
            "Tue" if mt.get("tuesday")   else "",
            "Wed" if mt.get("wednesday") else "",
            "Thu" if mt.get("thursday")  else "",
            "Fri" if mt.get("friday")    else "",
            "Sat" if mt.get("saturday")  else "",
            "Sun" if mt.get("sunday")    else "",
        ]) or "TBA"
        begin = mt.get("beginTime", "")
        end   = mt.get("endTime", "")
        time_str = f"{begin[:2]}:{begin[2:]}–{end[:2]}:{end[2:]}" if begin and end else "TBA"
        schedule.append({
            "days": days,
            "time": time_str,
            "startDate": mt.get("startDate", "TBA"),
            "endDate": mt.get("endDate", "TBA"),
            "room": mt.get("room", "TBA"),
            "building": mt.get("buildingDescription", "TBA"),
        })

    faculty = s.get("faculty") or []
    instructors = [f["displayName"] for f in faculty if f.get("displayName")] or ["TBA"]

    return {
        "crn":           s.get("courseReferenceNumber"),
        "section":       s.get("sequenceNumber"),
        "title":         s.get("courseTitle"),
        "subject":       s.get("subject"),
        "courseNumber":  s.get("courseNumber"),
        "term":          s.get("termDesc"),
        "format":        s.get("instructionalMethodDescription"),
        "scheduleType":  s.get("scheduleTypeDescription"),
        "campus":        s.get("campusDescription"),
        "credits":       s.get("creditHourHigh"),
        "isOpen":        s.get("openSection", False),
        "enrollment":    s.get("enrollment", 0),
        "maxEnrollment": s.get("maximumEnrollment", 0),
        "seatsAvailable": s.get("seatsAvailable", 0),
        "waitCount":     s.get("waitCount", 0),
        "waitCapacity":  s.get("waitCapacity", 0),
        "waitAvailable": s.get("waitAvailable", 0),
        "instructors":   instructors,
        "schedule":      schedule,
    }


@app.route("/api/courses", methods=["GET"])
def get_courses():
    subject       = request.args.get("subject", "").upper().strip()
    course_number = request.args.get("courseNumber", "").strip()
    term          = request.args.get("term", "202605").strip()

    if not subject or not course_number:
        return jsonify({"error": "subject and courseNumber are required"}), 400

    try:
        raw = fetch_sections(subject, course_number, term)
    except requests.RequestException as e:
        return jsonify({"error": f"Failed to reach UVic Banner: {str(e)}"}), 502

    if not raw.get("success"):
        return jsonify({"error": "Banner returned an unsuccessful response"}), 502

    sections = [parse_section(s) for s in (raw.get("data") or [])]

    return jsonify({
        "subject":      subject,
        "courseNumber": course_number,
        "term":         term,
        "totalCount":   raw.get("totalCount", 0),
        "sections":     sections,
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    print("🚀 UVic Course API running at http://localhost:5000")
    app.run(debug=True, port=5000)