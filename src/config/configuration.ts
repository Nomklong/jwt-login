const Configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: {
    type: process.env.DB_CONNECTION || 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    autoLoadEntities: true,
  },
  auth: {
    jwtTokenSecret: process.env.JWT_TOKEN_SECRET,
    accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRED_MINUTES,
  },
  imageApiKey: process.env.IMG_API_KEY,
});

export default Configuration;
