import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from '@prisma/client';


@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
	) { }

	@Get()
	async findAll(): Promise<Omit<User, 'password'>[]> {
		return this.userService.findAll();
	}

	@Get(':id')
	async findById(@Param('id') id: string): Promise<Omit<User, 'password'>> {
		return this.userService.findById(id);
	}
}
