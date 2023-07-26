import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';


const cookieExtractor = function (req: Request) {
	let token: string = '';
	if (req && req.cookies) {
		token = req.cookies['accessToken'];
	}
	return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configServise: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				cookieExtractor,
				ExtractJwt.fromAuthHeaderAsBearerToken()
			]),
			secretOrKey: configServise.get('JWT_SECRET'),
		});
	}

	validate(payload: Omit<User, 'password'>) {
		return payload;
	}
}