@echo off
taskkill /F /IM node.exe >nul 2>&1
echo Restarting Dev Server...
rmdir /s /q .next
call pnpm dev
