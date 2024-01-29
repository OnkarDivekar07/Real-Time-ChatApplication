# Real-Time Chat Application

## Description

This real-time chat application is developed using HTML, Bootstrap, JavaScript, Node.js, and Express, with Sequelize as the ORM. 
The project follows the MVC pattern for scalable code and optimizes the MySQL database with efficient relationships. Additionally, 
it leverages AWS S3 for multimedia sharing and integrates Nginx as an AWS EC2 reverse proxy for enhanced performance.

## Features

- Real-time chat functionality
- Group chat with multimedia sharing
- User authentication
- Responsive design
- Notifications for new messages
- MVC pattern for scalable code
- Optimized MySQL database
- Integrated AWS S3 for multimedia sharing
- Utilized Nginx for AWS EC2 reverse proxy

## Technologies Used

- HTML
- Bootstrap
- JavaScript
- Node.js
- Express
- Sequelize (ORM for MySQL)
- Socket.io
- AWS S3
- Nginx
- MySQL

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/OnkarDivekar07/Real-Time-ChatApplication.git
cd real-time-chat
npm install


.env File Structure

PORT=3000
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET=your-s3-bucket-name
SECRET_KEY=your-secret-key
DB_NAME=yourDB_Name
DB_USER=UserName
DB_PASSWORD=DB_PASSWORD
DB_HOST=DB_HOST
BUCKET_NAME=BUCKET_NAME

*Update the values accordingly.

npm start
