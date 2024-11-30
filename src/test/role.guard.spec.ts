import { RolesGuard } from '../common/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined); // No roles required
    const mockContext = createMockExecutionContext({ user: { role: 'user' } });

    expect(rolesGuard.canActivate(mockContext)).toBe(true);
  });

  it('should allow access if user has required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    const mockContext = createMockExecutionContext({ user: { role: 'admin' } });

    expect(rolesGuard.canActivate(mockContext)).toBe(true);
  });

  it('should deny access if user does not have required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    const mockContext = createMockExecutionContext({ user: { role: 'user' } });

    expect(() => rolesGuard.canActivate(mockContext)).toThrow(
      'You do not have the required permissions',
    );
  });

  function createMockExecutionContext(mockRequest: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => {}, // Mock implementation for getHandler
    } as unknown as ExecutionContext;
  }
});
