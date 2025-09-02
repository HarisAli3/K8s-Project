# Student Management System

A modern 3-layered web application for managing student records with a React frontend, Node.js/Express backend, and PostgreSQL database. The application is fully containerized and ready for Kubernetes deployment.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ Features

- **Modern UI**: Clean, responsive React interface with Tailwind CSS
- **CRUD Operations**: Create, Read, Update, Delete student records
- **Form Validation**: Client and server-side validation
- **Real-time Feedback**: Toast notifications for user actions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Containerized**: Docker containers for easy deployment

- **Health Checks**: Built-in health monitoring
- **Security**: Rate limiting, CORS, and input validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL (for local development)

### Option 1: Docker Compose (Recommended)

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd K8s-Project
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

4. **Stop services:**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development

1. **Set up the database:**
   ```bash
   # Install PostgreSQL and create database
   createdb student_management
   
   # Run the initialization script
   psql -d student_management -f backend/database/init.sql
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your database credentials
   npm install
   npm run dev
   ```

3. **Set up the frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🐳 Docker Deployment

### Build Images

```bash
# Build backend image
docker build -t student-backend:latest ./backend

# Build frontend image
docker build -t student-frontend:latest ./frontend
```

### Run with Docker Compose

```bash
docker-compose up -d
```



## 📁 Project Structure

```
K8s-Project/
├── backend/                 # Node.js/Express API
│   ├── database/           # Database schema and connection
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── validation/         # Input validation
│   ├── middleware/         # Express middleware
│   ├── Dockerfile          # Backend container
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   ├── Dockerfile          # Frontend container
│   └── package.json        # Frontend dependencies

├── docker-compose.yml      # Docker Compose setup
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_management
DB_USER=postgres
DB_PASSWORD=password
NODE_ENV=development
```

#### Frontend
The frontend automatically connects to the backend via proxy configuration in `package.json`.

### Database Schema

The `students` table includes:
- `id`: Primary key (auto-increment)
- `first_name`: Student's first name (required)
- `last_name`: Student's last name (required)
- `email`: Email address (required, unique)
- `phone`: Phone number (optional)
- `date_of_birth`: Date of birth (optional)
- `address`: Address (optional)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/health` | Health check |

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for specific origins
- **Input Validation**: Joi schema validation
- **Helmet**: Security headers
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization

## 📊 Monitoring

### Health Checks

- **Backend**: `GET /health`
- **Frontend**: `GET /health`
- **Database**: PostgreSQL health check

### Logs

```bash
# Docker Compose logs
docker-compose logs -f


```

## 🚀 Production Considerations

1. **Environment Variables**: Use proper secrets management
2. **Database**: Use managed PostgreSQL service
3. **SSL/TLS**: Configure HTTPS in production
4. **Monitoring**: Add application monitoring (Prometheus, Grafana)
5. **Logging**: Centralized logging solution
6. **Backup**: Regular database backups
7. **Scaling**: Configure horizontal pod autoscaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check if PostgreSQL is running
   - Verify connection credentials
   - Ensure database exists

2. **Frontend Can't Connect to Backend**
   - Check if backend is running on port 5000
   - Verify CORS configuration
   - Check network connectivity

3. **Docker Build Fails**
   - Ensure Docker is running
   - Check Dockerfile syntax
   - Verify all dependencies are available



### Getting Help

- Check the logs for error messages
- Verify all services are running
- Ensure all dependencies are installed
- Check network connectivity between services

---

**Happy Coding! 🎉**
