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
}));

describe('Bootstrap', () => {
  it('should create the app and set up Swagger', async () => {
    const mockApp = {
      listen: jest.fn(),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);

    const PORT = 4000;
    process.env.PORT = String(PORT);

    // Import main.ts dynamically to execute the bootstrap function
    await import('../main');

    // Validate that the app is created
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);

    // Validate Swagger setup
    expect(SwaggerModule.createDocument).toHaveBeenCalled();
    expect(SwaggerModule.setup).toHaveBeenCalledWith('api', mockApp, expect.anything());

    // Validate that the app is listening on the correct port
    expect(mockApp.listen).toHaveBeenCalledWith(PORT);
  });
});
