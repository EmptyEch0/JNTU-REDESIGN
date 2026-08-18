"""
Generator for Document 3: 3-Page Executive Website Overview Document
JNTU-GV College of Engineering Vizianagaram (jntugvcev.edu.in)
"""

import os
import subprocess
import re

def get_doc3_markdown():
    return """# JNTU-GV COLLEGE OF ENGINEERING VIZIANAGARAM
## EXECUTIVE WEBSITE OVERVIEW & INSTITUTIONAL SUMMARY
**Official Domain**: `jntugvcev.edu.in` | **System Version**: 2.0 (Production Release)  
**Classification**: Executive Institutional Overview (For Principal, Registrar, Management, Faculty & Students)  

---

<!-- PAGE 1 -->
# PAGE 1: ABOUT THE WEBSITE

## 1. Website Title & Institutional Metadata

| Attribute | Official Specification |
| :--- | :--- |
| **Official Website Name** | JNTU-GV CEV Official Institutional Web Portal |
| **Institution Name** | Jawaharlal Nehru Technological University Gurajada Vizianagaram — College of Engineering Vizianagaram (JNTU-GV CEV) |
| **Official Website URL** | `https://jntugvcev.edu.in` |
| **System Version & Release** | Version 2.0 (Institutional Production Release — August 2026) |
| **Development Team** | • **Likhith Kumar Mankala** (Developer)<br>• **Ch Sai Rupini** (Developer)<br>• **P Anitha** (Developer)<br>• **P Sai Vamsi** (Developer) |
| **Project Guidance & Direction** | **Sri / Dr. W. Anil Sir** (Assistant Professor / Faculty Coordinator) |
| **Document Classification** | Executive Overview — Non-Technical (Zero Financial Information) |

## 2. What is this Website?

The **JNTU-GV College of Engineering Vizianagaram Official Website** (`jntugvcev.edu.in`) is the central digital gateway of the institution. It is designed to provide students, faculty members, administrative staff, parents, recruiters, and the general public with convenient, immediate, and 24/7 access to official university information, academic resources, departmental activities, and student welfare services.

The main purpose of the website is to streamline communication across the entire campus. Rather than relying on physical notice boards or scattered paper circulars, the web portal acts as a single, trusted source of truth where all college notifications, academic schedules, examination updates, campus facilities, and institutional achievements are published and accessed effortlessly.

## 3. Why Was the Website Developed?

The website was developed to modernize the institution's digital infrastructure and address vital communication needs:

* **Centralize College Information**: Consolidates academic, administrative, departmental, and facility information into one organized portal.
* **Instant Notification Dissemination**: Replaces physical notice boards with live digital announcements and an emergency notification ticker.
* **Accessible Anywhere, Anytime**: Ensures all stakeholders can access circulars and documents seamlessly from mobile phones, tablets, laptops, and desktop computers.
* **Enhanced Transparency & Speed**: Delivers examination timetables, fee notifications, and syllabus copies directly to students without administrative delays.
* **Eco-Friendly Digital Campus**: Greatly reduces paper consumption, manual circular circulation, and administrative overhead.

## 4. Who Can Use the Website?

| Stakeholder Category | Primary Purpose & Usage |
| :--- | :--- |
| **Students & Scholars** | Download syllabi and regulations, check exam notices, view timetables, access hostel/library services, and interact with the AI assistant. |
| **Faculty Members** | Access academic calendars, view institutional circulars, update professional profiles, and highlight research publications. |
| **College Administration** | Publish official notices, broadcast urgent announcements on the top ticker, manage campus news, and oversee departmental content. |
| **Parents & Guardians** | Check admission procedures, explore campus facilities (hostels, health center, sports, banking), and access official helplines. |
| **Corporate Recruiters** | Review placement statistics, discover academic programs and department intake, and connect with the Training & Placement Officer (TPO). |
| **General Public & Alumni** | Explore college history, accreditation, research initiatives, RTI disclosures, and institutional achievements. |

---

<!-- PAGE 2 -->
# PAGE 2: WHAT DOES THE WEBSITE PROVIDE?

## 5. Main Sections of the Website

The website is structured into intuitive, user-friendly sections designed for fast navigation:

* 🏠 **Home Page**: The primary landing page featuring the institutional header, emergency announcement ticker, dynamic campus photo slider, Vice-Chancellor and Principal messages, live statistics counter, and quick-access cards.
* 📢 **Notifications & Circulars (`/notices`)**: A dedicated repository for official announcements categorized by *Academic*, *Examination*, *Admissions*, and *General Notices* with instant PDF download attachments.
* 🎓 **About & Governance (`/about/*`, `/administration/*`)**: Comprehensive information regarding the university history, mission and vision, campus map, Principal's desk, IQAC quality reports, RTI, and Anti-Ragging cell.
* 📚 **Academics (`/academics/*`)**: Full digital access to B.Tech, M.Tech, and MCA Academic Regulations (R20, R23, R25), branch-wise syllabi, academic calendars, timetables, and Examination Cell circulars.
* 🏛️ **8 Academic Department Portals (`/departments/*`)**: Dedicated web hubs for **CSE, ECE, EEE, MECH, MET, IT, BSH (Sciences & Humanities), and MBA** showcasing course curriculum, lab facilities, faculty directories, HOD message, and student achievements.
* 💼 **Placements & Career Center (`/placements/*`)**: Transparent placement statistics, annual salary packages, top recruiter listings (TCS, Infosys, Wipro, Amazon, etc.), and training schedules.
* 🔬 **Research & Development (`/rd-cell/*`)**: Showcase of funded research projects, Ph.D. scholars registry, peer-reviewed international publications, and active institutional MoUs.
* 🏠 **Campus Facilities & Student Life (`/campus-life/*`)**: Information on Boys & Girls Hostels, Central Digital Library (45,000+ books, IEEE/DELNET access), Healthcare Dispensary with 24/7 ambulance, Sports Complex, and State Bank of India campus branch.
* 🌟 **Student Corner Units (`/nss`, `/women-empowerment`, `/edc`, `/professional-bodies`)**: Dynamic portals for NSS community service, Women Empowerment & Grievance Cell, Entrepreneurship Cell, and Student Chapters (CSI, IEEE, IE, IETE, IIM).
* 👤 **Account & Management Portals (`/admin`, `/hod-login`, `/faculty-login`)**: Dedicated secure access portals for College Administrators, Department HODs, and Teaching Faculty.
* 📞 **Contact & Helpdesk (`/contact`)**: Official campus address, phone directory, department email contacts, and emergency assistance numbers.

## 6. Key Benefits of the Website

* **Centralized Information**: All academic, administrative, and student welfare data resides in a single, well-organized system.
* **Universal Multi-Device Accessibility**: Optimized for responsive viewing across smartphones, tablets, laptops, and desktop computers.
* **Rapid & Reliable Communication**: Important circulars, exam schedules, and holiday announcements reach students within seconds.
* **Structured & Categorized Content**: Information is cleanly divided into academic regulations, departments, facilities, and student cells.
* **Interactive AI Assistant**: Features the built-in "JNTU AI" chatbot to answer student queries regarding admissions, syllabus, and contacts instantly.
* **Paperless & Eco-Friendly Operation**: Drastically reduces reliance on physical notice boards and paper circulars.

---

<!-- PAGE 3 -->
# PAGE 3: HOW THE WEBSITE WORKS & OVERALL VALUE

## 7. How the Website Works

The website functions as a coordinated digital bridge connecting college authorities with students, staff, and the community. Authorized personnel create and verify institutional content, which is instantly published to the website for public access:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   COLLEGE ADMINISTRATION & DEPARTMENTS                 │
│         (Principal Office, Exam Cell, HODs, TPO, Hostel Wardens)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ (Publishes Official Content)
┌────────────────────────────────────────────────────────────────────────┐
│                 OFFICIAL JNTU-GV CEV WEB PLATFORM                      │
│                      (https://jntugvcev.edu.in)                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
 ┌──────────────┐            ┌──────────────┐            ┌──────────────┐
 │   STUDENTS   │            │   FACULTY    │            │   PARENTS &  │
 │  & SCHOLARS  │            │   & STAFF    │            │   VISITORS   │
 └──────────────┘            └──────────────┘            └──────────────┘
```

## 8. Summary of Information Available on the Website

* **Official Announcements**: University circulars, holiday notices, administrative orders.
* **Examination Records**: Timetables, hall ticket notifications, fee deadlines, results links.
* **Academic Curricula**: B.Tech/M.Tech regulations (R20, R23, R25) and downloadable syllabi.
* **Department Details**: Faculty profiles, laboratory setups, courses offered, student awards.
* **Career & Placements**: Placement percentages, hiring partners, salary packages.
* **Research Output**: Sponsored research projects, Ph.D. scholars, published papers.
* **Campus Facilities**: Hostel wardens roster, digital library timings, sports grounds, dispensary.
* **Student Welfare**: NSS camps, Women Empowerment Cell magazine, startup initiatives, student clubs.
* **Directory & Assistance**: Phone extensions, official emails, transport guide, anti-ragging support.

## 9. Content Management & Quality Assurance

The website is maintained and continuously updated by authorized college personnel under the supervision of the College Principal and Web Administration. Content is strictly verified prior to publication to guarantee authenticity, accuracy, and timeliness.

## 10. Institutional Importance & Value

The redesigned web portal elevates **JNTU-GV College of Engineering Vizianagaram** as a premier technical institution. It serves as the digital front door for national ranking frameworks (NIRF, NAAC, NBA), accreditation bodies, corporate recruiters, prospective students, and international researchers.

## 11. Conclusion & Certification

The official website (`jntugvcev.edu.in`) delivers an organized, high-performance, and accessible digital platform that strengthens institutional communication and supports academic excellence.

---
**Document Prepared & Presented by Development Team**:  
• *Likhith Kumar Mankala* (Developer)  
• *Ch Sai Rupini* (Developer)  
• *P Anitha* (Developer)  
• *P Sai Vamsi* (Developer)  

**Project Guidance & Academic Supervision**:  
• *Sri / Dr. W. Anil Sir* (Assistant Professor / Faculty Coordinator)  
**Institution**: Jawaharlal Nehru Technological University Gurajada Vizianagaram — College of Engineering Vizianagaram  
**Official Website**: `https://jntugvcev.edu.in`
"""


def markdown_to_html_doc3(md_text):
    """
    Generates a high-precision 3-Page printable HTML document specifically tuned
    for exact 3-page PDF output with institutional borders, headers, footers, and page numbers.
    """
    pages_raw = md_text.split('<!-- PAGE ')
    pages_content = []
    
    for p_idx, p in enumerate(pages_raw):
        if not p.strip():
            continue
        # Remove the "1 -->", "2 -->", "3 -->" header
        clean_p = p
        if p_idx > 0:
            clean_p = re.sub(r'^\d+\s*-->\s*', '', p)
        pages_content.append(clean_p)

    def process_inline(text):
        text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
        text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
        text = re.sub(r'`(.*?)`', r'<code>\1</code>', text)
        text = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', text)
        return text

    def format_table(rows):
        if not rows:
            return ""
        out = ['<table class="inst-table">']
        for i, r in enumerate(rows):
            r = r.strip()
            if not r.startswith('|'):
                continue
            cells = [c.strip() for c in r.split('|')[1:-1]]
            if i == 1 and all(set(c).issubset({'-', ':', ' '}) for c in cells):
                continue
            if i == 0:
                out.append('  <thead><tr>')
                for c in cells:
                    out.append(f'    <th>{process_inline(c)}</th>')
                out.append('  </tr></thead><tbody>')
            else:
                out.append('  <tr>')
                for c in cells:
                    out.append(f'    <td>{process_inline(c)}</td>')
                out.append('  </tr>')
        out.append('</tbody></table>')
        return '\n'.join(out)

    rendered_pages = []
    
    for page_num, p_text in enumerate(pages_content, 1):
        lines = p_text.split('\n')
        html_lines = []
        in_table = False
        table_lines = []
        in_code = False
        code_lines = []
        
        i = 0
        while i < len(lines):
            line = lines[i]
            
            if line.startswith('```'):
                if not in_code:
                    in_code = True
                    code_lines = []
                else:
                    in_code = False
                    escaped_code = '\n'.join(code_lines).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    html_lines.append(f'<pre class="code-block"><code>{escaped_code}</code></pre>')
                i += 1
                continue

            if in_code:
                code_lines.append(line)
                i += 1
                continue

            if line.strip().startswith('|') and '|' in line.strip()[1:]:
                if not in_table:
                    in_table = True
                    table_lines = [line]
                else:
                    table_lines.append(line)
                i += 1
                continue
            else:
                if in_table:
                    in_table = False
                    html_lines.append(format_table(table_lines))
                    table_lines = []

            line_str = line.strip()

            if line_str.startswith('# PAGE'):
                # Section marker for page
                p_heading = line_str.replace('# ', '')
                html_lines.append(f'<div class="page-badge">{p_heading}</div>')
            elif line_str.startswith('# '):
                h_text = line_str[2:].strip()
                html_lines.append(f'<div class="doc-cover-header"><h1>{process_inline(h_text)}</h1></div>')
            elif line_str.startswith('## '):
                h_text = line_str[3:].strip()
                html_lines.append(f'<h2 class="section-title">{process_inline(h_text)}</h2>')
            elif line_str.startswith('### '):
                h_text = line_str[4:].strip()
                html_lines.append(f'<h3 class="subsection-title">{process_inline(h_text)}</h3>')
            elif line_str.startswith('---'):
                html_lines.append('<hr class="section-divider" />')
            elif line_str.startswith('- ') or line_str.startswith('* ') or line_str.startswith('• '):
                item = line_str[2:].strip()
                html_lines.append(f'<li class="bullet-item">{process_inline(item)}</li>')
            elif re.match(r'^\d+\.\s+', line_str):
                match = re.match(r'^\d+\.\s+(.*)', line_str)
                item = match.group(1)
                html_lines.append(f'<li class="num-item">{process_inline(item)}</li>')
            elif line_str:
                html_lines.append(f'<p>{process_inline(line_str)}</p>')
            
            i += 1

        if in_table:
            html_lines.append(format_table(table_lines))

        page_body_html = '\n'.join(html_lines)
        rendered_pages.append(f"""
<div class="sheet-page">
  <div class="page-frame-header">
    <div class="inst-heading">Jawaharlal Nehru Technological University Gurajada Vizianagaram</div>
    <div class="inst-subheading">College of Engineering Vizianagaram (JNTU-GV CEV)</div>
    <div class="inst-meta">Dwarapudi, Vizianagaram – 535003, AP, India | Official Web Portal: https://jntugvcev.edu.in</div>
  </div>
  
  <div class="page-body">
    {page_body_html}
  </div>

  <div class="page-footer">
    <span class="foot-left">JNTU-GV CEV Official Website Overview | jntugvcev.edu.in</span>
    <span class="foot-right">Page {page_num} of 3</span>
  </div>
</div>
""")

    html_document = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>JNTU-GV CEV 3-Page Website Overview</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 0;
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  body {{
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    color: #000000;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }}

  .sheet-page {{
    width: 210mm;
    height: 297mm;
    page-break-after: always;
    break-after: page;
    padding: 10mm 12mm 8mm 12mm;
    border: 3.5mm solid #ffffff;
    outline: 2px solid #000000;
    outline-offset: -3.5mm;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }}

  .page-frame-header {{
    text-align: center;
    border-bottom: 1.5px solid #000000;
    padding-bottom: 5px;
    margin-bottom: 8px;
  }}

  .inst-heading {{
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 11pt;
    font-weight: bold;
    letter-spacing: 0.5px;
    margin: 0 0 2px 0;
    text-transform: uppercase;
    color: #000000;
  }}

  .inst-subheading {{
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 9.5pt;
    font-weight: bold;
    margin: 0 0 2px 0;
    color: #111111;
  }}

  .inst-meta {{
    font-size: 7.5pt;
    font-style: italic;
    color: #333333;
  }}

  .page-badge {{
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 8pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    background-color: #f3f4f6;
    border: 1px solid #000000;
    padding: 2px 6px;
    display: inline-block;
    margin-bottom: 6px;
  }}

  .doc-cover-header h1 {{
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 11.5pt;
    margin: 0 0 4px 0;
    text-align: center;
    text-transform: uppercase;
  }}

  .section-title {{
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 9.5pt;
    font-weight: bold;
    border-bottom: 1px solid #000000;
    padding-bottom: 2px;
    margin-top: 8px;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }}

  .subsection-title {{
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 8.5pt;
    font-weight: bold;
    margin-top: 6px;
    margin-bottom: 3px;
  }}

  p {{
    font-size: 8pt;
    line-height: 1.35;
    margin: 0 0 4px 0;
    text-align: justify;
  }}

  .bullet-item, .num-item {{
    font-size: 7.8pt;
    line-height: 1.3;
    margin-bottom: 2.5px;
  }}

  ul, ol {{
    margin: 2px 0 4px 14px;
    padding: 0;
  }}

  /* Tables */
  .inst-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 4px 0 6px 0;
    font-size: 7.5pt;
    line-height: 1.25;
  }}

  .inst-table th, .inst-table td {{
    border: 1px solid #000000;
    padding: 2.5px 4px;
    vertical-align: top;
    text-align: left;
  }}

  .inst-table th {{
    background-color: #e5e7eb;
    font-weight: bold;
    font-family: "Georgia", "Times New Roman", serif;
  }}

  .inst-table tr:nth-child(even) td {{
    background-color: #f9fafb;
  }}

  /* Code / Diagram Block */
  .code-block {{
    background-color: #f3f4f6;
    border: 1px solid #000000;
    padding: 4px 6px;
    font-family: "Consolas", "Courier New", Courier, monospace;
    font-size: 6.8pt;
    line-height: 1.2;
    margin: 4px 0;
    white-space: pre;
    text-align: center;
  }}

  code {{
    font-family: "Consolas", "Courier New", Courier, monospace;
    font-size: 7.5pt;
    background-color: #f3f4f6;
    padding: 1px 2px;
  }}

  .section-divider {{
    border: 0;
    border-top: 1px solid #000000;
    margin: 6px 0;
  }}

  .page-footer {{
    border-top: 1px solid #000000;
    padding-top: 3px;
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
    font-size: 7pt;
    color: #000000;
  }}

  .foot-left {{
    font-style: italic;
    color: #333333;
  }}

  .foot-right {{
    font-weight: bold;
  }}

  a {{
    color: #000000;
    text-decoration: underline;
  }}
</style>
</head>
<body>

{''.join(rendered_pages)}

</body>
</html>"""
    return html_document


def compile_doc3_pdf(html_path, pdf_path):
    chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    if not os.path.exists(chrome_path):
        chrome_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
    
    abs_html = os.path.abspath(html_path)
    abs_pdf = os.path.abspath(pdf_path)

    cmd = [
        chrome_path,
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        '--print-to-pdf=' + abs_pdf,
        abs_html
    ]
    print(f"Executing Chrome Headless PDF export: {pdf_path}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(abs_pdf):
        print(f"  [OK] Successfully compiled: {pdf_path} (Size: {os.path.getsize(abs_pdf):,} bytes)")
        return True
    else:
        print(f"  [FAIL] Failed to compile PDF: {res.stderr}")
        return False


def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    print("=================================================================")
    print(" JNTU-GV CEV 3-PAGE EXECUTIVE OVERVIEW COMPILER (v2.0)")
    print(" Developers: Likhith Kumar Mankala (Developer), Ch Sai Rupini, P Anitha, P Sai Vamsi")
    print(" Guided by: Sri / Dr. W. Anil Sir | Website: jntugvcev.edu.in")
    print("=================================================================\n")

    doc3_md_path = os.path.join(base_dir, "JNTUGV_Document_3_Executive_Website_Overview.md")
    doc3_html_path = os.path.join(base_dir, "scratch", "doc3_render.html")
    doc3_pdf_path = os.path.join(base_dir, "JNTUGV_Document_3_Executive_Website_Overview.pdf")

    print("Generating Document 3: 3-Page Executive Website Overview...")
    doc3_md = get_doc3_markdown()
    with open(doc3_md_path, 'w', encoding='utf-8') as f:
        f.write(doc3_md)
    print(f"  [OK] Markdown written: {doc3_md_path}")

    doc3_html = markdown_to_html_doc3(doc3_md)
    with open(doc3_html_path, 'w', encoding='utf-8') as f:
        f.write(doc3_html)

    compile_doc3_pdf(doc3_html_path, doc3_pdf_path)

    print("\n=================================================================")
    print(" 3-PAGE EXECUTIVE OVERVIEW GENERATED SUCCESSFULLY!")
    print(f" PDF: {doc3_pdf_path}")
    print(f" Markdown: {doc3_md_path}")
    print("=================================================================")


if __name__ == '__main__':
    main()
