import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.servise';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { genSalt, hash, compare } from 'bcrypt';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService
	) { }

	async signUp(signUpDto: SignUpDto): Promise<{ accessToken: string }> {
		try {
			const salt = await genSalt(12);
			const user = await this.prismaService.user.create({
				data: {
					username: signUpDto.username,
					email: signUpDto.email,
					password: await hash(signUpDto.password, salt),
				},
			});

			const { password, ...userWithoutPassword } = user;
			return this.signAccessToken(userWithoutPassword);

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw new BadRequestException('User with this email already exists');
			}
			console.log(error);
		}

	}

	async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
		const user = await this.prismaService.user.findUnique({
			where: {
				email: signInDto.email
			}
		});

		if (user) {
			const isCorrectPassword = await compare(signInDto.password, user.password);

			if (isCorrectPassword) {
				const { password, ...userWithoutPassword } = user;
				return this.signAccessToken(userWithoutPassword);
			}
		}

		throw new UnauthorizedException('Invalid email or password');
	}

	async signOut() {

	}

	async signAccessToken(user: Omit<User, 'password'>): Promise<{ accessToken: string }> {
		const accessToken = await this.jwtService.signAsync({ user });

		return {
			accessToken,
		};
	}
}
