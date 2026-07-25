# PawHaven Server (`sarver`)

Express + MongoDB API for the PawHaven pet adoption client.

## Setup

```powershell
cd "D:\Assingmant\assinment-9\sarver"
npm install
copy .env.example .env
npm run dev
```

## Environment

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/
PORT=8000
```

## Main endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | Health |
| GET | `/pets` | No | List pets (`search`, `species` query) |
| GET | `/pets/:id` | Yes* | Single pet |
| POST | `/pets-add` | Yes* | Create pet |
| GET | `/pet/:id` | Yes* | Pets by user id |
| PUT | `/update-pet/:id` | Yes* | Update pet |
| DELETE | `/delete-pat/:id` | Yes* | Delete pet |
| POST | `/request-pet` | Yes* | Create adoption request |
| GET | `/my-request/:id` | Yes* | User requests |
| PUT | `/request-status/:id` | Yes* | Update request status |
| GET | `/request-pet/:id` | Yes* | Requests for a pet |

\* Auth header must be present (`Authorization: Bearer …`). Middleware currently checks presence for assignment flow.

Database name: **`petadaption`** · collection used for pets/requests: **`usersCollection`** (legacy name kept for compatibility).

## Related

- Client: https://github.com/riazuddin-dev/petadeption  
