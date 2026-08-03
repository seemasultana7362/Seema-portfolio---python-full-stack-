import http.server
import socketserver
import json
import sqlite3
import re
import os
import sys
import logging
from urllib.parse import parse_qs, urlparse

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("python_backend")

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "portfolio.db")

def init_db():
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
    logger.info("SQLite database initialized successfully at %s", DB_FILE)

init_db()

# Static Data for Portfolio REST endpoints
PROJECTS_DATA = [
    {
        "id": "cognitive-compass",
        "title": "Cognitive Compass",
        "category": "AI • Multi-Agent Systems",
        "summary": "An AI-powered developer assistance platform that detects cognitive load, explains complex code visually, and preserves engineering knowledge for teams.",
        "problem": "Modern software projects become increasingly difficult to understand as systems grow in complexity. Developers often lose time understanding unfamiliar codebases, switching context, and repeatedly solving the same problems because organizational knowledge is scattered.",
        "solution": "Cognitive Compass addresses these challenges by using a multi-agent AI architecture that identifies signs of developer confusion, generates visual explanations of complex code, and preserves technical knowledge in a searchable system that future developers can access.",
        "technologies": [
            "React", "TypeScript", "Node.js", "GraphQL", "AWS Lambda", "Amazon Bedrock", "Amazon SageMaker", "Multi-Agent AI"
        ],
        "highlights": [
            "Detects developer confusion in real time",
            "Generates visual explanations for complex code",
            "Creates a searchable organizational memory",
            "Designed around AI-assisted software engineering workflows"
        ],
        "imageLabel": "Project Screenshot Placeholder",
        "imageNote": "Replace with Cognitive Compass dashboard image",
        "github": "https://github.com/seemasultana",
        "demo": "#"
    },
    {
        "id": "customer-churn-prediction",
        "title": "Customer Churn Prediction using Explainable Machine Learning",
        "category": "Machine Learning",
        "summary": "An explainable machine learning pipeline that predicts customer churn while helping businesses understand why customers leave.",
        "problem": "Traditional churn prediction models often generate predictions without explaining the reasons behind them, making it difficult for businesses to design meaningful customer retention strategies.",
        "solution": "Developed an explainable machine learning pipeline using SHAP to identify the most influential churn factors and presented insights through an interactive Streamlit dashboard to support data-driven business decisions.",
        "technologies": [
            "Python", "Pandas", "NumPy", "Scikit-learn", "XGBoost", "SHAP", "Matplotlib", "Seaborn", "Streamlit"
        ],
        "highlights": [
            "Data cleaning and preprocessing",
            "Feature engineering",
            "Explainable AI using SHAP",
            "Interactive dashboard for business insights"
        ],
        "imageLabel": "Customer Churn Dashboard Placeholder",
        "imageNote": "Replace with Streamlit churn analytics view",
        "github": "https://github.com/seemasultana",
        "demo": "#"
    },
    {
        "id": "developer-portfolio-website",
        "title": "Developer Portfolio Website",
        "category": "Full Stack Web Development",
        "summary": "A modern personal portfolio built using contemporary web technologies with authentication and backend integration.",
        "problem": "Creating a portfolio that effectively represents technical skills requires balancing performance, design, responsiveness, maintainability, and scalability.",
        "solution": "Built a responsive portfolio application using Next.js and TypeScript with FastAPI backend integration, PostgreSQL database support, OAuth authentication, and a modern component-based architecture.",
        "technologies": [
            "Next.js", "TypeScript", "Tailwind CSS", "FastAPI", "PostgreSQL", "OAuth"
        ],
        "highlights": [
            "Modern responsive UI",
            "Backend API integration",
            "Secure authentication",
            "Scalable architecture"
        ],
        "imageLabel": "Portfolio Preview Placeholder",
        "imageNote": "Replace with live portfolio application preview",
        "github": "https://github.com/seemasultana",
        "demo": "#"
    }
]

SKILLS_DATA = [
    {
        "category": "Languages",
        "skills": ["Python", "Java", "SQL", "TypeScript", "JavaScript"]
    },
    {
        "category": "Frontend",
        "skills": ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS"]
    },
    {
        "category": "Backend",
        "skills": ["FastAPI", "Django", "Flask", "REST APIs"]
    },
    {
        "category": "Databases",
        "skills": ["PostgreSQL", "MySQL"]
    },
    {
        "category": "AI / Machine Learning",
        "skills": ["NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "LangChain"]
    },
    {
        "category": "DevOps & Tools",
        "skills": ["Git", "GitHub", "GitHub Actions", "Docker"]
    },
    {
        "category": "Soft Skills",
        "skills": ["Leadership", "Event Management", "Writing", "Public Speaking", "Time Management"]
    }
]

EXPERIENCE_DATA = [
    {
        "id": "aws-co-lead",
        "organization": "AWS Student Builder Group",
        "role": "Co-Lead",
        "duration": "May 2026 – Present",
        "location": "Bengaluru, India",
        "description": [
            "Completed multiple technical certifications through Study Jam activities to strengthen knowledge across cloud and development technologies.",
            "Contributed to Python full-stack projects involving HTML, CSS, and database integration.",
            "Collaborated with peers through technical learning initiatives and community activities."
        ],
        "technologies": ["Python", "HTML", "CSS", "Databases", "AWS"]
    },
    {
        "id": "embrizon-intern",
        "organization": "Embrizon Technologies",
        "role": "Data Science with AI Intern",
        "duration": "February 2026 – April 2026",
        "location": "Remote",
        "description": [
            "Worked on a Customer Churn Prediction project involving data cleaning and feature engineering.",
            "Trained classification models including Logistic Regression, Random Forest, and XGBoost.",
            "Emphasized practical machine learning workflows and explainable data analytics."
        ],
        "technologies": ["Python", "Scikit-learn", "XGBoost", "Machine Learning", "Data Analysis"]
    }
]

EDUCATION_DATA = [
    {
        "institution": "HKBK College of Engineering",
        "qualification": "Bachelor of Engineering — Computer Science & Engineering",
        "affiliation": "VTU",
        "duration": "September 2023 – Present",
        "score": "8.25 GPA",
        "description": "Currently pursuing a Bachelor's degree with a focus on software engineering, artificial intelligence, machine learning, and modern web technologies while actively participating in technical communities and projects."
    },
    {
        "institution": "Presidency PU College",
        "qualification": "Class 12 (State Board)",
        "duration": "2021",
        "score": "92.5%",
        "description": "Completed higher secondary education with strong academic performance, building a foundation for engineering studies."
    },
    {
        "institution": "SVN English High School",
        "qualification": "Class 10 (State Board)",
        "duration": "2019",
        "score": "91.04%",
        "description": "Completed secondary education with distinction and developed a strong interest in mathematics, logical reasoning, and technology."
    }
]

ACHIEVEMENTS_DATA = [
    {
        "badge": "1st Place",
        "title": "ELECTROLYTHON National Level Hackathon",
        "date": "September 2025",
        "description": "Secured top position for developing an innovative technology solution under competitive constraints."
    },
    {
        "badge": "Top 6 Finalist",
        "title": "Gen-AI Hackathon",
        "date": "May 2026",
        "description": "Recognized among top teams for building generative AI applications with practical utility."
    },
    {
        "badge": "Shortlisted",
        "title": "Google Build with AI (Bangalore)",
        "date": "June 2026",
        "description": "Selected among top student innovators to participate in Google's flagship AI building event."
    }
]

class PortfolioAPIHandler(http.server.BaseHTTPRequestHandler):

    def _send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        logger.info("GET %s", path)

        if path in ["/api/health", "/health"]:
            self._send_json({
                "status": "ok",
                "service": "FastAPI/Python Portfolio Backend",
                "database": "SQLite PostgreSQL-ready"
            })
        elif path == "/api/projects":
            self._send_json({"success": True, "data": PROJECTS_DATA})
        elif path == "/api/skills":
            self._send_json({"success": True, "data": SKILLS_DATA})
        elif path == "/api/experience":
            self._send_json({"success": True, "data": EXPERIENCE_DATA})
        elif path == "/api/education":
            self._send_json({"success": True, "data": EDUCATION_DATA})
        elif path == "/api/achievements":
            self._send_json({"success": True, "data": ACHIEVEMENTS_DATA})
        elif path == "/api/contact/messages":
            try:
                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute("SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY created_at DESC")
                rows = cursor.fetchall()
                conn.close()
                messages = [
                    {"id": r[0], "name": r[1], "email": r[2], "subject": r[3], "message": r[4], "created_at": r[5]}
                    for r in rows
                ]
                self._send_json({"success": True, "data": messages})
            except Exception as e:
                logger.error("Database query failed: %s", str(e))
                self._send_json({"success": False, "error": str(e)}, status=500)
        else:
            self._send_json({"success": False, "message": "Endpoint not found"}, status=404)

    def do_POST(self):
        path = urlparse(self.path).path
        logger.info("POST %s", path)

        if path == "/api/contact":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                raw_data = self.rfile.read(content_length).decode("utf-8")
                payload = json.loads(raw_data)

                name = str(payload.get("name", "")).strip()
                email = str(payload.get("email", "")).strip()
                subject = str(payload.get("subject", "")).strip()
                message = str(payload.get("message", "")).strip()

                # Basic validation
                if not name or not email or not subject or not message:
                    self._send_json({
                        "success": False,
                        "error": "All fields (name, email, subject, message) are required."
                    }, status=400)
                    return

                email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
                if not re.match(email_regex, email):
                    self._send_json({
                        "success": False,
                        "error": "Please provide a valid email address."
                    }, status=400)
                    return

                # Save into SQLite database
                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
                    (name, email, subject, message)
                )
                msg_id = cursor.lastrowid
                conn.commit()
                conn.close()

                logger.info("New contact message received ID %d from %s (%s)", msg_id, name, email)

                self._send_json({
                    "success": True,
                    "message": "Thank you for getting in touch! Your message has been received.",
                    "id": msg_id
                }, status=201)

            except Exception as e:
                logger.error("Failed to process contact form POST: %s", str(e))
                self._send_json({
                    "success": False,
                    "error": "Failed to process request on server."
                }, status=500)
        else:
            self._send_json({"success": False, "message": "Endpoint not found"}, status=404)

def run(port=8000):
    handler = PortfolioAPIHandler
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", port), handler) as httpd:
        logger.info("Python Portfolio REST API running on http://0.0.0.0:%d", port)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            logger.info("Shutting down Python server...")

if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run(port=port)
