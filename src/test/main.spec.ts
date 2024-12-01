import { Test } from '@nestjs/testing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock('@nestjs/swagger', () => ({
  SwaggerModule: {
    createDocument: jest.fn(),
    setup: jest.fn(),
  },
  DocumentBuilder: jest.fn(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addBearerAuth: jest.fn().mockReturnThis(),
    build: jest.fn(),
  })),
  ApiBearerAuth: jest.fn(), // Mock decorator
}));

describe('Bootstrap', () => {
  it('should create the app and set up Swagger', async () => {
    const mockApp = {
      listen: jest.fn(),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);

    const PORT = 4000;
    process.env.PORT = String(PORT);

    // Dynamically import and run main.ts
    await import('../main');

    // Validate app creation
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);

    // Validate Swagger setup
    expect(SwaggerModule.createDocument).toHaveBeenCalled();
    expect(SwaggerModule.setup).toHaveBeenCalledWith('api', mockApp, expect.anything());

    // Validate app listening on the correct port
    expect(mockApp.listen).toHaveBeenCalledWith(PORT);
  });
});
