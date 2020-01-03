module.exports = {
  secret : 'wannalookorbook',
  host : process.env.DB_HOST || 'localhost',
  port : process.env.DB_PORT || '27017',
  database: 'cmccrms',
  JWT_SECRET: 'wannalookorbook',
  JWT_EXPIRY: 3600,
  JWT_ISSUER: 'CMCC_RMS',
  JWT_AUDIENCE: 'CMCC_RMS_XH',
  JWT_ALG: 'HS256'
}