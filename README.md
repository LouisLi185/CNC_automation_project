# CNC G-code Generator

A modern, lightweight static website for automatically generating CNC `.nc` files for aluminum bar machining operations. This tool eliminates manual G-code writing by generating precise hole drilling and edge profiling programs based on simple user inputs.

![CNC G-code Generator Demo](Screenshot%202026-03-10%20at%2012.54.55%E2%80%AFAM.png)

---

## Features

- **Automated G-code Generation**: Generate `_hole.nc` and `_edge.nc` files instantly
- **Smart Calculations**: Automatic bar length and Y-position calculations
- **User-Friendly Interface**: Clean, modern UI with real-time validation
- **Copy & Download**: One-click copy to clipboard or download as `.nc` files
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **No Backend Required**: Pure static frontend - deploy anywhere

---

## Project Structure

```
cnc-gcode-site/
├── index.html          # Main HTML structure with semantic markup
├── styles.css          # Custom CSS with modern glassmorphism design
├── script.js           # G-code generation logic and form handling
├── README.md           # Project documentation
└── .idea/              # WebStorm IDE configuration files
```

### File Descriptions

| File | Purpose |
|------|---------|
| `index.html` | Contains the page layout including hero section, input form, and result display cards |
| `styles.css` | Implements a dark theme with gradient backgrounds, glassmorphism effects, and responsive grid layouts |
| `script.js` | Handles form validation, G-code generation algorithms, clipboard operations, and file downloads |

---

## How It Works

### Machining Parameters

This generator is designed for **aluminum bars with 1 mm thickness**. The G-code follows these rules:

- **Hole positions**: Start from Y10, with 20 mm spacing between consecutive holes
- **Bar length**: Automatically calculated as `20 × hole count` (in mm)
- **Edge program Y value**: Calculated as `20n + 2` where n is the hole count

### Generated Files

For each job, two files are created:

1. **`{filename}_hole.nc`** - Drilling program for all holes
2. **`{filename}_edge.nc`** - Edge profiling/milling program

---

## Usage Instructions

### Step 1: Open the Application

Choose one of the following methods:

#### Option A: Direct Browser Open
Double-click `index.html` to open in your default browser.

#### Option B: WebStorm Preview
Open the project folder in WebStorm and use the built-in Live Edit preview.

#### Option C: Local Development Server
If you have Python 3 installed:

```bash
cd cnc-gcode-site
python3 -m http.server 8080
```

Then navigate to: `http://127.0.0.1:8080`

### Step 2: Enter Parameters

1. **Number of holes required**: Enter a positive integer (e.g., `10`)
   - Must be a whole number greater than 0
   - The corresponding bar length will auto-calculate

2. **File name**: Enter the base name for your output files (e.g., `aluminum_strip_A`)
   - Only letters, numbers, underscores (`_`), and hyphens (`-`) are allowed
   - Do not include `_hole`, `_edge`, or `.nc` extensions

### Step 3: Generate G-code

Click the **Generate G-code** button. The results will appear below with:

- Left panel: Hole drilling program preview
- Right panel: Edge profiling program preview

### Step 4: Export Your Files

For each generated file, you can:

- **Copy**: Click "Copy" to copy the G-code to clipboard
- **Download**: Click "Download" to save as a `.nc` file

---

## Example Workflow

**Task**: Machine an aluminum bar with 5 holes

1. Enter `5` in "Number of holes required"
2. Bar length auto-calculates to `100 mm`
3. Enter `part_001` as the file name
4. Click "Generate G-code"
5. Download `part_001_hole.nc` and `part_001_edge.nc`

The generated hole file will drill 5 holes at positions:
- Y10, Y30, Y50, Y70, Y90 (each spaced 20 mm apart)

---

## Deployment Guide

### Quick Deploy to Any Static Host

This project requires **no backend, no database, no Node.js** - just serve the static files.

#### Deploy to Tencent Cloud Lighthouse / Ubuntu with Nginx

**Step 1**: SSH into your server
```bash
ssh ubuntu@YOUR_SERVER_IP
```

**Step 2**: Install Nginx
```bash
sudo apt update
sudo apt install -y nginx
```

**Step 3**: Create site directory
```bash
sudo mkdir -p /var/www/cnc-gcode-site
sudo chown -R $USER:$USER /var/www/cnc-gcode-site
```

**Step 4**: Upload files
```bash
# From your local machine
scp -r cnc-gcode-site/* ubuntu@YOUR_SERVER_IP:/var/www/cnc-gcode-site/
```

**Step 5**: Create Nginx config
```bash
sudo nano /etc/nginx/sites-available/cnc-gcode-site
```

Paste this configuration:
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

**Step 6**: Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/cnc-gcode-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Step 7**: Configure firewall (if using UFW)
```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

### Domain & HTTPS Setup

**DNS Configuration**: Add A records at your domain provider:
- `@` → your server's public IP
- `www` → your server's public IP

**Enable HTTPS with Certbot**:
```bash
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Test certificate renewal:
```bash
sudo certbot renew --dry-run
```

---

## Technical Details

### G-code Format

**Hole Program Header**:
```gcode
G54
S12000 M3 G4 P8
G0 G90 G17
T0 ([Drill]JD-4.00)
```

**Edge Program**: Uses helical interpolation for clean edge profiling with Z-axis stepping.

### Validation Rules

- Hole count: Positive integers only (regex: `/^\d+$/`)
- File name: Alphanumeric with underscores/hyphens (regex: `/^[A-Za-z0-9_-]+$/`)
- Maximum file name length: 80 characters

---

## Browser Compatibility

Works on all modern browsers:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## Future Enhancements

Potential features for future versions:

- [ ] Multiple CNC template support
- [ ] Material type selector (steel, brass, plastic)
- [ ] Tool diameter selection
- [ ] Custom spindle speed settings
- [ ] Machine profile presets
- [ ] G-code history/export log
- [ ] Batch generation for multiple parts
- [ ] Metric/imperial unit toggle

---

## License

This project is provided as-is for CNC machining automation.

---

## Support

For issues or questions, please refer to the inline documentation in `script.js` or deploy using the steps above.
