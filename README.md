<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Quince Nutrition & Consultancy

A professional full-stack web application for Quince Nutrition and Consultancy Ltd, featuring wellness programs, health condition management, nutrition services, and a CMS-powered blog.

## 🏗 Project Structure

```
quince-nutrition/
├── apps/                      # Django applications
│   ├── contacts/             # Contact form & Airtable integration
│   ├── inventory/            # Product management (future)
│   └── core/                 # Shared utilities & middleware
├── frontend/                  # React/Vite application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript definitions
│   │   ├── config/          # App configuration
│   │   └── lib/             # Utilities (Sanity, etc.)
│   ├── sanity/              # Sanity CMS schemas
│   └── .env.example         # Frontend env template
├── quince_project/           # Django project settings
│   └── settings/
│       ├── base.py          # Base settings
│       ├── dev.py           # Development overrides
│       └── prod.py          # Production overrides
├── requirements/             # Python dependencies
│   ├── base.txt            # Core dependencies
│   ├── dev.txt             # Development tools
│   └── prod.txt            # Production packages
├── .env.example             # Backend env template
└── manage.py               # Django CLI

```

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** (with npm or pnpm)
- **PostgreSQL** (optional, SQLite works for development)

### Backend Setup (Django)

1. **Create and activate a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt  # Or requirements/dev.txt
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values:
   # - DJANGO_SECRET_KEY
   # - AIRTABLE_BASE_ID & AIRTABLE_ACCESS_TOKEN
   # - EMAIL_* settings for SMTP
   ```

4. **Run migrations:**

   ```bash
   python manage.py migrate
   ```

5. **Create a superuser (optional):**

   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

The Django API will be available at `http://localhost:8000`

### Frontend Setup (React/Vite)

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install  # Or: pnpm install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   # Edit frontend/.env with your values:
   # - VITE_SANITY_PROJECT_ID
   # - VITE_SANITY_DATASET
   # - VITE_API_URL (defaults to http://localhost:8000)
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The React app will be available at `http://localhost:3000`  
It's configured to proxy `/api` requests to the Django backend.

### Sanity CMS Setup

1. **Start Sanity Studio:**

   ```bash
   cd frontend
   npm run sanity
   ```

2. **Deploy Sanity Studio (optional):**
   ```bash
   npm run sanity:deploy
   ```

See [SANITY_SETUP.md](SANITY_SETUP.md) for detailed CMS documentation.

## 🔐 Security & Configuration

### Environment Variables

**Backend (`.env` in project root):**

- Never commit secrets to version control
- All sensitive values read from environment
- Use `DJANGO_SETTINGS_MODULE` to switch between dev/prod

**Frontend (`frontend/.env`):**

- Only `VITE_*` prefixed variables are exposed to the browser
- **Never** put API keys or secrets in frontend env files
- For sensitive operations, proxy through the backend API

### API Key Safety

✅ **Safe:**

- Sanity project ID (public)
- API URLs
- Public app configuration

❌ **Unsafe (never expose in frontend):**

- Database credentials
- Email passwords
- Airtable access tokens
- Any authentication secrets

## 📦 Building for Production

### Backend

```bash
# Install production dependencies
pip install -r requirements/prod.txt

# Set production environment
export DJANGO_SETTINGS_MODULE=quince_project.settings.prod
export DJANGO_DEBUG=False
export DJANGO_SECRET_KEY=your-secret-key
export DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Collect static files
python manage.py collectstatic --noinput

# Run with gunicorn
gunicorn quince_project.wsgi:application
```

### Frontend

```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`. Django is configured to serve these static files.

## 🧪 Testing

```bash
# Backend tests
pytest

# Frontend tests (when configured)
cd frontend
npm test
```

## 📚 API Endpoints

### Contact & Products

- `POST /api/contact/send/` - Submit contact form
- `GET /api/contact/products/` - Fetch products from Airtable

### Admin

- `/admin/` - Django admin interface

## 🛠 Tech Stack

**Backend:**

- Django 4.2
- Django REST Framework concepts
- PostgreSQL/SQLite
- Airtable API integration

**Frontend:**

- React 19
- TypeScript
- Vite
- TailwindCSS
- Sanity CMS
- React Router

## 📖 Additional Documentation

- [Sanity CMS Setup](SANITY_SETUP.md) - Blog & content management
- [API Documentation](#) - Coming soon
- [Deployment Guide](#) - Coming soon

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📄 License

Proprietary - Quince Nutrition & Consultancy Ltd

---

**Questions?** Contact: Info@quince-nutrition.com
