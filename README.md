Short deployment instructions:
1) Install NodeJS (latest version) with NPM 
2) Install MongoDB (latest version)
3) Install PM2: NPM install pm2@latest -g
Site of PM2: http://pm2.keymetrics.io/docs/usage/quick-start/
4) Extract files from archive
5) Move to folder
6) Copy sample_config.js to config.js (cp sample_config.js config.js)
7) Edit config.js file. Set your url for connecting to Mongo DB to the "mongo" property.
8) Set write permissions for upload folder and sub-folders (chmod -R 777 upload)
9) Run "npm install"
10) Run "pm2 start index", app will started on port 8000
11) In webserver config (probably nginx) to link NodeJS servers’ port 8000 to default http port (80)
12) User mode url: http://your_url/user
     	       Admin mode url: http://your_url/admin





## Other requirements
mongo should be installed on the local system

