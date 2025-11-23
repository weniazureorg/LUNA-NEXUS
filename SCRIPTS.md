# Scripts Reference

## Available Launch Scripts

### 🚀 Quick Start (Recommended)

#### `run-dev.bat`

**Purpose**: Start both backend and frontend in development mode  
**Opens**: Browser at http://localhost:3000/  
**Best for**: Testing, development, debugging

```powershell
.\run-dev.bat
```

---

### 📦 Production Scripts

#### `run-luna-full.bat`

**Purpose**: Start backend + installed Electron app  
**Opens**: Desktop application window  
**Best for**: Daily use after installation

```powershell
.\run-luna-full.bat
```

**Requirements**: Must have run `npm run electron:build` and installed the app first.

---

### 🔧 Alternative Scripts

#### `START-NEXUS.bat`

**Purpose**: Same as `run-dev.bat` (legacy name)  
**Opens**: Browser at http://localhost:3000/

```powershell
.\START-NEXUS.bat
```

#### `start-luna.bat`

**Purpose**: Start backend + Electron in dev mode  
**Opens**: Electron window (dev mode with hot reload)

```powershell
.\start-luna.bat
```

---

### 🛑 Stop Scripts

#### `STOP-NEXUS.bat`

**Purpose**: Stop all running servers

```powershell
.\STOP-NEXUS.bat
```

Stops:

- Python backend (Flask)
- Node.js/Vite dev server
- Electron app

---

## NPM Scripts (package.json)

### Development

```powershell
npm run dev                # Start Vite dev server (port 3000)
npm run electron:dev       # Start Electron in dev mode
```

### Production

```powershell
npm run build              # Build React app to dist/
npm run electron:build     # Build + package Electron app
npm run preview            # Preview production build
```

---

## Manual Commands

### Start Backend Only

```powershell
cd backend
.\venv\Scripts\python.exe server.py
```

### Start Frontend Only (Dev)

```powershell
npm run dev
```

### Start Frontend Only (Prod Preview)

```powershell
npm run build
npm run preview
```

---

## Recommended Workflow

### For Development/Testing

1. Run: `.\run-dev.bat`
2. Open: http://localhost:3000/
3. Edit code (hot reload enabled)
4. Stop: `.\STOP-NEXUS.bat`

### For Production Use

1. Build once: `npm run electron:build`
2. Install: `release\Luna-Dolph-AI-Setup-0.0.0.exe`
3. Run: `.\run-luna-full.bat`
4. Stop: Close app window + backend console

---

## Port Reference

| Service         | Port  | URL                     |
| --------------- | ----- | ----------------------- |
| Vite Dev Server | 3000  | http://localhost:3000/  |
| Python Backend  | 5000  | http://localhost:5000/  |
| Ollama          | 11434 | http://localhost:11434/ |
| Vite Preview    | 4173  | http://localhost:4173/  |

---

## Troubleshooting

### "Port already in use"

```powershell
.\STOP-NEXUS.bat
```

### "Backend not responding"

```powershell
# Check if running:
netstat -ano | findstr :5000

# Restart:
cd backend
.\venv\Scripts\python.exe server.py
```

### "Vite dev server not starting"

```powershell
# Kill node processes:
Stop-Process -Name node -Force

# Restart:
npm run dev
```
