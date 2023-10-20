#!/bin/sh

RECREATE=0

for arg in "$@"; do
   if [ "$arg" = "--recreate" ]; then
      RECREATE=1
   fi
done

create_backend_env_file() {
   local filename=$1

   if [ $RECREATE -eq 1 ] || [ ! -f $filename ]; then
      SESSION_SECRET=$(openssl rand -hex 12)

      cat <<EOL >$filename
# DATABASE
DB_HOST=mongo
DB_PORT=27017
DB_USERNAME=notes
DB_PASSWORD=notes
DB_DATABASE=notes

# BACKEND API
SERVER_PORT=8081

# SESSION
SESSION_SECRET=$SESSION_SECRET
EOL

      echo "Created $filename file."
   fi
}

if [ $RECREATE -eq 1 ] || [ ! -f .env ]; then
   # Using hex encoding for safer characters
   MONGO_ROOT_PASSWORD=$(openssl rand -hex 6)

   cat <<EOL >.env
COMPOSE_PROJECT_NAME=micro-notes
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=$MONGO_ROOT_PASSWORD
MONGO_NOTES_PASSWORD=notes
BACKEND_PORT=8081
EOL
   echo "Created .env file"
fi

create_backend_env_file "backend/.env.development"
create_backend_env_file "backend/.env.test"
