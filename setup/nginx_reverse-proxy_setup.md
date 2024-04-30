Steps:
- nstall nodejs, npm, python
	- check versions: nodejs -v, npm -v, python -v
- Install nginx: `sudo apt install nginx`
- Check nginx version: `nginx -v`
- Setup nginx reverse proxy:
	- Start nginx service: `sudo systemctl start nginx`
	- To start nginx on system boot: `sudo systemctl enable nginx`
	- Check nginx server status: `sudo systemctl status nginx`
	- Unlink default configuration file: `sudo unlink /etc/nginx/sites-enabled/default`
	- Create custom config file: `sudo vim /etc/nginx/sites-available/nginx-config`
```
server {
    listen 443 http2 ssl;
    listen [::]:443 http2 ssl;

    server_name demo_app.local;

    ssl_certificate /home/kali/csrf_demo/nginx-certs/kali-nginx.crt;
    ssl_certificate_key /home/kali/csrf_demo/nginx-certs/kali-nginx.key;

    location /api/ {
        proxy_pass https://127.0.0.1:5000;
    }
    location / {
        proxy_pass http://127.0.0.1:8000;
    }
}
```
NOTE:This configuration includes ssl configuration as we plan to serve the applications over https. You can make it more secure by configuring the reverse proxy to redirect all http traffic to https.

- Link the custom configuration file: `sudo ln -s /etc/nginx/sites-available/nginx-config /etc/nginx/sites-enabled/`
- Test configuration file syntax: `sudo nginx -t`
- Restart nginx: `sudo systemctl restart nginx`
Reference: https://phoenixnap.com/kb/nginx-reverse-proxy
