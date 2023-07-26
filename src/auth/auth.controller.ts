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
	async signUp(@Body() signUpDto: SignUpDto): Promise<IAccessToken> {
		return await this.authService.signUp(signUpDto);
	}


	@Post('signin')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	async signIn(@Res({ passthrough: true }) res: Response, @Body() signInDto: SignInDto): Promise<IAccessToken> {
		res.cookie('accessToken', (await this.authService.signIn(signInDto)).accessToken, {
			maxAge: 14 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		return await this.authService.signIn(signInDto);
	}

	@Post('signout')
	@HttpCode(200)
	async signOut(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('accessToken', {
			maxAge: 10,
			httpOnly: true,
		});

		return await this.authService.signOut();
	}
}
