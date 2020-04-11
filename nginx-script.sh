#!/bin/bash
server="$(hostname -I | awk '{print $1}')"
echo $server
cat <<EOF >/etc/nginx/sites-available/google-visualization-ui.conf

server {
        listen 8080;
        root /var/google-maps-vis/google-maps-visualization-ui/build;
        index index.html index.htm;
        server_name $server;
        
        server_tokens off;
        client_max_body_size 25M;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options "DENY";
        add_header cache-control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        
       location / {
               try_files \$uri\$args \$uri\$args/ /index.html;
               expires -1;
        }
}
EOF
ln -s /etc/nginx/sites-available/google-visualization-ui.conf /etc/nginx/sites-enabled
cd /etc/nginx/sites-available/
mv default default.bkp
cd /etc/nginx/sites-enabled/
rm default
nginx -t
nginx -s reload
cd /var/
chmod 755 merchants-app/
cd /var/google-maps-vis/google-maps-visualization-ui
systemctl restart nginx