# CNC G-code Generator Website

A lightweight static website for generating CNC `.nc` files for:

- `*_hole.nc`
- `*_edge.nc`

based on a user-entered hole count.

## 1. Project structure

```text
cnc-gcode-site/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## 2. Local preview

Because this is a pure front-end project, you can preview it in several ways:

### Option A: open directly

Double-click `index.html`.

### Option B: WebStorm built-in preview

Open the project folder in WebStorm and use the browser preview.

### Option C: run a tiny local server

If you have Python 3 installed:

```bash
cd cnc-gcode-site
python3 -m http.server 8080
```

Then open:

```text
http://127.0.0.1:8080
```

---

## 3. Recommended deployment on Tencent Cloud Lighthouse / Ubuntu server

This project does **not** need Node.js, database, or backend.
You only need Nginx to serve static files.

### Step 1: SSH into your server

```bash
ssh ubuntu@YOUR_SERVER_IP
```

### Step 2: install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### Step 3: create site directory

```bash
sudo mkdir -p /var/www/cnc-gcode-site
sudo chown -R $USER:$USER /var/www/cnc-gcode-site
```

### Step 4: upload files to server

You can use either:

- WebStorm Deployment (SFTP)
- `scp`
- FileZilla / Cyberduck

Example using `scp` on your local machine:

```bash
scp -r cnc-gcode-site/* ubuntu@YOUR_SERVER_IP:/var/www/cnc-gcode-site/
```

### Step 5: create Nginx site config

```bash
sudo nano /etc/nginx/sites-available/cnc-gcode-site
```

Paste:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/cnc-gcode-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Step 6: enable the site

```bash
sudo ln -s /etc/nginx/sites-available/cnc-gcode-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: open firewall

If you use UFW:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

---

## 4. Bind a real domain

### At your domain provider or DNS console

Add:

- `A` record for `@` -> your server public IP
- `A` record for `www` -> your server public IP

After DNS is updated, your domain will point to the server.

---

## 5. Enable HTTPS with Certbot

After the domain already resolves to your server and port 80 is reachable:

```bash
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

To test certificate renewal:

```bash
sudo certbot renew --dry-run
```

---

## 6. Suggested WebStorm workflow

1. Open this folder in WebStorm.
2. Modify `script.js` if your CNC rules change later.
3. Modify `styles.css` for UI changes.
4. Test locally.
5. Upload to `/var/www/cnc-gcode-site/`.
6. Reload Nginx on the server.

---

## 7. Future expansion ideas

You can later extend this project with:

- multiple CNC templates
- material type selector
- tool diameter selector
- machine profile selector
- history export
- login / admin panel
- backend file storage

