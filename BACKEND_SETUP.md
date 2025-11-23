# LUNA NEXUS - Backend Server Setup

---

## Overview

This document describes the new backend server that provides real system access capabilities for LUNA NEXUS agents. The backend enables agents to execute shell commands, manage files, run Python code, and perform web searches with a permission-based security system.

## Architecture

### Backend Server (Node.js/Express)
- **Location**: `backend/server.js`
- **Port**: 3001
- **Tech Stack**: Express.js, Node.js, axios

### Permission System
- **Component**: `components/PermissionModal.tsx`
- **Configuration**: `services/toolPermissions.ts`
- **Risk Levels**:
  - `SAFE`: No permission needed (e.g., finish, web_search)
  - `LOW`: Ask once per session (e.g., python_interpreter)
  - `MEDIUM`: Ask every time (e.g., file_writer)
  - `HIGH`: Ask with warning (e.g., shell_executor)
  - `CRITICAL`: Ask with strong warning (e.g., host_shell_executor, host_file_manager)

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start Backend Server

```bash
# In terminal 1 - Start backend
cd backend
npm start

# The server will start on http://localhost:5000
```

### 3. Start Frontend

```bash
# In terminal 2 - Start frontend
cd /home/user/Nexus-ai
npm run dev

# The frontend will start on http://localhost:5173 (or similar)
```

## Backend API Endpoints

### Health Check
```bash
GET /api/health
```

### Shell Commands
```bash
POST /api/shell
{
  "command": "ls -la"
}
```

### File Operations
```bash
POST /api/file
{
  "operation": "read|write|delete|list|mkdir",
  "filepath": "/path/to/file",
  "content": "file content" # for write operation
}
```

### Python Execution
```bash
POST /api/python
{
  "code": "print('Hello World')"
}
```

### Web Search
```bash
POST /api/search
{
  "query": "search terms"
}
```

### Network Operations
```bash
POST /api/network
{
  "command": "ping",
  "args": "-c 4 google.com"
}
```

## Security Considerations

⚠️ **WARNING**: This backend provides unrestricted system access!

### Recommendations:
1. **Only run on local machine**: Never expose this server to the internet
2. **Use permission dialogs**: Always review what the AI wants to execute
3. **Monitor logs**: Check console for all executed commands
4. **Test in isolated environment**: Consider using a VM or container
5. **Review code before execution**: Especially for CRITICAL risk operations

### Permission Modal
- Appears before each risky operation
- Shows the tool name, arguments, and risk level
- Can be approved or denied
- LOW risk tools remember approval for the session
- CRITICAL operations show detailed warnings

## Testing

Test the backend endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Shell command
curl -X POST http://localhost:5000/api/shell \
  -H "Content-Type: application/json" \
  -d '{"command":"echo Hello World"}'

# Python execution
curl -X POST http://localhost:5000/api/python \
  -H "Content-Type: application/json" \
  -d '{"code":"print(2 + 2)"}'

# File write
curl -X POST http://localhost:5000/api/file \
  -H "Content-Type: application/json" \
  -d '{"operation":"write","filepath":"/tmp/test.txt","content":"Hello"}'

# File read
curl -X POST http://localhost:3001/api/file \
  -H "Content-Type: application/json" \
  -d '{"operation":"read","filepath":"/tmp/test.txt"}'
```

## Agent Tools

The following tools now use the real backend:

### LUNA Tools (General Purpose)
- `finish` - Complete task (SAFE)
- `web_search` - Real DuckDuckGo search (SAFE)
- `python_interpreter` - Execute Python code (LOW)
- `file_writer` - Write files (MEDIUM)

### ODIN Tools (Security)
- `shell_executor` - Execute shell commands (HIGH)

### PROMETHEUS Tools (Unrestricted)
- `host_shell_executor` - Root shell access (CRITICAL)
- `host_file_manager` - Full file system access (CRITICAL)
- `host_network_manager` - Network operations (CRITICAL)
- `host_web_browser` - Web browsing (CRITICAL)
- `host_code_environment` - Code execution (CRITICAL)
- `tool_creator` - Self-modification (CRITICAL)

## Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development

The permission system is integrated into:
- `hooks/useAgent.ts` - Permission logic and backend calls
- `components/AgentConsole.tsx` - Modal integration
- `components/PermissionModal.tsx` - Modal UI
- `services/toolPermissions.ts` - Risk level configuration

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Ensure Node.js is installed (`node --version`)
- Check npm dependencies are installed

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check CORS settings in `backend/server.js`
- Verify BACKEND_URL in `hooks/useAgent.ts`

### Permission modal not appearing
- Check browser console for errors
- Ensure `pendingPermission` state is being set
- Verify tool name exists in `toolPermissions.ts`

### Python execution fails
- Ensure python3 is installed (`python3 --version`)
- Check /tmp directory permissions
- Review error messages in backend logs

## License

This implementation follows the same license as the main LUNA NEXUS project.

## Contributing

When adding new backend endpoints:
1. Add the route in `backend/server.js`
2. Add the tool call in `hooks/useAgent.ts`
3. Configure risk level in `services/toolPermissions.ts`
4. Test thoroughly before committing
