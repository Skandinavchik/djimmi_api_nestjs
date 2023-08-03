import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.servise';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { genSalt, hash, compare } from 'bcrypt';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { IAccessToken } from './types/auth.types';
import { Response } from 'express';



@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
	) { }

	async signUp(res: Response, signUpDto: SignUpDto): Promise<IAccessToken> {
		try {
			const salt = await genSalt(12);
			const user = await this.prismaService.user.create({
				data: {
					username: signUpDto.username,
					email: signUpDto.email,
					password: await hash(signUpDto.password, salt),
				},
			});

			res.cookie('accessToken', (await this.signAccessToken(user)).accessToken, {
				maxAge: 14 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});

			return await this.signAccessToken(user);

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				console.log('aaa');
				throw new BadRequestException('User with this email already exists');
			}
			console.log(error);
		}

	}

	async signIn(res: Response, signInDto: SignInDto): Promise<IAccessToken> {
		const user = await this.prismaService.user.findUnique({
			where: {
				email: signInDto.email,
			}
		});

		if (user) {
			const isCorrectPassword = await compare(signInDto.password, user.password);

			if (isCorrectPassword) {
				res.cookie('accessToken', (await this.signAccessToken(user)).accessToken, {
					maxAge: 14 * 24 * 60 * 60 * 1000,
					httpOnly: true,
				});

				return await this.signAccessToken(user);
			}
		}

		throw new UnauthorizedException('Invalid email or password');
	}

	async signOut(res: Response) {
		res.clearCookie('accessToken', {
			maxAge: 10,
			httpOnly: true,
		});

		return {
			message: 'User signed out',
		};
	}

	async signAccessToken(user: User): Promise<IAccessToken> {
		const { id, email, username } = user;
		const accessToken = await this.jwtService.signAsync({ email }, {
			subject: id,
			issuer: username,
		});

		return {
			accessToken,
		};
	}
}
