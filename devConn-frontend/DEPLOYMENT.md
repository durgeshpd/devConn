git clone https://github.com/durgeshpd/devConn.git

cd devConn/

cd ~/devConn/devConn-backend

nano .env

# MongoDB connection URI
MONGO_URI=your_mongodb_connection_string_here/dbname?retryWrites=true&w=majority

# Server port
PORT=5000

# JWT secret key
JWT_SECRET=your_jwt_secret_here

npm install

pm2 start src/server.js --name devconn-backend

Deploy frontend

cd ~/devConn/devConn-frontend

npm install

npm run build

sudo mkdir -p /var/www/html

sudo cp -r dist/* /var/www/html

sudo nano /etc/nginx/sites-available/default

sudo nginx -t

sudo systemctl reload nginx
