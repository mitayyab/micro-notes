#!/bin/sh

set -e

if [ -d "/tmp/.ssh" ] && ls /tmp/.ssh/id_* >/dev/null 2>&1; then
   echo "Found ssh keys, copying the .ssh keys."

   cp -R /tmp/.ssh ~/
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/id_*
   chmod 644 ~/.ssh/id_*.pub
fi

echo "Marking /micro-notes as safe"
git config --global --add safe.directory /micro-notes

echo "Installing frontend dependencies."
cd /micro-notes/frontend
rm -rf node_modules
npm install

echo "Installing backend dependencies."
cd /micro-notes/backend
rm -rf node_modules
npm install

echo "--------------- Ready for development ---------------"

tail -f /dev/null
