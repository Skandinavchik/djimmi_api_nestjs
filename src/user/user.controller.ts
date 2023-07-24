import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';


@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
	) { }

	@Get()
	async findAll() {
		return this.userService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async findById(@Param('id', ParseIntPipe) id: number) {
		return this.userService.findById(id);
	}


}
