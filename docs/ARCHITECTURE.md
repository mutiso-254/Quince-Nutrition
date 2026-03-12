# Project Architecture

This document explains the architectural decisions and structure of the Quince Nutrition application.

## Overview

The application follows a **modern full-stack architecture** with clear separation between backend and frontend:

- **Backend**: Django REST-style API serving data and handling business logic
- **Frontend**: React SPA with TypeScript, consuming the backend API
- **CMS**: Sanity headless CMS for blog content

## Architecture Decisions

### 1. Backend Structure

#### Django App Organization

We use a **modular app structure** following Django best practices:

```
apps/
├── contacts/     # Handles contact forms & Airtable integration
├── inventory/    # Product/inventory management (prepared for future)
└── core/         # Shared utilities, middleware, base models
```

**Why this structure:**
- **Separation of concerns**: Each app has a single, well-defined responsibility
- **Reusability**: Apps can be extracted and reused in other projects
- **Testability**: Isolated apps are easier to test
- **Scalability**: New features get their own app without cluttering existing code

#### Settings Organization

Settings are split into multiple modules:

```
settings/
├── __init__.py   # Default imports dev.py
├── base.py       # Common settings
├── dev.py        # Development overrides
└── prod.py       # Production overrides
```

**Benefits:**
- Environment-specific configuration without conditionals
- Secrets never committed (all read from environment)
- Easy to switch: `DJANGO_SETTINGS_MODULE=quince_project.settings.prod`

#### Requirements Organization

```
requirements/
├── base.txt      # Core dependencies
├── dev.txt       # Development tools (pytest, black, etc.)
└── prod.txt      # Production-only (gunicorn, sentry, etc.)
```

**Benefits:**
- Smaller production images (no dev tools)
- Clear dependency purposes
- Easy to maintain and update

### 2. Frontend Structure

#### Directory Organization

```
frontend/src/
├── components/    # Reusable UI components
├── pages/        # Route-level components
├── services/     # API communication layer
├── types/        # TypeScript definitions
├── config/       # Centralized configuration
├── lib/          # Third-party integrations (Sanity)
├── context/      # React context providers
└── constants.ts  # App-wide constants
```

**Why this structure:**
- **Clear boundaries**: Each directory has a specific purpose
- **Import clarity**: Easy to understand dependencies
- **Type safety**: Centralized type definitions
- **Configuration**: Single source of truth for env-dependent values

#### Configuration Layer

All environment-dependent values go through `src/config/index.ts`:

```typescript
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  sanity: { projectId: import.meta.env.VITE_SANITY_PROJECT_ID, ... },
  // ...
}
```

**Benefits:**
- Single place to manage all config
- Runtime validation of required values
- Type-safe access throughout the app
- Easy to mock in tests

### 3. Security Architecture

#### API Key Protection

**Frontend (Public):**
- Only `VITE_*` prefixed variables are exposed
- Suitable for: Public IDs, API URLs, non-sensitive config
- **Never** put secrets here (they're in the browser bundle)

**Backend (Private):**
- All secrets read from environment variables
- Never hardcoded in code
- Proper `.gitignore` prevents accidental commits

**API Communication:**
```
User Browser ──→ React App (public config)
                    ↓
                /api proxy
                    ↓
                Django Backend ──→ External APIs (Airtable, SMTP)
                (with secrets)
```

Sensitive operations are **always** proxied through the backend.

#### CORS Configuration

Development:
```python
CORS_ALLOW_ALL_ORIGINS = True  # dev.py only
```

Production:
```python
CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
]
```

### 4. Data Flow

#### Contact Form Submission

```
User fills form → Frontend validates → POST /api/contact/send/
                                              ↓
                                        Django view receives
                                              ↓
                                     ┌────────┴────────┐
                                     ↓                 ↓
                              Send email         Save to Airtable
                              (SMTP)             (HTTP API)
                                     ↓                 ↓
                                     └────────┬────────┘
                                              ↓
                                        Return success
```

#### Product Fetching

```
Component mounts → fetchProducts() → GET /api/contact/products/
                                              ↓
                                        Django contacts.views
                                              ↓
                                        Airtable service
                                              ↓
                                        Transform & return
                                              ↓
                                        Update UI state
```

#### Blog Content (Sanity)

```
Page loads → blog.service.ts → GROQ query → Sanity API
                                                ↓
                                          Transform data
                                                ↓
                                            Render page
```

Direct connection - no backend proxy needed (public content).

### 5. Type Safety

#### Backend
- Python type hints on function signatures
- Django model field definitions provide type info
- Future: Add `mypy` for static type checking

#### Frontend
- **Strict TypeScript** throughout
- Type definitions in `src/types/`
- Environment variables typed via `env.d.ts`
- API responses have explicit interfaces

### 6. Environment Configuration

#### Development

```bash
# Backend
DJANGO_DEBUG=True
DJANGO_SETTINGS_MODULE=quince_project.settings.dev
EMAIL_BACKEND=console  # Prints to console

# Frontend
VITE_API_URL=http://localhost:8000
```

#### Production

```bash
# Backend
DJANGO_DEBUG=False
DJANGO_SETTINGS_MODULE=quince_project.settings.prod
DJANGO_ALLOWED_HOSTS=yourdomain.com
EMAIL_HOST=smtp.provider.com
EMAIL_HOST_PASSWORD=<secret>

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

### 7. Future Improvements

Planned architectural enhancements:

1. **Authentication & Authorization**
   - JWT tokens for API auth
   - User accounts and profiles
   - Role-based access control

2. **Caching Layer**
   - Redis for session storage
   - API response caching
   - Optimistic UI updates

3. **Testing**
   - Backend: pytest + factory_boy
   - Frontend: Vitest + React Testing Library
   - E2E: Playwright

4. **CI/CD**
   - GitHub Actions workflows
   - Automated testing
   - Deployment pipelines

5. **Monitoring**
   - Sentry for error tracking
   - Application performance monitoring
   - User analytics

6. **Database**
   - Migration to PostgreSQL in production
   - Database connection pooling
   - Read replicas for scaling

## Best Practices

### When Adding New Features

1. **Backend:**
   - Create new app if it's a distinct feature domain
   - Add to `apps/` directory
   - Create proper `apps.py` config
   - Add tests in `tests/` directory
   - Update `INSTALLED_APPS` in settings

2. **Frontend:**
   - New route = new file in `pages/`
   - Shared UI = new component in `components/`
   - External data = service in `services/`
   - Types go in `types/`

3. **Environment:**
   - Backend secrets → root `.env`
   - Frontend public → `frontend/.env` (with `VITE_` prefix)
   - Document in respective `.env.example` files

### Code Organization Principles

- **DRY**: Don't Repeat Yourself
- **SRP**: Single Responsibility Principle (one job per module)
- **Explicit over implicit**: Clear imports, typed interfaces
- **Configuration over hardcoding**: Use environment variables
- **Fail fast**: Validate configuration on startup

## Questions?

For questions about architecture decisions, open an issue or contact the development team.
