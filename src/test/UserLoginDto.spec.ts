import { validate } from 'class-validator';
import { UserLoginDto } from '../dto/user-login.dto';

describe('UserLoginDto', () => {
  let userLoginDto: UserLoginDto;

  beforeEach(() => {
    userLoginDto = new UserLoginDto();
  });

  it('should validate successfully when username and password are provided', async () => {
    userLoginDto.username = 'testuser';
    userLoginDto.password = 'securepassword';

    const errors = await validate(userLoginDto);

    expect(errors.length).toBe(0); // No validation errors
  });

  it('should fail validation if username is missing', async () => {
    userLoginDto.password = 'securepassword';

    const errors = await validate(userLoginDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if password is missing', async () => {
    userLoginDto.username = 'testuser';

    const errors = await validate(userLoginDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if username is not a string', async () => {
    // @ts-ignore - Deliberately assign invalid type for testing
    userLoginDto.username = 123;
    userLoginDto.password = 'securepassword';

    const errors = await validate(userLoginDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail validation if password is not a string', async () => {
    userLoginDto.username = 'testuser';
    // @ts-ignore - Deliberately assign invalid type for testing
    userLoginDto.password = 123;

    const errors = await validate(userLoginDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
