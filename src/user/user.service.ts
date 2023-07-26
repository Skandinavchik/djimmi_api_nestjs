import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.servise';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) { }

	async findAll(): Promise<Omit<User, 'password'>[]> {
		const users = await this.prismaService.user.findMany();

		if (users.length === 0) {
			throw new NotFoundException('No users');
		}

		const usersWithoutPassword = users.map((user: User) => {
			const { password, ...userWithoutPassword } = user;
			return userWithoutPassword;
		});

		return usersWithoutPassword;
	}

	async findById(id: number): Promise<Omit<User, 'password'>> {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
		});

		if (!user) {
			throw new NotFoundException('User with this ID not found');
		}

		const { password, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}
}
