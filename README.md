Short deployment instructions:

1) Git clone https://github.com/dgutman/DSA_Faceted_Search.git

2) Install NodeJS (latest version) with NPM 
3) Install MongoDB (latest version)
4) Install PM2: NPM install pm2@latest -g
Site of PM2: http://pm2.keymetrics.io/docs/usage/quick-start/
5) Copy sample_config.js to config.js (cp sample_config.js config.js)
6) Edit config.js file. Set your url for connecting to Mongo DB to the "mongo" property.
7) Set write permissions for upload folder and sub-folders (chmod -R 777 upload)
8) Run "npm install"  from the webApp directory
10) Run "pm2 start index.js", app will started on port 8000
11) In webserver config (probably nginx) to link NodeJS servers’ port 8000 to default http port (80)
12) User mode url: http://your_url/user
     	       Admin mode url: http://your_url/admin




# My system info
Running node 5.4.2   (I had to upgrade the default one shipped iwth ubuntu 16.04 which was OLD)

# Other requirements
mongo should be installed on the local system

## Ubuntu 16.04 Node Instructions
The version of node that shits with default Ubuntu 16.04 is quite old  (mine had 3.5.2)

I have tested this applicatuin using node 4.1.2, and this is how I did the pm2 server as well (which was using 2.7.2)

<code>
cd ~   
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh  
sudo bash nodesource_setup.sh
</code>
