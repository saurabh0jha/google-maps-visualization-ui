## Available Scripts

In the project directory, you can run:

### `install.sh`
chmod +x ./install.sh
install.sh GOOGLE_MAPS_API_KEY SERVER_URL


This script will build the app, set the env variables and setup nginx if installed. On Ubuntu system.

### `local-install.sh`
chmod +x ./local-install.sh
local-install.sh GOOGLE_MAPS_API_KEY SERVER_URL


This script will build the app, set the env variables and keep the files in the build folder for 
deployment to the server root.