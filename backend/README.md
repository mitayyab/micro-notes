# Setup

1. Create `.env.development` for development & `.env.test` for running `JEST` tests with following content.
   <br>

   > Session `secret` or passwords can be created by using openssl. Following command generates 24 character secret. `micro-notes` container & `Ubuntu WSL` comes pre-installed with `openssl`.
   >
   > `openssl rand -base64 24`

   > Replace \<whatever instruction\> with your value like following
   >
   > `DB_PASSWORD = QEdexyHp`

   ```
   # DATABASE
   DB_HOST = mongo
   DB_PORT = 27017
   DB_USERNAME = notes
   DB_PASSWORD = <Replace with your password>
   DB_DATABASE = notes

   # BACKEND API
   SERVER_PORT = 8081

   # SESSION
   SESSION_SECRET = <Replace with your secret>
   ```
