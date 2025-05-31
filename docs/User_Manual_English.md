# ZKTeco K40 Biometric System User Manual

## Table of Contents

1. [System Overview](#system-overview)
2. [System Architecture](#system-architecture)
3. [Installation Guide](#installation-guide)
4. [Operation Guide](#operation-guide)
5. [Functional Modules](#functional-modules)
6. [Frequently Asked Questions](#frequently-asked-questions)
7. [Troubleshooting](#troubleshooting)

## System Overview

The ZKTeco K40 Biometric System is a comprehensive fingerprint recognition solution for gym member management, providing identity verification, access control, and attendance tracking. The system employs a distributed architecture with a React frontend, FastAPI backend, and C# middleware to deliver a complete fingerprint recognition solution.

### Key Features

- Member information management
- Device connection and management
- Fingerprint enrollment and recognition
- Real-time recognition logs
- Data statistics and analysis

## System Architecture

The system consists of three main components:

1. **Frontend Application**:
   - React-based web application
   - Provides user interface and interaction
   - Communicates with the backend via HTTP API and WebSocket

2. **Backend Service**:
   - Python application based on FastAPI
   - Handles business logic and data storage
   - Provides RESTful API and WebSocket interfaces
   - Communicates with middleware to control fingerprint devices

3. **Middleware Service**:
   - C# application based on .NET 6
   - Directly communicates with ZKTeco K40 fingerprint devices
   - Provides APIs for device control and fingerprint operations
   - Must run on Windows (as ZKTeco SDK only supports Windows)

## Installation Guide

### System Requirements

- **Frontend**: Node.js 14+
- **Backend**: Python 3.8+
- **Middleware**: .NET 6.0+, Windows operating system
- **Database**: MySQL 5.7+
- **Fingerprint Device**: ZKTeco K40, connected via network

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/biometric-gym-system.git
cd biometric-gym-system
```

#### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### 3. Install Backend Dependencies

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

#### 4. Install Middleware Dependencies

```bash
cd ../middleware
dotnet restore
```

#### 5. Configure Database

```bash
# Create database
mysql -u root -p
CREATE DATABASE biometric_gym CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Initialize database
cd ../backend
python database/init_db.py
```

#### 6. Configure ZKTeco SDK

1. Download the SDK (zkemkeeper.dll) from the ZKTeco official website
2. Place the SDK file in the middleware/SDK directory
3. Register the COM component (run on Windows):
   ```
   regsvr32 middleware/SDK/zkemkeeper.dll
   ```

## Operation Guide

### Start the Middleware (Windows Environment)

```bash
cd middleware
dotnet run --urls=http://0.0.0.0:9000
# Or run directly using
run.bat
```

The middleware will run on http://localhost:9000, and the Swagger API documentation can be accessed at http://localhost:9000/swagger.

### Start the Backend Service

```bash
cd backend
python run.py --reload
# Or start directly using uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend service will run on http://localhost:8000, and the API documentation can be accessed at http://localhost:8000/docs.

### Start the Frontend Application

```bash
cd frontend
npm run dev
```

The frontend application will run on http://localhost:3000.

### System Access

Open http://localhost:3000 in your browser to access the system interface.

## Functional Modules

### 1. Member Management

The member management module provides the following functions:

- **Member List**: View all member information with pagination, search, and filtering
- **Member Details**: View detailed member information, including basic profile and fingerprint records
- **Add Member**: Register new member information
- **Edit Member**: Modify member information
- **Delete Member**: Remove member records (along with associated fingerprint data)
- **Member Status Management**: Activate or deactivate member accounts

Operation Steps:
1. Click "Member Management" in the left navigation bar
2. Use the top search box to search for members
3. Click the "Add Member" button to add a new member
4. Click on a member row to view details or edit
5. Click buttons in the action column to change status or delete

### 2. Device Management

The device management module provides the following functions:

- **Device List**: View all fingerprint device information and status
- **Device Connection**: Connect to fingerprint devices
- **Device Disconnection**: Disconnect from fingerprint devices
- **Device Synchronization**: Sync device data to the system
- **Add Device**: Add new device configuration
- **Edit Device**: Modify device configuration
- **Delete Device**: Remove device configuration

Operation Steps:
1. Click "Device Management" in the left navigation bar
2. View the device list and status
3. Click the "Add Device" button to add a new device
4. Click the "Connect" button in the device row to connect to a device
5. Click the "Sync" button in the device row to synchronize device data
6. Click buttons in the action column to edit or delete

### 3. Fingerprint Management

The fingerprint management module provides the following functions:

- **Fingerprint Enrollment**: Enroll fingerprints for members
- **Fingerprint Recognition**: Recognize fingerprints and record
- **Fingerprint Template Management**: View and delete fingerprint templates

Operation Steps:

#### Fingerprint Enrollment:
1. Click "Fingerprint Enrollment" in the left navigation bar
2. Select a device and member
3. Choose a finger index (1-10)
4. Click the "Start Enrollment" button
5. Follow the prompts to place your finger on the fingerprint sensor
6. View the enrollment result after completion

#### Fingerprint Recognition:
1. Click "Fingerprint Recognition" in the left navigation bar
2. Select a device
3. Click the "Start Recognition" button
4. Place your finger on the fingerprint sensor
5. View the recognition result

### 4. Dashboard

The dashboard module provides the following functions:

- **System Overview**: Display statistics such as member count, device count, recognition count, etc.
- **Recognition Statistics**: View recognition records by hour, date, device, etc.
- **Recent Recognition Logs**: Display a list of recent recognition records

Operation Steps:
1. Click "Dashboard" in the left navigation bar
2. View various statistics and charts
3. Use the time selector to adjust the statistical time range
4. View the list of recent recognition records

## Frequently Asked Questions

### 1. Device Connection Issues

**Problem**: Cannot connect to fingerprint device
**Solution**:
- Ensure the device is properly connected to the network
- Check if the device IP address and port configuration are correct
- Confirm that the middleware service is running
- Check if Windows Firewall is blocking the connection
- Verify that the ZKTeco SDK is correctly installed and registered

### 2. Fingerprint Enrollment Issues

**Problem**: Fingerprint enrollment fails or has low quality
**Solution**:
- Ensure your finger is clean and not sweaty
- Place your finger correctly in the center of the sensor
- Keep your finger stable without moving
- Try adjusting finger pressure
- If multiple attempts fail, try using another finger

### 3. Fingerprint Recognition Issues

**Problem**: Fingerprint recognition fails or is inaccurate
**Solution**:
- Ensure your finger is clean and not sweaty
- Place your finger correctly in the center of the sensor
- Check if fingerprints have been enrolled for the member
- Try re-enrolling with higher quality fingerprint templates

### 4. System Performance Issues

**Problem**: System responds slowly
**Solution**:
- Check database connection and performance
- Confirm server resources are adequate
- Regularly clean historical record data
- Optimize database indexes

## Troubleshooting

### Check Service Status

1. Check middleware service:
   - Access http://localhost:9000/swagger to confirm the service is running
   - Check the middleware console output for error messages

2. Check backend service:
   - Access http://localhost:8000/docs to confirm the service is running
   - Check the backend console output for error messages

3. Check frontend application:
   - Access http://localhost:3000 to confirm the application is running
   - Use browser developer tools to check network requests and errors

### View Logs

- Backend logs are located in the backend/logs directory
- Middleware logs are located in the middleware/logs directory
- Check log files for detailed error information

### Restart Services

If you encounter issues, try restarting services in the following order:

1. Restart the middleware service
2. Restart the backend service
3. Restart the frontend application

### Contact Support

If the problem cannot be resolved, please contact technical support:

- Email: support@example.com
- Phone: +86 123 4567 8910
