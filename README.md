
# 📦 InventoryDashboard

**InventoryDashboard** is a full-stack inventory management system for handling products and categories. The app is built with a modern frontend (Next.js) and a fast, secure backend (FastAPI), connected to a PostgreSQL database.

> 🔧 Future plans include implementing role-based access control (RBAC) with Admin and Staff user roles.

---

## 🛠 Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | Next.js                       |
| Backend   | FastAPI                       |
| Database  | PostgreSQL                    |
| Deployment| Render (planned)              |

---

## 📁 Project Structure

```
InventoryDashboard/
├── frontend/   # Next.js application (excludes .next and node_modules)
└── backend/    # FastAPI application (full code uploaded)
```

---

## 🚀 Getting Started

### 🔧 Backend Setup (FastAPI)

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up `.env` file with your database config:
   ```env
   DATABASE_URL=postgresql://username:password@localhost/dbname
   SECRET_KEY=your-secret-key
   Algorithm = Your algorithm
   Access_Token_Expiry_Minute=30
   ```

5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

---

### 🖥️ Frontend Setup (Next.js)

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open in browser:
   ```
   http://localhost:3000
   ```

---

## 🔐 Access Control (Current State)

- **All users currently have the same access level**.
- Users can:
  - Add products
  - Add categories
  - View existing data
- Admin vs Staff permissions will be introduced in a future update.

---

## 🔮 Future Implementation

- Implement **Role-Based Access Control (RBAC)** with two roles:
  - **Admin**: Full permissions to add, edit, and delete categories and products.
  - **Staff**: Can add products only, based on existing categories; no permission to edit or delete.

- Add user authentication and authorization to secure access to the API.

- Improve UI/UX for better user experience and accessibility.

- Add automated tests and CI/CD pipelines for deployment.

- Support deployment with Docker containers for easier scalability.

- Add real-time inventory updates using WebSockets or similar technology.

---

## 📦 Deployment (Render)

- Frontend will be deployed on **Vercel** or **Render**
- Backend will be deployed on **Render**
- Database: Render PostgreSQL or external managed DB

---

## 🧑‍💻 Author

**Hassan Khan**  
GitHub: [@HassanNetSec](https://github.com/HassanNetSec)

---

## 📄 License

This project is licensed under the MIT License.
