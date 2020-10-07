db = db.getSiblingDB('admin')
db.auth('mongoadmin', 'secret')

db = db.getSiblingDB('chi100easy')

db.createUser({
  user: 'mongo',
  pwd: 'secret',
  roles: [{
    role: 'readWrite',
    db: 'chi100easy'
  }]
});
