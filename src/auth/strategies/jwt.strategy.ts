import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';


const cookieExtractor = (req: Request) => {
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

	validate(payload: any) {
		return payload;
	}
}