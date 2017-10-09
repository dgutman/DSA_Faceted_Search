## Starting the faceted search viewer
![](assets/markdown-img-paste-20171009105344535.png)

# Here is what the running app should look like
go to http://localhost:8000/


 Note it has no data.. since I haven't loaded any yet.. I'll show that in
 the loadingData.md
![](assets/markdown-img-paste-20171009105518120.png)

# Using the pm2 node server currently

pm2 show <id|name>  so pm2 show 0 (if the index.js is the 0th process) or pm2 show index.js
Lists uptime/etc..

![](assets/markdown-img-paste-20171009105448133.png)

# Monitor the running process

pm2 monit 0  

# Deleting a process
pm2 delete 0
