#!/bin/bash
logfile=/etc/letsencrypt/renewal/renew_status.log
echo "----------------------------------------------------------------" >> $logfile
echo `date` >> $logfile
service nginx stop
service tutrhq.com stop
/usr/bin/letsencrypt renew >> $logfile
service nginx start
service tutrhq.com start
echo "----------------------------------------------------------------" >> $logfile
