#!/bin/bash
sudo mkdir /var/google-maps-vis/
cd /var/google-maps-vis/
git clone https://github.com/saurabh0jha/google-maps-visualization-ui.git
cd google-maps-visualization-ui  
sed -i -e 's/\r$//' nginx.sh
sudo chmod +x nginx.sh
./nginx.sh >/dev/null
cd /var/google-maps-vis/
sudo apt install python-pip
sudo pip install nodeenv
nodeenv env-google-maps-vis
. env-google-maps-vis/bin/activate
cd google-maps-visualization-ui
npm install
npm run-script pre-build $1 $2
npm run build
chmod -R 755 /var/google-maps-vis/google-maps-visualization-ui
systemctl start nginx