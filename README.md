# Notes App - Documentation

## 📋 Deskripsi Aplikasi

Notes App adalah aplikasi catatan (notes) fullstack modern yang dibangun dengan **Next.js 15**, **Prisma ORM**, dan **PostgreSQL (Railway)**. Aplikasi ini memungkinkan pengguna untuk membuat akun, login, dan mengelola catatan pribadi mereka dengan antarmuka yang modern dan minimalis.

---

## 🚀 Fitur Utama

### 1. **Authentication**
- ✅ Register akun baru
- ✅ Login dengan username dan password
- ✅ Session management menggunakan localStorage
- ✅ Logout functionality

### 2. **Notes Management (CRUD)**
- ✅ **Create**: Buat catatan baru dengan modal form
- ✅ **Read**: Tampilkan semua catatan user dalam bentuk card grid
- ✅ **Update**: Edit catatan yang sudah ada
- ✅ **Delete**: Hapus catatan dengan konfirmasi
- ✅ **Auto-truncate**: Title dan content otomatis terpotong jika terlalu panjang

### 3. **Profile Management**
- ✅ Upload profile picture (PNG, JPG, JPEG)
- ✅ Update username
- ✅ Change password
- ✅ Validasi file type dan size (max 5MB)
- ✅ Profile picture ditampilkan di dashboard header

### 4. **UI/UX**
- ✅ Responsive design (mobile-friendly)
- ✅ Modern gradient background
- ✅ Modal dengan blur backdrop effect
- ✅ Card-based layout untuk notes
- ✅ Hover effects dan smooth transitions
- ✅ Loading states dan error handling

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.4** (App Router)
- **React 19.1.0**
- **TypeScript**
- **Tailwind CSS 4**

### Backend
- **Next.js API Routes**
- **Prisma ORM 6.16.3**
- **PostgreSQL** (Railway Database)

### Development Tools
- **ESLint**
- **Turbopack** (Fast Refresh)

---

## 📁 Struktur Proyek

```
postgres-note/
├── app/
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/
│   │   │   ├── login/route.ts    # Login endpoint
│   │   │   └── register/route.ts # Register endpoint
│   │   ├── notes/
│   │   │   ├── route.ts          # GET & POST notes
│   │   │   └── [id]/route.ts     # PUT & DELETE note by ID
│   │   └── users/
│   │       ├── route.ts          # GET & PUT user profile
│   │       └── update/route.ts   # PUT username/password
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard page (Notes display)
│   ├── profile/
│   │   └── page.tsx              # Profile settings page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page (Login/Register)
│   └── globals.css               # Global styles
├── lib/
│   ├── prisma.ts                 # Prisma client instance
│   └── generated/prisma/         # Generated Prisma Client
├── prisma/
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

---

## 📊 Database Schema

### **Table: users**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `INT` | PRIMARY KEY, AUTO INCREMENT | User ID |
| `username` | `VARCHAR` | UNIQUE, NOT NULL | Username (unik) |
| `password` | `VARCHAR` | NOT NULL | Password (plain text - dev only) |
| `profile_picture` | `TEXT` | NULLABLE | Base64 encoded image |

### **Table: notes**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `INT` | PRIMARY KEY, AUTO INCREMENT | Note ID |
| `user_id` | `INT` | FOREIGN KEY (users.id), ON DELETE CASCADE | Owner user ID |
| `title` | `VARCHAR` | NOT NULL | Note title |
| `content` | `TEXT` | NOT NULL | Note content |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |

**Relasi:**
- `User` → `Note` (One to Many)
- Cascade delete: Jika user dihapus, semua notes miliknya ikut terhapus

---

## ⚙️ Setup & Installation

### 1. **Clone Repository**
```bash
git clone <repository-url>
cd postgres-note
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Setup Environment Variables**
Buat file `.env` di root project:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Untuk Railway:**
- Copy `DATABASE_URL` dari Railway Dashboard → Variables

### 4. **Setup Database**
```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# (Optional) Open Prisma Studio untuk melihat data
npx prisma studio
```

### 5. **Run Development Server**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

---

## 🔌 API Endpoints

### **Authentication**

#### POST `/api/auth/register`
Register user baru
```json
// Request Body
{
  "username": "john_doe",
  "password": "password123"
}

// Response (Success)
{
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

#### POST `/api/auth/login`
Login user
```json
// Request Body
{
  "username": "john_doe",
  "password": "password123"
}

// Response (Success)
{
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

---

### **Notes**

#### GET `/api/notes?userId={userId}`
Get semua notes milik user
```json
// Response
{
  "notes": [
    {
      "id": 1,
      "user_id": 1,
      "title": "My First Note",
      "content": "This is the content...",
      "created_at": "2025-10-07T10:30:00Z"
    }
  ]
}
```

#### POST `/api/notes`
Create note baru
```json
// Request Body
{
  "userId": 1,
  "title": "New Note",
  "content": "Content here..."
}

// Response
{
  "note": {
    "id": 2,
    "user_id": 1,
    "title": "New Note",
    "content": "Content here...",
    "created_at": "2025-10-07T11:00:00Z"
  }
}
```

#### PUT `/api/notes/{id}`
Update note
```json
// Request Body
{
  "title": "Updated Title",
  "content": "Updated content..."
}

// Response
{
  "note": {
    "id": 1,
    "user_id": 1,
    "title": "Updated Title",
    "content": "Updated content...",
    "created_at": "2025-10-07T10:30:00Z"
  }
}
```

#### DELETE `/api/notes/{id}`
Delete note
```json
// Response
{
  "message": "Note deleted"
}
```

---

### **User Profile**

#### GET `/api/users?userId={userId}`
Get user profile
```json
// Response
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "profile_picture": "data:image/png;base64,..."
  }
}
```

#### PUT `/api/users`
Update profile picture
```
// Form Data
userId: 1
profilePicture: <File>

// Response
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "profile_picture": "data:image/png;base64,..."
  }
}
```

#### PUT `/api/users/update`
Update username atau password
```json
// Request Body (Update Username)
{
  "userId": 1,
  "username": "new_username"
}

// Request Body (Update Password)
{
  "userId": 1,
  "currentPassword": "oldpass123",
  "password": "newpass123"
}

// Response
{
  "user": {
    "id": 1,
    "username": "new_username",
    "profile_picture": "data:image/png;base64,..."
  }
}
```

---

## 🎨 User Flow

### 1. **Landing Page** (`/`)
- User melihat form login/register dengan toggle
- Input username dan password
- Klik "Login" atau "Register"
- Jika berhasil → redirect ke `/dashboard`

### 2. **Dashboard** (`/dashboard`)
- Header menampilkan profile picture + username
- Tombol "Create Note" untuk buat catatan baru
- Grid cards menampilkan semua notes user
- Setiap card:
  - Title (truncated jika >50 char)
  - Content (truncated jika >100 char)
  - Created date
  - Button "Edit" dan "Delete"
- Klik profile picture → redirect ke `/profile`

### 3. **Profile Page** (`/profile`)
- Section 1: Upload Profile Picture
  - Preview gambar
  - File input (accept: PNG, JPG, JPEG)
  - Validasi max 5MB
- Section 2: Change Username
  - Input username baru
  - Validasi uniqueness
- Section 3: Change Password
  - Current password
  - New password (min 6 chars)
  - Confirm password
- Tombol "Back to Dashboard"

---

## 🔒 Security Notes

⚠️ **PENTING: Aplikasi ini untuk development/learning purposes**

### Current Security Issues:
1. **Password Plain Text**: Password disimpan tanpa hashing
2. **No HTTPS**: Communication tidak encrypted
3. **localStorage Session**: Vulnerable to XSS attacks
4. **Base64 Images**: Tidak efisien untuk production

### Recommendations untuk Production:
1. **Hash Password**: Gunakan `bcrypt` atau `argon2`
   ```bash
   npm install bcrypt
   ```
2. **JWT Authentication**: Gunakan JWT untuk session management
3. **Image Storage**: Pindahkan ke cloud storage (AWS S3, Cloudinary)
4. **Input Sanitization**: Gunakan `sanitize-html` untuk prevent XSS
5. **Rate Limiting**: Implementasi rate limiting untuk API routes
6. **CSRF Protection**: Tambahkan CSRF tokens
7. **Environment Variables**: Jangan commit `.env` ke Git

---

## 🧪 Testing

### Manual Testing Checklist:
- [ ] Register akun baru
- [ ] Login dengan credentials
- [ ] Create note baru
- [ ] Edit note yang ada
- [ ] Delete note dengan konfirmasi
- [ ] Upload profile picture
- [ ] Update username
- [ ] Change password
- [ ] Logout dan login lagi
- [ ] Responsive di mobile device

---

## 🐛 Common Issues & Solutions

### 1. **Cannot connect to database**
```
Error: P1001: Can't reach database server
```
**Solution:**
- Pastikan Railway database aktif
- Check `DATABASE_URL` di `.env`
- Coba koneksi dari jaringan lain (VPN jika perlu)

### 2. **Prisma Client not generated**
```
Error: Cannot find module '@prisma/client'
```
**Solution:**
```bash
npx prisma generate
```

### 3. **Port 3000 already in use**
```bash
# Kill process di port 3000
npx kill-port 3000

# Atau gunakan port lain
PORT=3001 npm run dev
```

### 4. **Profile picture tidak muncul**
- Check browser console untuk error
- Pastikan file size < 5MB
- Pastikan file type PNG/JPG/JPEG

---

## 📦 Deployment

### Deploy ke Vercel:
1. Push code ke GitHub
2. Import project di Vercel
3. Add environment variable `DATABASE_URL`
4. Deploy

### Deploy ke Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

---

## 📝 Roadmap & Future Improvements

### Planned Features:
- [ ] Rich text editor untuk notes
- [ ] Tags/categories untuk notes
- [ ] Search functionality
- [ ] Dark mode
- [ ] Email verification
- [ ] Password reset via email
- [ ] Note sharing
- [ ] Export notes (PDF, Markdown)
- [ ] Collaboration features
- [ ] Mobile app (React Native)

### Performance Optimization:
- [ ] Image compression untuk profile pictures
- [ ] Pagination untuk notes list
- [ ] Redis caching
- [ ] CDN untuk static assets

---

## 👥 Contributing

Jika ingin berkontribusi:
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is for educational purposes.

---

## 📞 Support

Jika ada pertanyaan atau issue:
- Open GitHub Issue
- Email: your-email@example.com

---

**Happy Coding! 🚀**
