# Cyber-Fort

This project is a secure web application for a Tech Blog platform where tech enthusiasts can sign in, share thoughts, and engage in discussions through posts, likes, and comments. The app emphasizes security practices at both the frontend and backend to ensure user safety and protection from common vulnerabilities.

## Features

- **User Authentication**: Users can sign up, log in, and securely manage their sessions.
- **CRUD Operations**: Users can create, read, update, and delete posts.
- **Like & Commenting System**: Users can like and comment on posts.
- **Password Security**: Passwords are hashed and salted using bcrypt to ensure secure storage.
- **Captcha Protection**: Google reCAPTCHA is implemented to protect against bot attacks.
- **Input Validation**: Inputs are validated on both frontend and backend to avoid invalid data and potential attacks.
- **Rate Limiting**: To prevent brute-force attacks, the app uses Express Rate Limiter to limit repeated requests.
- **SQL Injection Protection**: Sequelize ORM is used to safely interact with the database and avoid SQL injection.
- **Cross-Site Scripting (XSS) Protection**: Input sanitization is done using express-xss-sanitizer.
- **Logging**: All events are logged using the Winston library to monitor activity and errors.
- **Vulnerability Scanning**: SonarQube is used to analyze the code for vulnerabilities and improve code quality.

### Technologies Used

- **Frontend**:ReactJS
- **Backend**: ExpressJS (NodeJS)
- **Database**: MySQL
- **Authentication & Authorization**: bcrypt (Password Hashing with Salt), JWT Tokens
- **Security Practices**: Google reCAPTCHA, Input Validation, SQL Injection Prevention (Sequelize), XSS Protection (express-xss-sanitizer)
- **Session Management**: Express Rate Limiter
- **Logging**: Winston
- **Code Vulnerability Analysis**: SonarQube




