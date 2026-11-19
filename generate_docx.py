import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_margins(cell, top=50, bottom=50, left=100, right=100):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_heading_with_bottom_border(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text.upper())
    run.font.name = 'Calibri'
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42) # Slate 900
    
    # Add bottom border to paragraph
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(r'<w:pBdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
                     r'<w:bottom w:val="single" w:sz="6" w:space="2" w:color="CBD5E1"/>'
                     r'</w:pBdr>')
    pPr.append(pBdr)
    return p

def create_resume():
    doc = Document()
    
    # Page setup - 0.5 in margins
    for section in doc.sections:
        section.top_margin = Inches(0.5)
        section.bottom_margin = Inches(0.5)
        section.left_margin = Inches(0.55)
        section.right_margin = Inches(0.55)
    
    # Set default style font
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(9.5)
    font.color.rgb = RGBColor(30, 41, 59) # Slate 800
    
    # ---------------- HEADER ----------------
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(1)
    run_name = p_name.add_run("SHIVAM SHRIVASTAVA")
    run_name.font.size = Pt(18)
    run_name.font.bold = True
    run_name.font.color.rgb = RGBColor(15, 23, 42)
    
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(3)
    run_title = p_title.add_run("Senior Software Engineer  •  Enterprise Java & Distributed Microservices Architect")
    run_title.font.size = Pt(10)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(2, 132, 199) # Sky 600
    
    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_contact.paragraph_format.space_before = Pt(0)
    p_contact.paragraph_format.space_after = Pt(6)
    
    # Contact items
    items = [
        ("shivam.s0116@gmail.com", "mailto:shivam.s0116@gmail.com"),
        ("+91 7047280653", None),
        ("linkedin.com/in/shivam1939", "https://linkedin.com/in/shivam1939")
    ]
    for i, (text, url) in enumerate(items):
        r = p_contact.add_run(text)
        r.font.size = Pt(9)
        if url:
            r.font.color.rgb = RGBColor(37, 99, 235)
        else:
            r.font.color.rgb = RGBColor(71, 85, 105)
        if i < len(items) - 1:
            r_sep = p_contact.add_run("   |   ")
            r_sep.font.size = Pt(9)
            r_sep.font.color.rgb = RGBColor(148, 163, 184)
            
    # ---------------- SUMMARY ----------------
    add_heading_with_bottom_border(doc, "Professional Summary")
    p_sum = doc.add_paragraph()
    p_sum.paragraph_format.space_before = Pt(3)
    p_sum.paragraph_format.space_after = Pt(4)
    p_sum.paragraph_format.line_spacing = 1.15
    
    sum_parts = [
        ("Results-driven Senior Software Engineer with ", False),
        ("6+ years", True),
        (" of expertise in designing and deploying high-throughput, low-latency enterprise microservices and distributed backend systems. Deep specialization in ", False),
        ("Java 21", True),
        (", ", False),
        ("Spring Boot", True),
        (", ", False),
        ("REST APIs", True),
        (", ", False),
        ("Hibernate/JPA", True),
        (", and containerized deployments on ", False),
        ("Kubernetes", True),
        (" and ", False),
        ("AWS", True),
        (". Proven delivery across global hospitality platforms (Marriott), supply chain execution (Manhattan Associates), and fintech systems. Passionate about clean architecture, test automation, and robust production observability.", False)
    ]
    for text, bold in sum_parts:
        r = p_sum.add_run(text)
        r.font.size = Pt(9.2)
        r.bold = bold
        
    # ---------------- SKILLS ----------------
    add_heading_with_bottom_border(doc, "Technical Skills")
    
    skills = [
        ("Languages:", "Java (8, 11, 17, 21), C++, SQL, JavaScript, HTML5, CSS3"),
        ("Frameworks & Architecture:", "Spring Boot, Spring MVC, Spring Security, Hibernate ORM, JPA, Microservices Architecture, RESTful Web Services, JUnit, Mockito, Maven, Gradle"),
        ("Cloud, DevOps & CI/CD:", "Kubernetes, Docker, AWS (Lambda, S3), Jenkins, Harness CI/CD, Git, Linux/Unix, Agile/Scrum"),
        ("Databases & Messaging:", "MySQL, PostgreSQL, MongoDB, Oracle SQL, Redis Cache, Apache Kafka, Elasticsearch"),
        ("Observability & Tools:", "Datadog, ELK Stack, JIRA, Postman, IntelliJ IDEA, Eclipse, PuTTY")
    ]
    
    table = doc.add_table(rows=len(skills), cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    col_widths = [Inches(1.8), Inches(5.6)]
    for row_idx, (cat, val) in enumerate(skills):
        row = table.rows[row_idx]
        cell_0 = row.cells[0]
        cell_1 = row.cells[1]
        
        cell_0.width = col_widths[0]
        cell_1.width = col_widths[1]
        
        set_cell_margins(cell_0, top=20, bottom=20, left=40, right=40)
        set_cell_margins(cell_1, top=20, bottom=20, left=40, right=40)
        
        p0 = cell_0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(1)
        p0.paragraph_format.space_after = Pt(1)
        r0 = p0.add_run(cat)
        r0.font.bold = True
        r0.font.size = Pt(8.8)
        r0.font.color.rgb = RGBColor(15, 23, 42)
        
        p1 = cell_1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(1)
        p1.paragraph_format.space_after = Pt(1)
        r1 = p1.add_run(val)
        r1.font.size = Pt(8.8)
        r1.font.color.rgb = RGBColor(51, 65, 85)
        
    # ---------------- EXPERIENCE ----------------
    add_heading_with_bottom_border(doc, "Professional Experience")
    
    def add_job(role, company_loc, date, bullets, tech_stack=None):
        # Header row (Role and Date)
        p_role = doc.add_paragraph()
        p_role.paragraph_format.space_before = Pt(4)
        p_role.paragraph_format.space_after = Pt(1)
        p_role.paragraph_format.keep_with_next = True
        
        r_role = p_role.add_run(role)
        r_role.font.bold = True
        r_role.font.size = Pt(9.5)
        r_role.font.color.rgb = RGBColor(15, 23, 42)
        
        r_space = p_role.add_run("\t" * 3) # Or right align via table / tab stop
        
        # We can use a 1-row 2-col borderless table for role and date for perfect alignment
        # Let's replace p_role with a 1-row table:
        p_role._p.getparent().remove(p_role._p)
        
        header_tbl = doc.add_table(rows=1, cols=2)
        header_tbl.autofit = False
        header_tbl.rows[0].cells[0].width = Inches(5.4)
        header_tbl.rows[0].cells[1].width = Inches(2.0)
        
        p_left = header_tbl.rows[0].cells[0].paragraphs[0]
        p_left.paragraph_format.space_before = Pt(3)
        p_left.paragraph_format.space_after = Pt(0)
        r_l = p_left.add_run(role)
        r_l.font.bold = True
        r_l.font.size = Pt(9.5)
        r_l.font.color.rgb = RGBColor(15, 23, 42)
        
        p_right = header_tbl.rows[0].cells[1].paragraphs[0]
        p_right.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_right.paragraph_format.space_before = Pt(3)
        p_right.paragraph_format.space_after = Pt(0)
        r_r = p_right.add_run(date)
        r_r.font.bold = True
        r_r.font.size = Pt(8.8)
        r_r.font.color.rgb = RGBColor(71, 85, 105)
        
        # Sub-header: Company
        p_comp = doc.add_paragraph()
        p_comp.paragraph_format.space_before = Pt(0)
        p_comp.paragraph_format.space_after = Pt(2)
        p_comp.paragraph_format.keep_with_next = True
        r_c = p_comp.add_run(company_loc)
        r_c.font.size = Pt(8.8)
        r_c.font.color.rgb = RGBColor(2, 132, 199)
        r_c.font.bold = True
        
        # Bullets
        for b_runs in bullets:
            bp = doc.add_paragraph(style='List Bullet')
            bp.paragraph_format.space_before = Pt(0)
            bp.paragraph_format.space_after = Pt(1.5)
            bp.paragraph_format.line_spacing = 1.1
            for text, bold in b_runs:
                r = bp.add_run(text)
                r.font.size = Pt(8.8)
                r.bold = bold
                r.font.color.rgb = RGBColor(30, 41, 59)
                
        # Tech stack
        if tech_stack:
            p_tech = doc.add_paragraph()
            p_tech.paragraph_format.space_before = Pt(1)
            p_tech.paragraph_format.space_after = Pt(4)
            r_t1 = p_tech.add_run("Tech Stack: ")
            r_t1.bold = True
            r_t1.font.size = Pt(8.5)
            r_t1.font.color.rgb = RGBColor(71, 85, 105)
            r_t2 = p_tech.add_run(tech_stack)
            r_t2.font.size = Pt(8.5)
            r_t2.font.color.rgb = RGBColor(71, 85, 105)

    # Job 1: Accenture
    add_job(
        "Senior Software Engineer / Application Development Senior Analyst",
        "Accenture (Marriott Account) • India",
        "Dec 2023 – Present",
        [
            [("Architect and scale high-throughput ", False), ("Java 21", True), (" microservices powering Marriott International’s global offer management and rate plan engines deployed on ", False), ("Kubernetes", True), (".", False)],
            [("Engineered low-latency RESTful APIs handling high daily request volumes with sub-second response times and 99.95%+ uptime.", False)],
            [("Integrated serverless workflows with ", False), ("AWS Lambda", True), (" and Amazon S3 for asynchronous pipeline event processing.", False)],
            [("Designed and maintained automated CI/CD build and release pipelines utilizing ", False), ("Jenkins", True), (" and ", False), ("Harness", True), (", cutting deployment cycles by 35%.", False)],
            [("Spearheaded distributed tracing, metric alerting, and production diagnostics using ", False), ("Datadog", True), (" and ", False), ("ELK Stack", True), (".", False)]
        ],
        "Java 21, Spring Boot, Microservices, Kubernetes, AWS Lambda, Docker, Jenkins, Harness, Datadog"
    )

    # Job 2: Manhattan
    add_job(
        "Software Engineer, R&D — WMOS",
        "Manhattan Associates • Bengaluru, India",
        "May 2022 – May 2023",
        [
            [("Engineered core modules for global Warehouse Management Systems (WMOS) using ", False), ("Spring Boot", True), (", ", False), ("Spring MVC", True), (", and ", False), ("REST APIs", True), (", optimizing picking and packing inventory flows.", False)],
            [("Customized modular UI components in Inventory Management to track cartons, reserve locations, and zones in real time.", False)],
            [("Streamlined CI/CD deployment workflows via ", False), ("Jenkins", True), (" with automated regression suites for reliable releases.", False)],
            [("Honored with both the ", False), ("Rising Star Award", True), (" and the ", False), ("Star of the Quarter Award", True), (" for technical delivery excellence.", False)]
        ],
        "Spring Boot, Spring MVC, REST APIs, Jenkins, Oracle SQL, J2EE, Microservices"
    )

    # Job 3: BETTER
    add_job(
        "Software Engineer",
        "BETTER, BMTG Advisors India Pvt. Ltd • India",
        "Oct 2021 – Mar 2022",
        [
            [("Developed enterprise web applications leveraging ", False), ("Java/J2EE", True), (", ", False), ("JSP", True), (", ", False), ("Servlets", True), (", ", False), ("Spring Boot", True), (", and ", False), ("Hibernate ORM", True), (".", False)],
            [("Resolved critical production bugs, optimized SQL queries, and sustained a ", False), ("95%+ operational KPI", True), (" score.", False)]
        ],
        "Java, Spring Boot, Hibernate, JSP, Servlets, MySQL"
    )

    # Job 4: BYJU'S
    add_job(
        "Sr. Business Development Associate",
        "BYJU'S (Think & Learn Pvt. Ltd.) • India",
        "Jun 2019 – Jan 2021",
        [
            [("Facilitated end-to-end client engagement pipelines, analyzed conversion funnels, and optimized onboarding workflows across cross-functional teams; received multiple leadership awards.", False)]
        ]
    )

    # ---------------- EDUCATION ----------------
    add_heading_with_bottom_border(doc, "Education")
    
    edu_tbl = doc.add_table(rows=2, cols=1)
    edu_tbl.autofit = False
    
    edus = [
        ("Bachelor of Engineering (B.E.) — Mechanical Engineering", "SVITS Indore (RGPV University) • 2014 – 2018 • CGPA: 7.15 / 10"),
        ("Higher Secondary Certificate (HSC) — Class XII (CBSE)", "Kendriya Vidyalaya School, Satna • 2011 – 2013 • 81% (PCM + CS) • Class X: 8.6 CGPA")
    ]
    for idx, (deg, meta) in enumerate(edus):
        cell = edu_tbl.rows[idx].cells[0]
        set_cell_margins(cell, top=20, bottom=20, left=20, right=20)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(1)
        r_deg = p.add_run(deg)
        r_deg.bold = True
        r_deg.font.size = Pt(8.8)
        r_deg.font.color.rgb = RGBColor(15, 23, 42)
        
        p_m = cell.add_paragraph()
        p_m.paragraph_format.space_before = Pt(0)
        p_m.paragraph_format.space_after = Pt(2)
        r_meta = p_m.add_run(meta)
        r_meta.font.size = Pt(8.5)
        r_meta.font.color.rgb = RGBColor(71, 85, 105)

    # ---------------- CERTIFICATIONS ----------------
    add_heading_with_bottom_border(doc, "Certifications & Credentials")
    
    certs = [
        "Complete Java Certification Course (OOP, Concurrency, Multithreading)",
        "Spring & Hibernate (Spring Boot & Microservices Architecture)",
        "C++: From Beginner to Expert (STL, Memory Management)",
        "SQL for Beginners: MySQL & Relational Database Design"
    ]
    p_cert = doc.add_paragraph()
    p_cert.paragraph_format.space_before = Pt(2)
    p_cert.paragraph_format.space_after = Pt(2)
    p_cert.paragraph_format.line_spacing = 1.15
    for i, c in enumerate(certs):
        r = p_cert.add_run("• " + c + ("   |   " if i < len(certs) - 1 else ""))
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(51, 65, 85)
        
    doc.save("Shivam_Shrivastava_Resume.docx")
    doc.save("ShivamRESUME_.docx")
    print("Successfully generated Shivam_Shrivastava_Resume.docx and ShivamRESUME_.docx")

if __name__ == "__main__":
    create_resume()
