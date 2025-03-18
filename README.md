# Media HUb

A full-stack application for uploading, viewing, and downloading media files (audio, PDF, and images) using React, Node.js, Express.js, and AWS S3 for storage.

## Features

- **Upload Media Files**: Upload audio, PDF, and image files to AWS S3 bucket
- **View Media Library**: Browse uploaded files by media type
- **Search Functionality**: Search for specific files by name
- **Audio Playback**: Stream and play audio files directly in the browser
- **File Download**: Download any media file to your local device
- **Responsive UI**: Modern, dark-themed user interface

## Tech Stack

### Frontend
- React + Vite
- React Router for navigation
- Styled Components for styling
- Axios for API requests

### Backend
- Node.js
- Express.js
- AWS SDK for JavaScript (v3)

### Storage
- AWS S3 Bucket

## Project Structure

```
project-root/
├── client/                 # Frontend React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── UploadMediaPage.jsx
│   │   │   ├── ViewMediaPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                 # Backend Node.js + Express application
│   ├── config/
│   │   └── s3.js           # S3 client configuration
│   ├── controllers/
│   │   ├── uploadController.js  # Handles file uploads to S3
│   │   └── mediaController.js   # Handles media listing and downloading
│   ├── routes/
│   │   ├── uploadRoutes.js
│   │   └── mediaRoutes.js
│   ├── app.js              # Express application setup
│   └── package.json
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- AWS account with S3 bucket

### Environment Variables

Create a `.env` file in your server directory with the following variables:

```
PORT=5003
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

### Backend Setup

1. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:5003

### Frontend Setup

1. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## API Endpoints

### Media Management

- **GET /api/media** - Get all media files
- **GET /api/media/type/:type** - Get media by type (audio, pdf, image)
- **GET /api/media/search?query=SEARCH_TERM&type=TYPE** - Search media by name and optionally filter by type
- **GET /api/media/download/:filename** - Get a pre-signed URL to download a file
- **GET /api/media/stream/:filename** - Stream a file directly to the client

### File Upload

- **POST /api/upload** - Upload a file to S3 bucket

## AWS S3 Setup

1. Create an S3 bucket in your AWS Console
2. Set up appropriate CORS configuration in your S3 bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
       "AllowedOrigins": ["http://localhost:5173"],
       "ExposeHeaders": []
     }
   ]
   ```
3. Create an IAM user with programmatic access and attach AmazonS3FullAccess policy
4. Use the access key and secret key in your `.env` file

## Screenshots

![image](https://github.com/user-attachments/assets/fcd4f469-b9c0-4238-9908-04f6c028a789)


![image](https://github.com/user-attachments/assets/ef914de0-1b06-41df-9351-57a33597ad6b)


![image](https://github.com/user-attachments/assets/de6661a2-ed25-4293-acdc-8d93df2dd186)


![image](https://github.com/user-attachments/assets/97ba0a12-a194-4e8d-906a-96dc8d4ff612)


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
