
# Ecoli-Track — Django + React
## Cómo correr
Backend:
  cd backend
  python -m venv .venv
  .\.venv\Scripts\activate
  pip install -r requirements.txt
  python manage.py migrate
  python manage.py runserver  # http://localhost:8000

Frontend:
  cd frontend
  copy .env.example .env     # o crea .env con VITE_API_URL=http://localhost:8000
  npm install
  npm run dev                # http://localhost:5173

## Rutas
Frontend: /login, /register, /app/activities, /app/profile
Backend:  /api/auth/token/, /api/auth/token/refresh/, /api/auth/register/,
          /api/auth/me/, /api/activities/, /api/activities/summary_today/