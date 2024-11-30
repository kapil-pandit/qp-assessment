import { JwtStrategy } from '../common/jwt/jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    jwtStrategy = new JwtStrategy();
  });

  it('should validate and return user payload', async () => {
    const payload = { username: 'testuser', role: 'admin' };
    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual({ username: 'testuser', role: 'admin' });
  });
});
