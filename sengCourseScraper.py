import requests
from bs4 import BeautifulSoup

URL = "https://www.uvic.ca/ecs/software/current-students/courses/index.php"


def is_real_course(href: str) -> bool:
    """Filter out electives and non-course links"""
    if not href:
        return False
    return "calendar/CDs" in href  # real course pages live here


def extract_course_from_cell(td, term_label):
    courses = []

    links = td.find_all("a")

    for link in links:
        href = link.get("href")
        if not is_real_course(href):
            continue

        code = link.get_text(strip=True)

        # Full text of cell (contains name)
        full_text = td.get_text(" ", strip=True)

        # Extract name by removing code
        name = full_text.replace(code, "").strip(" -\n ")

        courses.append({
            "code": code,
            "name": name,
            "link": href,
            "term": term_label
        })

    return courses


def scrape_courses():
    res = requests.get(URL)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")

    all_courses = []

    tables = soup.find_all("table", class_="zebra")

    for table in tables:
        rows = table.find_all("tr")

        # First row = term headers
        headers = [th.get_text(strip=True) for th in rows[0].find_all("td")]

        # Remaining rows contain course cells
        for row in rows[1:]:
            cols = row.find_all("td")

            for i, col in enumerate(cols):
                if i >= len(headers):
                    continue

                term_label = headers[i]

                courses = extract_course_from_cell(col, term_label)
                all_courses.extend(courses)

    # Deduplicate by (code, link)
    seen = set()
    unique_courses = []

    for c in all_courses:
        key = (c["code"], c["link"])
        if key not in seen:
            seen.add(key)
            unique_courses.append(c)

    return unique_courses


if __name__ == "__main__":
    courses = scrape_courses()

    for c in courses:
        # print(f"{c['term']} | {c['code']} | {c['name']}")
        # print(f"  → {c['link']}")
        print(f"{c['name']}")
