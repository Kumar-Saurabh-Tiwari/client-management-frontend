# ClientManagementFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

## Deployed Application

**Live Demo:** https://client-management-frontend-inky.vercel.app/

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Backend Setup & MongoDB Configuration

### Overview

This application uses a modern full-stack architecture with:
- **Frontend**: Angular 21+ with TypeScript
- **Backend**: Express.js REST API
- **Database**: MongoDB (Atlas) deployed on AWS
- **Hosting**: Render.com for backend deployment

### Prerequisites

Before setting up the backend, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB** (local installation optional; uses cloud cluster by default)
- **Git** for version control

### Backend Project Setup

#### 1. Clone the Backend Repository  
> Note: The backend repository is private. Access can be provided upon request if required.

```bash
git clone https://github.com/Kumar-Saurabh-Tiwari/client-management-backend
cd client-management-backend
```

#### 2. Install Dependencies

```bash
npm install
```

This command installs all required dependencies defined in `package.json`, including Express, MongoDB drivers, and authentication libraries.

#### 3. Environment Configuration

Create a `.env` file in the backend root directory with the following configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority
MONGODB_DB_NAME=client_management

# JWT Authentication
JWT_SECRET=<your-secure-jwt-secret>
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:4200
ALLOWED_ORIGINS=http://localhost:4200,https://yourdomain.com

# API Configuration
API_VERSION=v1
LOG_LEVEL=debug
```

### MongoDB Atlas & AWS Deployment

#### Setting Up MongoDB Atlas

1. **Create MongoDB Atlas Cluster**:
   - Navigate to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in to your account
   - Create a new project (e.g., "Client Management")
   - Click "Create a Cluster" and select AWS as the cloud provider

2. **Configure Cluster Details**:
   - **Cloud Provider**: AWS
   - **Region**: Select your preferred region (e.g., us-east-1)
   - **Cluster Tier**: M0 Free Tier (for development) or M2/M10+ (for production)
   - **Cluster Name**: `client-management-cluster`

3. **Network Access**:
   - Go to "Network Access" in the Atlas dashboard
   - Add IP address ranges or use "0.0.0.0/0" (for development only)
   - For production, whitelist specific IP addresses or use Render's static IPs

4. **Database Authentication**:
   - Create a database user with a strong password
   - Store credentials securely; you'll use them in `MONGODB_URI`

5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Select "Drivers" (Node.js)
   - Copy the connection string and update `.env` file

#### Connection String Format

```
mongodb+srv://<username>:<password>@<cluster-name>.<project-id>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

**Example**:
```
mongodb+srv://admin:SecurePass123@client-mgmt-cluster.f3k9x.mongodb.net/client_management?retryWrites=true&w=majority
```

### Running the Backend Locally

#### Development Mode

To run the backend development server with hot-reload:

```bash
npm run dev
```

This command starts the server using `nodemon`, which automatically restarts on file changes.

**Expected Output**:
```
[nodemon] 3.0.1
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): src/**/*
Connected to MongoDB Atlas
Server running on http://localhost:5000
```

#### Production Build

To create an optimized production build:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

### Backend API Endpoints

The API follows RESTful conventions with the following main endpoints:

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-token` - Refresh JWT token

#### Clients Management
- `GET /api/v1/clients` - Retrieve all clients
- `GET /api/v1/clients/:id` - Get specific client details
- `POST /api/v1/clients` - Create new client
- `PUT /api/v1/clients/:id` - Update client information
- `DELETE /api/v1/clients/:id` - Delete client record

#### Health & Status
- `GET /api/v1/health` - API health check
- `GET /api/v1/status` - System status and dependencies

### Render.com Deployment

#### Prerequisites for Deployment

- Render.com account created and active
- Backend repository pushed to GitHub/GitLab
- MongoDB Atlas connection string ready

#### Deployment Steps

1. **Connect Repository**:
   - Log in to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Web Service"
   - Connect your GitHub/GitLab account
   - Select the backend repository

2. **Configure Service**:
   - **Name**: `client-management-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Standard (for production) or Free (for testing)

3. **Set Environment Variables**:
   - Navigate to "Environment" in service settings
   - Add all variables from your `.env` file:
     - `NODE_ENV=production`
     - `MONGODB_URI=<your-connection-string>`
     - `JWT_SECRET=<strong-secret>`
     - `FRONTEND_URL=<your-frontend-domain>`

4. **Enable Auto-Deploy**:
   - Check "Auto-Deploy" to redeploy on git push
   - Configure branch (typically `main` or `master`)

5. **Health Checks** (Optional):
   - Set Health Check Path: `/api/v1/health`
   - Set Health Check Protocol: `HTTP`

#### Post-Deployment Verification

Once deployed, verify your backend is running:

```bash
curl https://<your-render-service>.onrender.com/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-04-27T10:30:00Z",
  "database": "connected"
}
```

### Database Management

#### Viewing Data in MongoDB Atlas

1. **Browse Collections**:
   - Go to your cluster in MongoDB Atlas
   - Click "Collections" tab
   - Browse and manage database documents

2. **Run Queries**:
   - Use MongoDB Atlas Query Editor for complex queries
   - Syntax is standard MongoDB query language

#### Backup & Restore

- MongoDB Atlas provides automated daily backups
- Access backups from "Backup" section in cluster settings
- Configure backup retention policy in cluster settings

### Troubleshooting

#### Connection Issues

**Problem**: Cannot connect to MongoDB Atlas
- **Solution**: Verify IP whitelist includes your current IP
- Check connection string for typos
- Ensure database user credentials are correct

**Problem**: Timeout connecting to Render database
- **Solution**: Check network connectivity and firewall rules
- Verify MongoDB_URI environment variable on Render
- Check Render logs for detailed error messages

#### View Logs

**Local Development**:
```bash
npm run dev
```

**Render Logs**:
- Access via Render Dashboard > Your Service > Logs
- Filter by log level (Error, Warning, Info)

### Development Workflow

#### Local Development with Frontend

Terminal 1 (Backend):
```bash
cd client-management-backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client-management-frontend
ng serve
```

Both services will run concurrently, with the frontend at `http://localhost:4200` and backend at `http://localhost:5000`.

#### Testing Backend

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

### Security Best Practices

1. **Environment Variables**: Never commit `.env` file; use `.env.example` template
2. **JWT Secrets**: Use strong, randomly generated secrets (minimum 32 characters)
3. **Database**: Always use SSL/TLS for MongoDB connections
4. **CORS**: Configure allowed origins explicitly in production
5. **Rate Limiting**: Implement rate limiting on API endpoints
6. **Input Validation**: Validate all user inputs on the server side

### Performance Optimization

- Enable MongoDB connection pooling
- Use database indexes for frequently queried fields
- Implement caching strategies for read-heavy operations
- Monitor database query performance in MongoDB Atlas

### Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas Guide](https://docs.mongodb.com/atlas/)
- [Render.com Documentation](https://render.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
