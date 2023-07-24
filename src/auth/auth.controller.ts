import { Body, Controller, HttpCode, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('signup')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async signUp(@Body() signUpDto: SignUpDto) {
		return await this.authService.signUp(signUpDto);
	}


	@Post('signin')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	async signIn(@Body() signInDto: SignInDto) {
		return await this.authService.signIn(signInDto);
	}

	@Post('signout')
	@HttpCode(200)
	async signOut() {
		return await this.authService.signOut();
	}
}
