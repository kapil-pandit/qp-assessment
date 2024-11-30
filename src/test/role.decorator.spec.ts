import { Roles } from '../common/decorators/roles.decorator';
import { SetMetadata } from '@nestjs/common';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  SetMetadata: jest.fn(),
}));

describe('Roles Decorator', () => {
  it('should set metadata with roles', () => {
    const roles = ['admin', 'user'];
    Roles(...roles);

    expect(SetMetadata).toHaveBeenCalledWith('roles', roles);
  });
});
