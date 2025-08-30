# LIMS System Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Quick Start

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb lims_db

# Run schema
psql -d lims_db -f backend/database/schema.sql

# Run seed data (optional)
psql -d lims_db -f backend/database/seed.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your database credentials
# Update DATABASE_URL, JWT_SECRET, etc.

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env.local

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/lims_db
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_EMAILJS_PUBLIC_KEY=your-key
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
```

## Default Login

- Username: `admin`
- Password: `admin123` (change this in production)

## Features

- Patient Management
- Doctor Management
- Test Management
- Invoice Generation
- Report Management
- Stock Management
- Dashboard Analytics
- User Authentication
- Role-based Access Control

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create doctor
- `GET /api/tests` - Get all tests
- `POST /api/tests` - Create test
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create report
- `GET /api/stock` - Get all stock items
- `POST /api/stock` - Create stock item
- `GET /api/dashboard/stats` - Dashboard statistics

## Development

### Backend
```bash
cd backend
npm run dev    # Start with nodemon
npm start      # Start production server
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

### Testing
```bash
npm run test        # Run Cypress tests
npm run test:open  # Open Cypress UI
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Update database URL for production
3. Set strong JWT secret
4. Configure CORS for production domain
5. Set up SSL certificates
6. Use PM2 or similar for process management

## Troubleshooting

### Database Connection Issues
- Check PostgreSQL service is running
- Verify database credentials
- Ensure database exists

### Frontend Build Issues
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify environment variables

### API Connection Issues
- Check backend server is running
- Verify API base URL in frontend
- Check CORS configuration

## Support

For issues and questions:
- Check the logs in backend console
- Review browser developer tools
- Check database connection status 