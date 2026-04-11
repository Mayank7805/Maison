@echo off
taskkill /F /IM node.exe >nul 2>&1
echo Cleaning and Starting Dev Sequence...
call pnpm add next-auth@beta @auth/prisma-adapter @tanstack/react-query @tanstack/query-core zustand immer bcryptjs
call pnpm add -D @types/bcryptjs tailwindcss@3 postcss autoprefixer
rmdir /s /q .next
call pnpm install
call pnpm prisma generate
call pnpm dev
