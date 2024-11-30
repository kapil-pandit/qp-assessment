import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '../common/jwt/jwt.module';
import { JwtStrategy } from '../common/jwt/jwt.strategy';

describe('JwtModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [JwtModule],
    }).compile();
  });

  it('should be defined', () => {
    const jwtModule = module.get<JwtModule>(JwtModule);
    expect(jwtModule).toBeDefined();
  });

  it('should provide JwtStrategy', () => {
    const jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    expect(jwtStrategy).toBeInstanceOf(JwtStrategy);
  });
});
