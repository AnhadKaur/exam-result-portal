# Examination Result Portal - Complete Setup Guide

This guide provides step-by-step instructions to set up and run the Examination Result Portal project.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **npm** or **yarn** (comes with Node.js)
3. **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
4. **Git** (optional) - [Download](https://git-scm.com/)

## Step 1: Database Setup

### 1.1 Create PostgreSQL Database

1. Open PostgreSQL Command Line or PgAdmin
2. Create a new database:

```sql
CREATE DATABASE exam_result_portal;
```

3. Optionally, create a dedicated user:

```sql
CREATE USER exam_user WITH PASSWORD 'password123';
ALTER ROLE exam_user SET client_encoding TO 'utf8';
ALTER ROLE exam_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE exam_user SET default_transaction_deferrable TO on;
ALTER ROLE exam_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE exam_result_portal TO exam_user;
```

## Step 2: Backend Setup

### 2.1 Navigate to Server Directory

```bash
cd exam-result-portal/server
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install:

- express - Web framework
- @prisma/client - ORM
- bcrypt - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-Origin Resource Sharing
- dotenv - Environment variables
- nodemon - Development auto-reload

### 2.3 Configure Environment Variables

Edit the `.env` file and update:

```
DATABASE_URL="postgresql://username:password@localhost:5432/exam_result_portal"
JWT_SECRET="your-super-secret-key-change-this-in-production-12345"
PORT=5000
NODE_ENV=development
```

Replace:

- `username` with your PostgreSQL username (usually `postgres`)
- `password` with your PostgreSQL password
- Keep JWT_SECRET as is or generate a strong one for production

### 2.4 Generate Prisma Client

```bash
npm run prisma:generate
```

### 2.5 Run Database Migrations

```bash
npm run prisma:migrate
```

This will:

- Create all tables defined in `schema.prisma`
- Set up relationships and indexes
- Create migration history

### 2.6 (Optional) Seed Sample Data

Use Prisma Studio to add sample data:

```bash
npm run prisma:studio
```

Or manually create users through the API.

### 2.7 Start Backend Server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

You should see:

```
Server is running on port 5000
```

Visit `http://localhost:5000/api/health` in browser to verify.

## Step 3: Frontend Setup

### 3.1 Navigate to Client Directory

In a new terminal:

```bash
cd exam-result-portal/client
```

### 3.2 Install Dependencies

```bash
npm install
```

This will install:

- react - UI library
- react-router-dom - Routing
- axios - HTTP client

### 3.3 Configure Environment (Optional)

Create `.env` file in client directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.4 Start Frontend Development Server

```bash
npm start
```

The app will automatically open at `http://localhost:3000`

## Step 4: Create Sample Data

### Option A: Using the UI (Recommended)

1. Go to `http://localhost:3000`
2. Click "Register"
3. Create accounts for:
   - A Student (roll number: 2024001, year: 1)
   - A Faculty member
   - A Parent

### Option B: Using API with cURL or Postman

**Register Student:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "role": "student",
    "rollNumber": "2024001",
    "year": 1
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Option C: Using Prisma Studio

```bash
cd server
npm run prisma:studio
```

Then add data directly through the web interface.

## Step 5: Test the Application

### Student Flow

1. Register as student: student@example.com / password123
2. Roll Number: 2024001, Year: 1
3. Login
4. Should see Student Dashboard (no results yet)

### Faculty Flow

1. Register as faculty: faculty@example.com / password123
2. Login
3. Should see Faculty Dashboard
4. Can add results (needs Student, Subject, Exam, and marks)

### Parent Flow

1. Register as parent: parent@example.com / password123
2. Login
3. Should see Parent Dashboard
4. Can view all student results

## Project Structure Reference

```
exam-result-portal/
│
├── server/
│   ├── src/
│   │   ├── server.js                 # Express app entry point
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   └── resultController.js  # Result logic
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   └── resultRoutes.js      # Result endpoints
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT & role check
│   │   └── utils/
│   │       └── auth.js               # JWT & bcrypt utils
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── .env                          # Environment variables
│   ├── .gitignore                    # Git ignore rules
│   └── package.json                  # Dependencies
│
├── client/
│   ├── public/
│   │   └── index.html               # HTML entry point
│   ├── src/
│   │   ├── index.js                 # React entry
│   │   ├── App.js                   # Main component
│   │   ├── App.css                  # Global styles
│   │   ├── pages/
│   │   │   ├── HomePage.js          # Home page
│   │   │   ├── LoginPage.js         # Login page
│   │   │   ├── RegisterPage.js      # Registration
│   │   │   ├── StudentDashboard.js  # Student view
│   │   │   ├── FacultyDashboard.js  # Faculty view
│   │   │   └── ParentDashboard.js   # Parent view
│   │   ├── components/
│   │   │   └── ProtectedRoute.js    # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.js       # Auth state
│   │   └── utils/
│   │       ├── api.js               # API client
│   │       └── pdfExport.js         # Export utilities
│   ├── .gitignore                    # Git ignore rules
│   └── package.json                  # Dependencies
│
└── README.md                         # Project documentation
```

## Common Issues & Solutions

### Issue 1: Database Connection Error

**Error:** "ECONNREFUSED - Connection refused"

**Solution:**

- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Try connecting with psql:
  ```bash
  psql -U postgres -d exam_result_portal
  ```

### Issue 2: PORT Already in Use

**Error:** "EADDRINUSE - Address already in use"

**Solution:**

- Change PORT in .env (e.g., 5001)
- Or kill process using port (Linux/Mac):
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

### Issue 3: CORS Error in Frontend

**Error:** "Access to XMLHttpRequest blocked by CORS"

**Solution:**

- Ensure backend is running on port 5000
- Check CORS is enabled in server.js
- Verify proxy in client package.json

### Issue 4: Module Not Found

**Error:** "Cannot find module 'express'"

**Solution:**

```bash
cd server
npm install
```

### Issue 5: Prisma Migrations Failed

**Error:** "Migration cannot proceed"

**Solution:**

```bash
# Delete and recreate database
cd server
npx prisma migrate reset   # WARNING: Deletes all data
npm run prisma:migrate
```

## API Testing with Postman

1. Download Postman: https://www.postman.com/downloads/

2. Create requests:

**Register:**

- Method: POST
- URL: http://localhost:5000/api/auth/register
- Body (JSON):

```json
{
  "email": "test@example.com",
  "password": "password123",
  "role": "student",
  "rollNumber": "2024001",
  "year": 1
}
```

**Login:**

- Method: POST
- URL: http://localhost:5000/api/auth/login
- Body (JSON):

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Get Results (with token):**

- Method: GET
- URL: http://localhost:5000/api/results/my-results
- Headers:
  - Authorization: Bearer <token_from_login>

## Deployment Considerations

### Environment Setup

Before deploying to production:

1. **Generate strong JWT_SECRET:**

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Set NODE_ENV to production**

3. **Use proper database credentials**

4. **Enable HTTPS**

### Deployment Platforms

- **Backend**: Heroku, AWS, DigitalOcean, Azure
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: AWS RDS, Heroku Postgres, DigitalOcean

## Performance Optimization

1. **Add indexes to frequently queried fields**
2. **Implement pagination for large result sets**
3. **Cache frequently accessed data**
4. **Use connection pooling for database**
5. **Implement rate limiting on API endpoints**

## Security Best Practices

1. ✅ Use HTTPS in production
2. ✅ Implement rate limiting
3. ✅ Validate all inputs on backend
4. ✅ Use strong JWT secrets
5. ✅ Hash passwords with bcrypt
6. ✅ Implement CORS properly
7. ✅ Keep dependencies updated
8. ✅ Use environment variables for secrets

## Support & Troubleshooting

For detailed API documentation, see `README.md` in the root directory.

## Next Steps

1. Explore the codebase
2. Customize styling in `App.css`
3. Add more features as needed
4. Deploy to production
5. Monitor and maintain

---

**Happy Coding! 🎓**
