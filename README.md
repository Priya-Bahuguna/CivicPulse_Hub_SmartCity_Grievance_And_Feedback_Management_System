# 🌆CivicPulse Hub Unified Smart City Grievance & Feedback Management System

CivicPulse Hub is a full-stack civic issue management platform that allows citizens to submit and track grievances, officers to update progress, and admins to assign and analyze complaints — all in a secure, role-based system.

---

## 🚀 Features

✔ Citizen complaint submission with **image & location**  
✔ Role-based login (User / Admin / Officer)  
✔ Complaint tracking and status updates  
✔ Feedback & rating after resolution  
✔ Admin analytics dashboard  
✔ Officer dashboard for updates  
✔ JWT Token based authentication

---

## 🛠 Tech Stack

**Frontend:**  
- React + Vite  
- React Router  
- UI Components, Form Validation, Maps, Charts

**Backend:**  
- Java Spring Boot  
- Spring Security  
- JWT (JSON Web Tokens)  
- REST APIs

**Database:**  
- (e.g., MySQL or any SQL DB — update based on your config)

**Dev Tools:**  
- Postman for API testing  
- Git & GitHub version control

---

## 📁 Project Structure

![App Screenshot](https://github.com/user-attachments/assets/2fabfe25-5da9-483f-a0e1-284c43851882)

---

---

## 📌 Setup Instructions

### 🧩 Frontend (React + Vite)

1. **Install dependencies**
```bash
npm install

```

2. **Start development server**
```
npm run dev

```
3. **Access**
```
http://localhost:5173

```
⚙️ Backend (Spring Boot + JWT)
---

1. **Navigate to backend**
```
cd src_backend
```

2. **Install dependencies and build (Maven)**
```
mvn clean install
```
3. **Configure environment**
```
Create application.properties / .env with database and JWT settings
```
#### **Example:**
------
spring.datasource.url=jdbc:mysql://localhost:3306/civicpulse
spring.datasource.username=root
spring.datasource.password=yourpassword
jwt.secret=your_jwt_secret

----
4. **Run server**
```
mvn spring-boot:run
```
5. **Access**
```
http://localhost:8080
```

----
📌 Authentication
--
This project uses JWT Token based authentication to securely protect APIs and provide role-based access control.

---

🧩 Usage Flow
--

Login/Register (User/Admin/Officer)

Citizen submits complaint with image & location

Admin views all complaints and assigns to officers

Officer updates complaint status & resolution notes

Citizen gives feedback & rating after resolution

Analytics dashboard shows complaint insights

---

📸 Screenshots
--

![App Screenshot](https://github.com/user-attachments/assets/69de7048-1f46-40a0-add8-a9819addc6a6)

![App Screenshot](https://github.com/user-attachments/assets/52100a53-4092-4988-8e8f-7c7616889532)

![App Screenshot](https://github.com/user-attachments/assets/b10bb6da-05bd-46be-843f-618a6eba85cc)

![App Screenshot](https://github.com/user-attachments/assets/b9c08433-d9b8-4ea8-96d0-b8849a39cf4a)

![App Screenshot](https://github.com/user-attachments/assets/72382371-2cb2-4754-8d6e-88d9f9b3eb94)

![App Screenshot](https://github.com/user-attachments/assets/5fb6b3c8-762f-4cb3-9de7-aa41bb94e4d0)

![App Screenshot](https://github.com/user-attachments/assets/d149993b-30ad-437b-ad88-7925d2ee7590)

![App Screenshot](https://github.com/user-attachments/assets/a6571269-1145-423c-b4a9-a41a5b3ebea9)

![App Screenshot](https://github.com/user-attachments/assets/efce3567-b977-45d8-85c5-a819059e5ba9)

![App Screenshot](https://github.com/user-attachments/assets/6c28b78e-4d75-4918-a429-c64e2f42e0f3)
