export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'taxmate_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'taxmate_refresh_secret_key',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
