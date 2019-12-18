module.exports = {
  secret  : 'wannalookorbook',
  host    : process.env.DB_HOST || 'localhost',
  port    : process.env.DB_PORT || '27017',
  database: 'cmccrms',
}