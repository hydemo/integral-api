import * as md5 from 'md5';
import { Injectable } from '@nestjs/common';
import { CreateAdminDTO } from 'src/module/admin/admin.dto';
import { AdminService } from 'src/module/admin/admin.service';
import { IntegrationSummaryService } from 'src/module/integrationSummary/integrationSummary.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class InitService {
	constructor(
		private readonly adminService: AdminService,
		private readonly jwtService: JwtService,
		private readonly integrationSummaryService: IntegrationSummaryService,
	) {}

	async init() {
		const token = await this.jwtService.sign({
			type: 'user',
			id: '5e844c16070aaf69474d9082',
		});
		console.log(token);
		await this.integrationSummaryService.init();
		const adminExist = await this.adminService.findOne({});
		if (!adminExist) {
			const admin: CreateAdminDTO = {
				nickname: '超级管理员',
				password: md5('111111'),
				username: 'admin',
				role: 0,
			};
			await this.adminService.create(admin);
		}
	}
}
