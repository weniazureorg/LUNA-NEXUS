# Quick Start Guide

## 🚀 Fastest Way to Run the App

### For Testing/Development (Recommended)

1. **Run the dev launcher:**

   ```powershell
   .\run-dev.bat
   ```

2. **Open your browser:**
   ```
   http://localhost:3000/
   ```

That's it! Both backend and frontend will start automatically.

---

## 📝 What You Need First

### One-Time Setup

1. **Install Ollama models:**

   ```powershell
   ollama pull dolphin-llama3
   ollama pull qwen2.5:7b
   ```

2. **Install dependencies:**

   ```powershell
   npm install

   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

3. **Configure API keys (optional):**

   Create `.env.local`:

   ```env
   GEMINI_API_KEY=your_key_here
   VERTEX_API_KEY=your_key_here
   ```

---

Opens as a desktop application.

---

## ✅ Verify Everything Works

### Test 1: Chat (Dolphin)

1. Go to **Luna Console**
2. Select **🐬 Dolphin Llama 3**
3. Type "Hello"
4. Should get uncensored response

### Test 2: Image Generation

1. Go to **Image Studio**
2. Enter prompt: "A futuristic city"
3. Click **Generate**
4. Wait for image (CPU: 5-10 min, GPU: 30 sec)

### Test 3: Web Search

1. Go to **Grounded Search**
2. Search: "Current price of Bitcoin"
3. Should get real DuckDuckGo results

### Test 4: Autonomous Agent

1. Go to **Agent Console**
2. Select Dolphin/Qwen agent
3. Toggle **Autonomous Mode** ON
4. Enter: "Create a file test.txt with 'hello', then read it"
5. Watch it execute automatically

---

## 🔧 Troubleshooting

### "Models not working"

```powershell
ollama list  # Check if models are installed
ollama pull dolphin-llama3
ollama pull qwen2.5:7b
```

### "Backend not starting"

```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

### "Port already in use"

```powershell
Stop-Process -Name python -Force
Stop-Process -Name node -Force
```

---

## 📚 Full Documentation

- **README.md** - Complete deployment guide
- **architecture_and_workflow.md** - How it works
- **walkthrough.md** - Detailed verification steps

---

**Need help?** Check the full README.md for detailed instructions.
