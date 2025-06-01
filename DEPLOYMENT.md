🚀 Deployment Guide – devConn
This guide walks you through deploying the devConn full-stack app, which includes a Node.js backend and a React frontend, using PM2 and Nginx on a Linux server.

---

🔁 Clone the Project
```bash
~ git clone https://github.com/durgeshpd/devConn.git
~ cd devConn/
```

🛠️ Backend Setup
Navigate to the backend folder:
```bash
~ cd devConn-backend/
```

Create a .env file:
```bash
~ nano .env
```

```bash

Add the following contents:

# MongoDB connection URI
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Server port
PORT=5000

# JWT secret key
JWT_SECRET=your_jwt_secret_here
⚠️ Replace placeholders (<username>, <password>, etc.) with actual values.

```

Install dependencies:
```bash
~ npm install
```

Start the backend with PM2:
```bash
~ pm2 start src/server.js --name devconn-backend
```

Optional: Save PM2 process list and enable startup script:
```bash
~ pm2 save
~ pm2 startup
```

🌐 Frontend Setup
Navigate to the frontend folder:
```bash
~ cd ../devConn-frontend/
```

Install dependencies and build the project:
```bash
~ npm install
~ npm run build
```

Copy the build to Nginx’s default web directory:
```bash
~ sudo mkdir -p /var/www/html
~ sudo cp -r dist/* /var/www/html
```

⚙️ Nginx Configuration
Edit the default site config:

```bash
~ sudo nano /etc/nginx/sites-available/default
```

Update or ensure the config looks like:

server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm;

    server_name _;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

Test Nginx configuration:
```bash
~ sudo nginx -t
```

Reload Nginx:
```bash
~ sudo systemctl reload nginx
```

✅ Done!

Your app should now be accessible in the browser at your server’s IP or domain.

🧪 Troubleshooting
Check backend logs:
```bash
~ pm2 logs devconn-backend
```

Restart PM2 app:
```bash
~ pm2 restart devconn-backend
```

View frontend build:
Open your server IP in a browser, e.g., http://your-server-ip
