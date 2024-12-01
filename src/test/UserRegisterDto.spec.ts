import { validate } from 'class-validator';
import { UserRegisterDto } from '../dto/user-register.dto';

describe('UserRegisterDto', () => {
  let userRegisterDto: UserRegisterDto;

  beforeEach(() => {
    userRegisterDto = new UserRegisterDto();
  });

  it('should validate successfully when username and password are provided', async () => {
    userRegisterDto.username = 'newuser';
    userRegisterDto.password = 'securepassword';

    const errors = await validate(userRegisterDto);

    expect(errors.length).toBe(0); // No validation errors
  });

  it('should fail validation if username is missing', async () => {
    userRegisterDto.password = 'securepassword';

    const errors = await validate(userRegisterDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if password is missing', async () => {
    userRegisterDto.username = 'newuser';

    const errors = await validate(userRegisterDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if username is not a string', async () => {
    // @ts-ignore - Deliberately assign invalid type for testing
    userRegisterDto.username = 123;
    userRegisterDto.password = 'securepassword';

    const errors = await validate(userRegisterDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail validation if password is not a string', async () => {
    userRegisterDto.username = 'newuser';
    // @ts-ignore - Deliberately assign invalid type for testing
    userRegisterDto.password = 123;

    const errors = await validate(userRegisterDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
