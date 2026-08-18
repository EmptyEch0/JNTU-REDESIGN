import os
import sys
import subprocess
import re

from doc1_content import get_doc1_markdown
from doc2_content import get_doc2_markdown

def markdown_to_html(md_text, title, doc_subtitle):
    """
    Converts structured markdown into formal, print-optimized institutional HTML.
    Includes pure white background, rich black ink, institutional page framing borders,
    running header/footer, and dynamic page numbering.
    """
    html_lines = []
    in_table = False
    table_lines = []
    in_code = False
    code_lines = []
    code_lang = ""

    def process_inline(text):
        # Bold
        text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
        # Italic
        text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
        # Inline code
        text = re.sub(r'`(.*?)`', r'<code>\1</code>', text)
        # Links
        text = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', text)
        return text

    def format_table(rows):
        if not rows:
            return ""
        out = ['<table class="inst-table">']
        # Check header
        header_parsed = False
        for i, r in enumerate(rows):
            r = r.strip()
            if not r.startswith('|'):
                continue
            cells = [c.strip() for c in r.split('|')[1:-1]]
            if i == 1 and all(set(c).issubset({'-', ':', ' '}) for c in cells):
                header_parsed = True
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

    lines = md_text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Code block handling
        if line.startswith('```'):
            if not in_code:
                in_code = True
                code_lang = line[3:].strip()
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

        # Table handling
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

        # Headings
        if line_str.startswith('# '):
            h_text = line_str[2:].strip()
            html_lines.append(f'<div class="doc-cover-header"><h1>{process_inline(h_text)}</h1></div>')
        elif line_str.startswith('## '):
            h_text = line_str[3:].strip()
            html_lines.append(f'<h2 class="section-title">{process_inline(h_text)}</h2>')
        elif line_str.startswith('### '):
            h_text = line_str[4:].strip()
            html_lines.append(f'<h3 class="subsection-title">{process_inline(h_text)}</h3>')
        elif line_str.startswith('#### '):
            h_text = line_str[5:].strip()
            html_lines.append(f'<h4 class="subsubsection-title">{process_inline(h_text)}</h4>')
        elif line_str.startswith('> [!IMPORTANT]'):
            html_lines.append('<div class="callout callout-important"><div class="callout-badge">IMPORTANT NOTICE</div>')
            i += 1
            continue
        elif line_str.startswith('> [!NOTE]'):
            html_lines.append('<div class="callout callout-note"><div class="callout-badge">INSTITUTIONAL NOTE</div>')
            i += 1
            continue
        elif line_str.startswith('>'):
            content = line_str[1:].strip()
            html_lines.append(f'<p class="callout-text">{process_inline(content)}</p></div>')
        elif line_str.startswith('---'):
            html_lines.append('<hr class="section-divider" />')
        elif line_str.startswith('- [x]') or line_str.startswith('* [x]'):
            item = line_str[5:].strip()
            html_lines.append(f'<div class="checklist-item checked"><span class="box">☑</span> {process_inline(item)}</div>')
        elif line_str.startswith('- [ ]') or line_str.startswith('* [ ]'):
            item = line_str[5:].strip()
            html_lines.append(f'<div class="checklist-item"><span class="box">☐</span> {process_inline(item)}</div>')
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

    body_content = '\n'.join(html_lines)

    html_document = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{title}</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 12mm 12mm 15mm 12mm;
    @top-center {{
      content: "JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY GURAJADA VIZIANAGARAM — COLLEGE OF ENGINEERING";
      font-family: "Georgia", "Times New Roman", serif;
      font-size: 7.5pt;
      color: #000000;
      border-bottom: 1px solid #000000;
      padding-bottom: 3px;
      margin-bottom: 5mm;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    @bottom-left {{
      content: "{title} | jntugvcev.edu.in";
      font-family: "Arial", sans-serif;
      font-size: 7.5pt;
      color: #333333;
      border-top: 1px solid #000000;
      padding-top: 3px;
    }}
    @bottom-right {{
      content: "Page " counter(page) " of " counter(pages);
      font-family: "Arial", sans-serif;
      font-weight: bold;
      font-size: 7.5pt;
      color: #000000;
      border-top: 1px solid #000000;
      padding-top: 3px;
    }}
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  body {{
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    font-size: 9.5pt;
    line-height: 1.5;
    color: #000000;
    background-color: #ffffff;
    margin: 0;
    padding: 10px 14px;
    border: 2px solid #000000;
    min-height: 270mm;
  }}

  /* Page Framing & Inner Border Accent */
  .page-frame-header {{
    text-align: center;
    border-bottom: 2px solid #000000;
    padding-bottom: 10px;
    margin-bottom: 16px;
  }}

  .inst-heading {{
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 13pt;
    font-weight: bold;
    letter-spacing: 0.8px;
    margin: 0 0 4px 0;
    text-transform: uppercase;
    color: #000000;
  }}

  .inst-subheading {{
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 10.5pt;
    font-weight: 600;
    margin: 0 0 6px 0;
    color: #222222;
  }}

  .doc-title-box {{
    border: 1.5px solid #000000;
    background-color: #f8f9fa;
    padding: 8px 12px;
    margin: 10px 0 16px 0;
    text-align: center;
  }}

  .doc-title-box h1 {{
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 13pt;
    margin: 0 0 4px 0;
    color: #000000;
    letter-spacing: 0.5px;
  }}

  .doc-title-box p {{
    font-size: 8.5pt;
    margin: 0;
    font-weight: 500;
    color: #222222;
  }}

  h1, h2, h3, h4 {{
    color: #000000;
    font-family: "Georgia", "Times New Roman", serif;
    page-break-after: avoid;
    break-after: avoid;
  }}

  .section-title {{
    font-size: 11pt;
    font-weight: bold;
    border-bottom: 1.5px solid #000000;
    padding-bottom: 3px;
    margin-top: 18px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    page-break-after: avoid;
  }}

  .subsection-title {{
    font-size: 10pt;
    font-weight: bold;
    margin-top: 14px;
    margin-bottom: 6px;
    color: #111111;
    page-break-after: avoid;
  }}

  .subsubsection-title {{
    font-size: 9.5pt;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 4px;
    color: #222222;
    page-break-after: avoid;
  }}

  p {{
    margin: 0 0 6px 0;
    text-align: justify;
  }}

  /* Table Formatting */
  .inst-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 14px 0;
    font-size: 8.5pt;
    page-break-inside: auto;
    break-inside: auto;
  }}

  .inst-table tr {{
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  .inst-table th, .inst-table td {{
    border: 1px solid #000000;
    padding: 4px 6px;
    vertical-align: top;
    text-align: left;
  }}

  .inst-table th {{
    background-color: #e5e7eb;
    font-weight: bold;
    color: #000000;
    font-family: "Georgia", "Times New Roman", serif;
  }}

  .inst-table tr:nth-child(even) td {{
    background-color: #f9fafb;
  }}

  /* Code Block Formatting */
  .code-block {{
    background-color: #f3f4f6;
    border: 1px solid #000000;
    padding: 8px;
    font-family: "Consolas", "Courier New", Courier, monospace;
    font-size: 7.5pt;
    line-height: 1.35;
    margin: 8px 0 12px 0;
    white-space: pre-wrap;
    word-break: break-all;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  code {{
    font-family: "Consolas", "Courier New", Courier, monospace;
    font-size: 8pt;
    background-color: #f3f4f6;
    border: 0.5px solid #cccccc;
    padding: 1px 3px;
  }}

  /* Callout & Alert Boxes */
  .callout {{
    border: 1.5px solid #000000;
    background-color: #f9fafb;
    padding: 8px 10px;
    margin: 10px 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  .callout-badge {{
    font-size: 8pt;
    font-weight: bold;
    font-family: "Georgia", "Times New Roman", serif;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #000000;
    display: inline-block;
    padding-bottom: 1px;
  }}

  .callout-text {{
    margin: 0;
    font-size: 8.5pt;
  }}

  .section-divider {{
    border: 0;
    border-top: 1px solid #000000;
    margin: 14px 0;
  }}

  .bullet-item, .num-item {{
    margin-bottom: 3px;
    font-size: 9pt;
  }}

  ul, ol {{
    margin: 4px 0 8px 16px;
    padding: 0;
  }}

  .checklist-item {{
    font-size: 8.5pt;
    margin-bottom: 3px;
  }}

  .checklist-item .box {{
    font-weight: bold;
    font-size: 10pt;
    margin-right: 4px;
  }}

  a {{
    color: #000000;
    text-decoration: underline;
  }}
</style>
</head>
<body>

<div class="page-frame-header">
  <div class="inst-heading">Jawaharlal Nehru Technological University Gurajada Vizianagaram</div>
  <div class="inst-subheading">College of Engineering Vizianagaram (JNTU-GV CEV)</div>
  <div style="font-size: 8pt; font-style: italic; color: #333333;">Dwarapudi, Vizianagaram – 535003, Andhra Pradesh, India | Official Web Portal: https://jntugvcev.edu.in</div>
</div>

<div class="doc-title-box">
  <h1>{title}</h1>
  <p>{doc_subtitle}</p>
</div>

{body_content}

</body>
</html>"""
    return html_document


def compile_pdf_via_chrome(html_path, pdf_path):
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
    print(" JNTU-GV CEV OFFICIAL HANDOVER DOCUMENTATION COMPILER (v2.0)")
    print(" Developers: Likhith Kumar Mankala, Ch Sai Rupini, P Anitha, P Sai Vamsi")
    print(" Guided by: Sri / Dr. W. Anil Sir | Website: jntugvcev.edu.in")
    print("=================================================================\n")

    # Document 1: Technical System Handover & Maintenance Documentation
    doc1_md_path = os.path.join(base_dir, "JNTUGV_Document_1_Technical_Handover.md")
    doc1_html_path = os.path.join(base_dir, "scratch", "doc1_render.html")
    doc1_pdf_path = os.path.join(base_dir, "JNTUGV_Document_1_Technical_Handover.pdf")

    print("[1/2] Generating Document 1: Technical System Handover Documentation...")
    doc1_md = get_doc1_markdown()
    with open(doc1_md_path, 'w', encoding='utf-8') as f:
        f.write(doc1_md)
    print(f"  [OK] Markdown written: {doc1_md_path}")

    doc1_html = markdown_to_html(
        doc1_md,
        "DOCUMENT 1 — TECHNICAL SYSTEM HANDOVER & MAINTENANCE DOCUMENTATION",
        "Comprehensive Architecture, Technology Stack, 99 Database Tables, 85+ Routes, RAG AI Engine & Maintenance Manual"
    )
    with open(doc1_html_path, 'w', encoding='utf-8') as f:
        f.write(doc1_html)
    compile_pdf_via_chrome(doc1_html_path, doc1_pdf_path)

    print("\n-----------------------------------------------------------------\n")

    # Document 2: Website User, Administration & Operational Handover Manual
    doc2_md_path = os.path.join(base_dir, "JNTUGV_Document_2_User_and_Admin_Manual.md")
    doc2_html_path = os.path.join(base_dir, "scratch", "doc2_render.html")
    doc2_pdf_path = os.path.join(base_dir, "JNTUGV_Document_2_User_and_Admin_Manual.pdf")

    print("[2/2] Generating Document 2: Website User & Administration Manual...")
    doc2_md = get_doc2_markdown()
    with open(doc2_md_path, 'w', encoding='utf-8') as f:
        f.write(doc2_md)
    print(f"  [OK] Markdown written: {doc2_md_path}")

    doc2_html = markdown_to_html(
        doc2_md,
        "DOCUMENT 2 — WEBSITE USER, ADMINISTRATION & OPERATIONAL HANDOVER MANUAL",
        "Official User Guide, HOD & Faculty CMS Manual, Notice Publishing, RACI Matrix & Operations Schedule"
    )
    with open(doc2_html_path, 'w', encoding='utf-8') as f:
        f.write(doc2_html)
    compile_pdf_via_chrome(doc2_html_path, doc2_pdf_path)

    print("\n=================================================================")
    print(" ALL INSTITUTIONAL HANDOVER DOCUMENTS GENERATED SUCCESSFULLY!")
    print(" Delivered Files:")
    print(f" 1. {doc1_pdf_path}")
    print(f" 2. {doc1_md_path}")
    print(f" 3. {doc2_pdf_path}")
    print(f" 4. {doc2_md_path}")
    print("=================================================================")



if __name__ == '__main__':
    main()
