#!/bin/sh

# This script fixes user rights on the ssh files
set -e

cp -R /tmp/.ssh ~/
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_*
chmod 644 ~/.ssh/id_*.pub

cd /micro-notes/frontend 
rm -rf node_modules
npm install

cd /micro-notes/backend
rm -rf node_modules
npm install

git config --global --add safe.directory /micro-notes

tail -f /dev/null