# Developer Quick Reference

Fast reference guide for developers working on the Examination Result Portal.

## Quick Start (5 minutes)

### Terminal 1 - Backend

```bash
cd exam-result-portal/server
npm install
npm run prisma:migrate
npm run dev
# Opens on http://localhost:5000
```

### Terminal 2 - Frontend

```bash
cd exam-result-portal/client
npm install
npm start
# Opens on http://localhost:3000
```

---

## Key Commands

### Backend Commands

```bash
npm install              # Install dependencies
npm run dev              # Start with nodemon
npm start                # Start production
npm run prisma:studio    # Open Prisma Studio UI
npm run prisma:migrate   # Run migrations
npm run prisma:generate  # Generate Prisma client
```

### Frontend Commands

```bash
npm install       # Install dependencies
npm start         # Start dev server (auto-opens browser)
npm build         # Build for production
npm test          # Run tests
```

---

## Project Structure Quick View

```
server/
  ├── src/
  │   ├── server.js          # Entry point
  │   ├── controllers/       # Business logic
  │   ├── routes/            # Route definitions
  │   ├── middleware/        # Auth middleware
  │   └── utils/             # Utilities
  └── prisma/
      └── schema.prisma      # Database schema

client/
  ├── public/
  │   └── index.html         # HTML entry
  └── src/
      ├── App.js             # Main component
      ├── pages/             # Page components
      ├── context/           # Auth context
      └── utils/             # API utilities
```

---

## Important Files

| File                                      | Purpose               |
| ----------------------------------------- | --------------------- |
| `server/src/server.js`                    | Express app setup     |
| `server/prisma/schema.prisma`             | Database models       |
| `server/src/middleware/authMiddleware.js` | JWT verification      |
| `client/src/context/AuthContext.js`       | Auth state management |
| `client/src/utils/api.js`                 | API client setup      |
| `.env`                                    | Environment variables |

---

## API Endpoints Quick Reference

### Auth

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Results

- `GET /api/results/my-results` - Get student results
- `GET /api/results` - Get all results (Faculty)
- `GET /api/results/stats` - Get statistics
- `POST /api/results` - Add result (Faculty)
- `PUT /api/results/:id` - Update result (Faculty)
- `DELETE /api/results/:id` - Delete result (Faculty)

---

## Database Models

### User

```prisma
id, email, password, role, createdAt, updatedAt
role: "student" | "parent" | "faculty" | "admin"
```

### Student

```prisma
id, rollNumber (unique), year, userId
```

### Result

```prisma
id, marks, grade, status, studentId, subjectId, examId, userId
grade: "A" | "B" | "C" | "D" | "F"
status: "pass" | "fail"
```

---

## Authentication Flow

```
1. User registers/logs in
2. Server generates JWT token
3. Token stored in localStorage
4. Every request includes: Authorization: Bearer <token>
5. Server verifies token
6. Route protection on frontend (ProtectedRoute)
7. Role-based access in controllers
```

---

## Common Tasks

### Add a New API Endpoint

1. **Create controller function** (`server/src/controllers/`)
2. **Add route** (`server/src/routes/`)
3. **Handle on frontend** (`client/src/utils/api.js`)
4. **Create page/component** (`client/src/pages/`)

### Add Database Table

1. **Update schema.prisma**
2. Run migration:
   ```bash
   npm run prisma:migrate
   ```
3. Update controllers/controllers

### Style a Component

All styles in `client/src/App.css`

Classes available:

- `.container` - Max-width container
- `.button` - Button styles
- `.form-group` - Form section
- `.table` - Table styles
- `.alert` - Alert styling

---

## Debugging Tips

### Backend Not Responding

```bash
# Check if running
curl http://localhost:5000/api/health

# Check logs in terminal
# Look for "Server is running on port 5000"
```

### Database Connection Error

```bash
# Verify PostgreSQL running
# Check DATABASE_URL in .env
# Test connection:
psql -U postgres -d exam_result_portal
```

### Frontend Can't Connect

```bash
# Check backend is running
# Verify proxy in client/package.json
# Check CORS in server.js
```

---

## Testing Credentials

```
Student:
  Email: student@example.com
  Password: password123
  Roll: 2024001

Faculty:
  Email: faculty@example.com
  Password: password123

Parent:
  Email: parent@example.com
  Password: password123
```

---

## Git Commands

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit: Exam result portal"

# Before pushing
git status
git log

# Ignore node_modules
# (Already in .gitignore)
```

---

## Environment Variables

### Required

```
DATABASE_URL
JWT_SECRET
```

### Optional

```
PORT=5000 (default)
NODE_ENV=development (default)
```

---

## Useful Shortcuts

### Browser DevTools

- F12 - Open DevTools
- Ctrl+Shift+J - Console
- Ctrl+Shift+I - Inspector

### VS Code

- Ctrl+` - Terminal
- Ctrl+P - Quick open file
- Ctrl+H - Find & replace

---

## File Extensions

- `.js` - JavaScript files
- `.jsx` - React components (can be .js too)
- `.css` - Styles
- `.prisma` - Prisma schema
- `.json` - Configuration
- `.md` - Documentation

---

## Port Numbers

| Port | Service           |
| ---- | ----------------- |
| 3000 | Frontend (React)  |
| 5000 | Backend (Express) |
| 5432 | PostgreSQL        |
| 5555 | Prisma Studio     |

---

## Error Messages & Solutions

### "Cannot find module 'express'"

```bash
cd server && npm install
```

### "Port 5000 already in use"

- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### "ECONNREFUSED - PostgreSQL"

- Check PostgreSQL is running
- Verify DATABASE_URL

### "Invalid token"

- Token expired (7 days) or corrupted
- User needs to login again

---

## Performance Tips

1. Use Prisma Studio for data visualization
2. Add indexes on frequently queried fields
3. Implement pagination for large datasets
4. Cache frequently accessed data
5. Use debouncing for filters

---

## Security Tips

✅ Never commit .env file
✅ Use strong JWT_SECRET
✅ Validate input on backend
✅ Use HTTPS in production
✅ Keep dependencies updated
✅ Implement rate limiting
✅ Use parameterized queries (Prisma does this)

---

## Links

- React Docs: https://react.dev
- Express Docs: https://expressjs.com
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs

---

## Cheat Sheet

| Task           | Command                            |
| -------------- | ---------------------------------- |
| Install deps   | npm install                        |
| Start server   | npm run dev                        |
| Start client   | npm start                          |
| DB migrations  | npm run prisma:migrate             |
| View DB        | npm run prisma:studio              |
| Build frontend | cd client && npm build             |
| Clean install  | rm -rf node_modules && npm install |

---

## File Sizes (Approximate)

- server/src: ~1.5 KB (minified)
- client/src: ~50 KB (before minify)
- node_modules: ~500 MB (typical)

---

**Last Updated: 2024**

For detailed info, see README.md or SETUP_GUIDE.md
