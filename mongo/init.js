db = db.getSiblingDB('notes');

db.createCollection('users');

db.createUser({
   user: 'notes',
   pwd: 'notes',
   roles: [
      { role: 'readWrite', db: 'notes' },
      { role: 'dbAdmin', db: 'notes' },
   ],
});
