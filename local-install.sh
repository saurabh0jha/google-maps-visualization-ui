git clone https://github.com/saurabh0jha/google-maps-visualization-ui.git
sudo apt install python-pip
sudo pip install nodeenv
nodeenv env-google-maps-vis
. env-google-maps-vis/bin/activate
cd google-maps-visualization-ui
npm install
npm run-script pre-build $1 $2
npm run build