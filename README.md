# 🚀 Xwake

> Production-ready React Native mobile application built with scalable architecture and clean code principles.

---

## 📌 Overview

Xwake is a cross-platform mobile application built using React Native CLI.  
The Xwake follows a modular, scalable structure suitable for production deployment and long-term maintenance.

Designed with:
- Clean architecture principles
- Optimized rendering performance
- Centralized state management
- Secure authentication handling
- Scalable backend integration

---

## 🏗 Architecture

The application follows a structured layered approach:

- Presentation Layer (Screens & Components)
- State Layer (Redux Toolkit)
- Service Layer (API & Socket Services)
- Utility Layer (Helpers & Reusable Logic)

```
src/
 ├── assets/
 ├── components/
 ├── screens/
 ├── navigation/
 ├── redux/
 │    ├── slices/
 │    ├── store.js
 ├── services/
 │    ├── api.js
 │    ├── socket.js
 ├── utils/
 └── hooks/
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native (CLI) |
| State Management | Redux Toolkit |
| Networking | Axios |
| Authentication | JWT |
| Realtime | Socket.io |
| Backend | Node.js + Express |
| Database | MongoDB |

---

## ✨ Core Features

- Secure Authentication (JWT-based)
- Persistent Login State
- Feed with Optimized FlatList
- Reels Auto-Play (Visibility Controlled)
- Like / Comment System
- Profile Management
- Real-time Updates via WebSockets
- Clean Error Handling & API Layer
- Modular Codebase for Scalability

---

## 🔐 Security Considerations

- Token-based authentication
- Centralized API instance with interceptors
- Error boundary handling
- Secure environment variable management

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/project-name.git
cd project-name
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

---

### 3️⃣ Environment Setup

Create a `.env` file:

```
BASE_URL=https://your-production-api.com
SOCKET_URL=https://your-socket-server.com
```

---

### 4️⃣ Start Metro

```bash
npm start
```

---

### 5️⃣ Run Application

#### Android

```bash
npm run android
```

#### iOS

```bash
cd ios
pod install
cd ..
npm run ios
```

---

## 📈 Performance Optimizations

- Memoized components (React.memo)
- Optimized FlatList rendering
- Viewability tracking for media auto-play
- Controlled re-renders via selectors
- Lazy media loading
- Efficient Redux slice structure

---

## 🧪 Development Practices

- Feature-based folder structure
- Reusable UI components
- Separation of concerns
- Clean API abstraction
- Consistent naming conventions
- Production-ready error handling

---

## 📦 Build Release

### Android Production Build

```bash
cd android
./gradlew assembleRelease
```

Output location:

```
android/app/build/outputs/apk/release/
```

---

## 🔄 CI/CD (Recommended)

For production environments:

- GitHub Actions for automated builds
- Code linting before merge
- Environment-based builds (Dev / Staging / Prod)
- Automated APK generation

---

## 🧩 Scalability Roadmap

- TypeScript migration (if not already)
- Unit & Integration testing
- E2E testing (Detox)
- Code splitting
- Performance monitoring integration
- App Store & Play Store deployment pipelines

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Commit clean, descriptive messages  
4. Open a Pull Request  

---

## 📄 License

Licensed under the MIT License.

---

## 👨‍💻 Maintainer

**Sagar Singh**  
React Native & Full Stack Developer  

---

## ⭐ Support

If you find this project useful, consider starring the repository.