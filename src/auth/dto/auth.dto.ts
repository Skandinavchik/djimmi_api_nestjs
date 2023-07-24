import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';


export class SignInDto {

	@IsEmail({}, { message: 'Email must be valid' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string;

	@IsString()
	@IsNotEmpty({ message: 'Password is required' })
	password: string;
}

export class SignUpDto {

	@IsString()
	@IsNotEmpty({ message: 'Username is required' })
	@MinLength(2, { message: 'Username must be at least 2 characters' })
	username: string;

	@IsEmail({}, { message: 'Email must be valid' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string;

	@IsString()
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(8, { message: 'Password must be at least 8 characters' })
	password: string;
}