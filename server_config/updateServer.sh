#!/bin/bash
cd tutrhq.com.git/tutrhq
git pull
cp -Rf ~/tutrhq.com.git/tutrhq/* ~/tutrhq.com/
sudo service tutrhq.com restart
