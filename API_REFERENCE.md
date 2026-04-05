# API Reference - Examination Result Portal

Complete API endpoint documentation for the backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All responses are in JSON format:

### Success Response

```json
{
  "message": "Success message",
  "data": {}
}
```

### Error Response

```json
{
  "message": "Error message",
  "error": "Error details"
}
```

## Endpoints

### Authentication Endpoints

#### 1. Register

Create a new user account

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student|faculty|parent|admin",
  "rollNumber": "2024001", // Required for students
  "year": 1 // Required for students
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "student"
  }
}
```

**Errors:**

- 400: User already exists
- 400: Missing required fields
- 500: Server error

---

#### 2. Login

Authenticate user and get JWT token

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "student",
    "student": {
      "id": 1,
      "rollNumber": "2024001",
      "year": 1,
      "userId": 1
    }
  }
}
```

**Errors:**

- 400: Email and password required
- 401: Invalid email or password
- 500: Server error

---

#### 3. Get Current User

Retrieve current authenticated user details

**Endpoint:** `GET /auth/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "student",
    "student": {
      "id": 1,
      "rollNumber": "2024001",
      "year": 1
    }
  }
}
```

**Errors:**

- 401: No token provided
- 401: Invalid or expired token
- 404: User not found

---

### Result Endpoints

#### 4. Get My Results

Get results for logged-in student

**Endpoint:** `GET /results/my-results`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:** None

**Response (200):**

```json
{
  "results": [
    {
      "id": 1,
      "marks": 85,
      "grade": "B",
      "status": "pass",
      "student": {
        "id": 1,
        "rollNumber": "2024001"
      },
      "subject": {
        "id": 1,
        "name": "Mathematics"
      },
      "exam": {
        "id": 1,
        "examType": "final",
        "totalMarks": 100,
        "semester": {
          "id": 1,
          "semesterNo": 1,
          "year": 2024
        }
      }
    }
  ]
}
```

**Errors:**

- 401: Unauthorized
- 404: Student record not found
- 500: Server error

---

#### 5. Get All Results

Get all results (Faculty/Admin only)

**Endpoint:** `GET /results`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `studentId` - Filter by student ID (optional)
- `examType` - Filter by exam type (optional)
- `semesterId` - Filter by semester ID (optional)
- `year` - Filter by year (optional)

**Example:**

```
GET /results?examType=final&semesterId=1
```

**Response (200):**

```json
{
  "results": [
    {
      "id": 1,
      "marks": 85,
      "grade": "B",
      "status": "pass",
      "student": {
        "id": 1,
        "rollNumber": "2024001",
        "user": {
          "email": "student@example.com"
        }
      },
      "subject": {
        "id": 1,
        "name": "Mathematics"
      },
      "exam": {
        "id": 1,
        "examType": "final",
        "totalMarks": 100,
        "semester": {
          "id": 1,
          "semesterNo": 1
        }
      }
    }
  ]
}
```

**Errors:**

- 401: Unauthorized
- 403: Access denied (not faculty/admin)
- 500: Server error

---

#### 6. Get Results Statistics

Get aggregated statistics for results

**Endpoint:** `GET /results/stats`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `semesterId` - Filter by semester (optional)

**Response (200):**

```json
{
  "stats": {
    "totalResults": 150,
    "passCount": 135,
    "failCount": 15,
    "averageMarks": "78.50",
    "gradeDistribution": {
      "A": 45,
      "B": 50,
      "C": 40,
      "D": 15,
      "F": 0
    }
  }
}
```

**Errors:**

- 401: Unauthorized
- 500: Server error

---

#### 7. Add Result

Add a new result (Faculty/Admin only)

**Endpoint:** `POST /results`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "studentId": 1,
  "subjectId": 1,
  "examId": 1,
  "marks": 85
}
```

**Response (201):**

```json
{
  "message": "Result added successfully",
  "result": {
    "id": 1,
    "marks": 85,
    "grade": "B",
    "status": "pass",
    "studentId": 1,
    "subjectId": 1,
    "examId": 1,
    "userId": 2,
    "student": {},
    "subject": {},
    "exam": {}
  }
}
```

**Validation Rules:**

- All fields required
- marks must be between 0 and exam.totalMarks
- Result combination (studentId, subjectId, examId) must be unique

**Errors:**

- 400: Missing required fields
- 400: Marks validation failed
- 400: Result already exists
- 401: Unauthorized
- 403: Access denied (not faculty/admin)
- 404: Exam/Student/Subject not found
- 500: Server error

---

#### 8. Update Result

Update existing result marks (Faculty/Admin only)

**Endpoint:** `PUT /results/:id`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**

- `:id` - Result ID (required)

**Request Body:**

```json
{
  "marks": 90
}
```

**Response (200):**

```json
{
  "message": "Result updated successfully",
  "result": {
    "id": 1,
    "marks": 90,
    "grade": "A",
    "status": "pass",
    "studentId": 1,
    "subjectId": 1,
    "examId": 1,
    "userId": 2
  }
}
```

**Errors:**

- 400: Marks required
- 400: Invalid marks range
- 401: Unauthorized
- 403: Access denied (not faculty/admin)
- 404: Result not found
- 500: Server error

---

#### 9. Delete Result

Delete a result (Faculty/Admin only)

**Endpoint:** `DELETE /results/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Path Parameters:**

- `:id` - Result ID (required)

**Response (200):**

```json
{
  "message": "Result deleted successfully"
}
```

**Errors:**

- 401: Unauthorized
- 403: Access denied (not faculty/admin)
- 404: Result not found
- 500: Server error

---

### Health Check Endpoint

#### 10. Health Check

Check if server is running

**Endpoint:** `GET /health`

**Response (200):**

```json
{
  "message": "Server is running"
}
```

---

## Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | OK - Request successful              |
| 201  | Created - Resource created           |
| 400  | Bad Request - Invalid input          |
| 401  | Unauthorized - Invalid/missing token |
| 403  | Forbidden - Access denied            |
| 404  | Not Found - Resource not found       |
| 500  | Server Error - Internal error        |

---

## Grading System

Results are automatically graded based on marks:

| Grade | Percentage Range |
| ----- | ---------------- |
| A     | 90-100%          |
| B     | 80-89%           |
| C     | 70-79%           |
| D     | 60-69%           |
| F     | <60%             |

**Pass/Fail:**

- Pass: ≥ 40%
- Fail: < 40%

---

## Rate Limiting

Not currently implemented. Consider adding for production.

## Error Messages

Common error messages:

```
"Email and password are required"
"Invalid email or password"
"User already exists"
"No token provided"
"Invalid or expired token"
"Access denied. Insufficient permissions."
"Marks must be between 0 and X"
"Result already exists for this combination"
```

---

## Example Workflows

### Workflow 1: Student Viewing Results

```
1. POST /auth/login
   - Receive: token, user

2. GET /auth/me
   - Header: Authorization: Bearer <token>
   - Receive: User details

3. GET /results/my-results
   - Header: Authorization: Bearer <token>
   - Receive: List of results
```

### Workflow 2: Faculty Adding Results

```
1. POST /auth/login
   - Receive: token (role: faculty)

2. POST /results
   - Header: Authorization: Bearer <token>
   - Body: {studentId, subjectId, examId, marks}
   - Receive: Created result with auto-calculated grade

3. GET /results/stats
   - Receive: Updated statistics
```

### Workflow 3: Parent Monitoring

```
1. POST /auth/login
   - Receive: token (role: parent)

2. GET /results
   - Header: Authorization: Bearer <token>
   - Query: Can add filters
   - Receive: All student results

3. GET /results/stats
   - Receive: Performance statistics
```

---

## Notes

- All timestamps are in UTC
- Passwords are hashed with bcrypt (salt rounds: 10)
- JWT tokens expire in 7 days
- Dates are in ISO 8601 format
- All IDs are auto-incrementing integers

---

**For more details, see README.md**
