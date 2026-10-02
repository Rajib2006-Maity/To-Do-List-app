# To-Do App (Express + MongoDB + vanilla JS)

## Run it
1. Install Node 18+ and MongoDB (or create a free MongoDB Atlas cluster).
2. In this folder:
   ```bash
   npm install
   cp .env.example .env     # edit MONGO_URI if needed
   npm start
   ```
3. Open http://localhost:3000

## API
| Method | Route             | Purpose                              |
|--------|-------------------|--------------------------------------|
| GET    | /api/todos        | List tasks                           |
| POST   | /api/todos        | Create `{ title }`                   |
| PATCH  | /api/todos/:id    | Update `{ title?, completed? }`      |
| DELETE | /api/todos/:id    | Delete one task                      |
| DELETE | /api/todos        | Delete all completed tasks           |
