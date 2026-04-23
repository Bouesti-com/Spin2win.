Spin2Win — Minimal demo (Signal share flow)

Structure
- backend/  => Node/Express API (serve on Render)
- frontend/ => static site (deploy to Vercel)

Quick phone-friendly upload & deploy steps
1) Upload files to GitHub (phone)
   - In your repo (Spin2win) tap "Add file" → "Create new file"
   - Create the path backend/package.json → paste contents → Commit new file
   - Repeat for backend/db.json and backend/index.js
   - Then create frontend/index.html, frontend/admin.html, frontend/style.css
   - Finally create README.md at repo root
   - Commit each file as you go

2) Deploy backend to Render
   - Go to https://render.com and sign in
   - Create → Web Service → Connect to GitHub → select Bouesti-com/Spin2win
   - Name: spin2win-backend
   - Branch: main
   - Build Command: (leave blank)
   - Start Command: node backend/index.js
   - Environment: set PORT (Render sets it automatically), optionally set:
     - SIGNAL_SUPPLIER (e.g. +15075812264)
     - ADMIN_EMAIL, ADMIN_PASSWORD
     - REQUIRED_SHARES
   - Create service and wait for it to become live; copy the service URL (https://your-service.onrender.com)

3) Deploy frontend to Vercel
   - Go to https://vercel.com/import and select "Import Git Repository" → choose Bouesti-com/Spin2win
   - Set Root Directory to frontend
   - Framework: Other / Static
   - Build Command: (leave blank)
   - Output Directory: (leave blank)
   - Environment variable BACKEND_URL = https://your-service.onrender.com
   - Deploy

4) Test flow (mobile recommended)
   - Open the Vercel frontend URL on your phone
   - In Admin page (open /admin.html), set Signal supplier and required shares, then Seed
   - Use the Spin page: set a user id (guest1), call the backend endpoint to simulate confirmations:
     - Confirmations can be increased by POST /api/confirm/:userId (call from terminal or Postman) or by using a simple curl:
       curl -X POST https://your-service.onrender.com/api/confirm/guest1
   - After required confirmations, open Spin page and tap "Spin" → then "Share via Signal" (uses share sheet or copies message to clipboard)

Security note
- This demo keeps admin endpoints unauthenticated for simplicity. For production add authentication and secure signal sending.
- If you want server-side automated Signal messages, you must run signal-cli or a third-party provider (I can provide that plan).

If you want I can now:
- Walk you through every upload step (one file at a time) — say "Start upload" and I'll send the first create-file step.
- Or you can paste files yourself using the file list above.

Which next? Say "Start upload" to proceed file-by-file (I’ll send the exact first Add file action). 
