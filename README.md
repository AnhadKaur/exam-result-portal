# Examination Result Portal

A full-stack examination result management system built with React, Node.js, Express, and PostgreSQL.

## 📋 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Student Dashboard**: View personal results with filtering and statistics
- **Faculty Dashboard**: Add and manage student results with statistics
- **Parent Dashboard**: Monitor child's academic performance
- **Result Filtering**: Filter results by semester, exam type, and more
- **Performance Analytics**: View grades, pass/fail status, average marks
- **PDF Download**: Export results as CSV files
- **Grade Calculation**: Automatic grade assignment based on marks
- **Pass/Fail Status**: Automatic determination based on minimum marks

## 🔧 Tech Stack

- **Frontend**: React 18, React Router 6, Axios
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT, bcrypt
- **Other**: dotenv, CORS

## 📁 Project Structure

```
exam-result-portal/
├── server/
│   ├── src/
│   │   ├── server.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── resultController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── resultRoutes.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   └── utils/
│   │       └── auth.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── .env
├── client/
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js
│   │   ├── components/
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── FacultyDashboard.js
│   │   │   └── ParentDashboard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### Backend Setup

1. **Navigate to server directory**:

```bash
cd server
```

2. **Install dependencies**:

```bash
npm install
```

3. **Setup PostgreSQL**:
   - Create a PostgreSQL database named `exam_result_portal`
   - Update the `DATABASE_URL` in `.env` file

4. **Generate Prisma Client**:

```bash
npm run prisma:generate
```

5. **Run Prisma Migrations**:

```bash
npm run prisma:migrate
```

This will create all the required database tables.

6. **Start the server**:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**:

```bash
cd client
```

2. **Install dependencies**:

```bash
npm install
```

3. **Create `.env` file** (optional):

```
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**:

```bash
npm start
```

The app will run on `http://localhost:3000`

## 📊 Database Schema

### Users

- id, email, password, role (student, parent, faculty, admin), createdAt, updatedAt

### Students

- id, rollNumber, year, userId, createdAt, updatedAt

### Subjects

- id, name, credits, createdAt, updatedAt

### Semesters

- id, semesterNo, year, createdAt, updatedAt

### Exams

- id, examType (midterm, final, quiz), totalMarks, semesterId, createdAt, updatedAt

### Results

- id, marks, grade (A-F), status (pass/fail), studentId, subjectId, examId, userId, createdAt, updatedAt

## 🔐 Authentication

### Register

```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "role": "student",
  "rollNumber": "2024001",
  "year": 1
}
```

### Login

```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

Response includes JWT token to be used in Authorization header

### Get Current User

```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

## 📝 API Endpoints

### Results

**Get My Results** (Student only)

```
GET /api/results/my-results
Headers: Authorization: Bearer <token>
```

**Get All Results** (Faculty/Admin only)

```
GET /api/results
Headers: Authorization: Bearer <token>
```

**Get Statistics**

```
GET /api/results/stats
Headers: Authorization: Bearer <token>
```

**Add Result** (Faculty/Admin only)

```
POST /api/results
Headers: Authorization: Bearer <token>
Body: {
  "studentId": 1,
  "subjectId": 1,
  "examId": 1,
  "marks": 85
}
```

**Update Result** (Faculty/Admin only)

```
PUT /api/results/:id
Headers: Authorization: Bearer <token>
Body: {
  "marks": 90
}
```

**Delete Result** (Faculty/Admin only)

```
DELETE /api/results/:id
Headers: Authorization: Bearer <token>
```

## 📊 Grading System

- **A**: 90-100%
- **B**: 80-89%
- **C**: 70-79%
- **D**: 60-69%
- **F**: Below 60%

**Pass/Fail**: Students with 40% or above pass, below 40% fail

## 🧪 Sample Data

You can use Prisma Studio to add sample data:

```bash
npm run prisma:studio
```

Or create data using the API endpoints.

### Sample Users

**Student**

- Email: student@example.com
- Password: password123
- Roll Number: 2024001
- Year: 1

**Faculty**

- Email: faculty@example.com
- Password: password123

**Parent**

- Email: parent@example.com
- Password: password123

## 🌟 Features Implemented

✅ User Authentication (JWT + bcrypt)
✅ Role-Based Access Control
✅ Student Dashboard with Results
✅ Faculty Dashboard with Result Management
✅ Parent Dashboard for Monitoring
✅ Result Filtering (Semester, Exam Type)
✅ Automatic Grade Calculation
✅ Pass/Fail Status
✅ Performance Statistics
✅ CSV Download
✅ Responsive UI
✅ Error Handling

## 🎯 Extra Features Added

✅ PDF Download (CSV export format)
✅ CAPTCHA Placeholder (UI ready for integration)
✅ Performance Analytics
✅ Grade Distribution
✅ Cancel Edit Functionality

## 🔄 Workflow

1. User registers as Student, Faculty, or Parent
2. User logs in and receives JWT token
3. Based on role, redirected to appropriate dashboard
4. Students can view their results and statistics
5. Faculty can add and manage student results
6. Parents can monitor all students' results
7. Users can filter results and download as CSV

## 🛠️ Environment Variables

### Server (.env)

```
DATABASE_URL="postgresql://user:password@localhost:5432/exam_result_portal"
JWT_SECRET="your-secret-key-change-in-production"
PORT=5000
NODE_ENV=development
```

### Client (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop browsers
- Tablets
- Mobile devices

## 🐛 Troubleshooting

### Database Connection Error

- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

### Port Already in Use

- Change PORT in .env to a different port
- Check if another process is using port 5000 or 3000

### CORS Error

- Ensure backend is running
- Check CORS configuration in server.js
- Verify proxy setting in client package.json

## 📄 License

MIT

## 👥 Contributors

Built as a full-stack examination result portal project.

---

**Happy Coding! 🎓**
Full Stack Examination Result Portal (React + Node + PostgreSQL)
