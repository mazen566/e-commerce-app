export default () => ({
  port: process.env.PORT,
  db: {
    url: process.env.DB_URL,
  },
  access: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  cloud: {},
});
