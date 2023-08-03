import { Body, Controller, HttpCode, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { IAccessToken } from './types/auth.types';
import { Response } from 'express';



@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('signup')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async signUp(@Res({ passthrough: true }) res: Response, @Body() signUpDto: SignUpDto): Promise<IAccessToken> {
		return this.authService.signUp(res, signUpDto);
	}


	@Post('signin')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	async signIn(@Res({ passthrough: true }) res: Response, @Body() signInDto: SignInDto): Promise<IAccessToken> {
		return this.authService.signIn(res, signInDto);
	}

	@Post('signout')
	@HttpCode(200)
	async signOut(@Res({ passthrough: true }) res: Response) {
		return await this.authService.signOut(res);
	}
}
