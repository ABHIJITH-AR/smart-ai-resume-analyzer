import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ANALYSES_FILE = path.join(DATA_DIR, "analyses.json");

// Ensure data folder and files exist
function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), "utf8");
  }
  if (!fs.existsSync(ANALYSES_FILE)) {
    fs.writeFileSync(ANALYSES_FILE, JSON.stringify([], null, 2), "utf8");
  }

  // Seed Abhijith under abhijith90711@gmail.com with password123 if not already present
  try {
    const rawUsers = fs.readFileSync(USERS_FILE, "utf8");
    const usersList = JSON.parse(rawUsers);
    const hasUser = usersList.some((u: any) => u.email.toLowerCase() === "abhijith90711@gmail.com");
    if (!hasUser) {
      usersList.push({
        id: "u-seeded-user-2026",
        name: "Abhijith",
        email: "abhijith90711@gmail.com",
        password: "$2b$10$qpN1hHIKK9wZIUDKrNWmteiM27nRfXdMHUxFfbpRXlouMV1QTIbSa", // bcrypt hash for "password123"
        avatar: "",
        createdAt: new Date().toISOString()
      });
      fs.writeFileSync(USERS_FILE, JSON.stringify(usersList, null, 2), "utf8");
    }
  } catch (e) {
    console.error("Failed to seed initial user:", e);
  }

  // Ensure uploads directory exists too
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

// Read and Write Helpers
export function readUsers(): any[] {
  initDB();
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export function writeUsers(users: any[]): void {
  initDB();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export function readAnalyses(): any[] {
  initDB();
  try {
    const data = fs.readFileSync(ANALYSES_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export function writeAnalyses(analyses: any[]): void {
  initDB();
  fs.writeFileSync(ANALYSES_FILE, JSON.stringify(analyses, null, 2), "utf8");
}

initDB();
