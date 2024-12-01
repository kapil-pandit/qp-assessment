import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { createMock } from '@golevelup/ts-jest';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'testSecret' });
    jwtAuthGuard = new JwtAuthGuard(jwtService);
  });

  it('should allow access when a valid token is provided', async () => {
    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer validToken',
          },
        }),
      }),
    });

    jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 1 });

    const result = jwtAuthGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(jwtService.verify).toHaveBeenCalledWith('validToken');
  });

  it('should deny access when no token is provided', async () => {
    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    });

    const result = jwtAuthGuard.canActivate(mockContext);

    expect(result).toBe(false);
  });

  it('should deny access when an invalid token is provided', async () => {
    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalidToken',
          },
        }),
      }),
    });

    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const result = jwtAuthGuard.canActivate(mockContext);

    expect(result).toBe(false);
    expect(jwtService.verify).toHaveBeenCalledWith('invalidToken');
  });

  it('should deny access when the authorization header format is incorrect', async () => {
    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'InvalidHeaderFormat',
          },
        }),
      }),
    });

    const result = jwtAuthGuard.canActivate(mockContext);

    expect(result).toBe(false);
  });

  it('should attach the decoded user to the request when the token is valid', async () => {
    const mockDecodedUser = { userId: 1, username: 'testuser' };

    const mockRequest = {
      headers: {
        authorization: 'Bearer validToken',
      },
    };

    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    });

    jest.spyOn(jwtService, 'verify').mockReturnValue(mockDecodedUser);

    const result = jwtAuthGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });
});
