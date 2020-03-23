import * as md5 from 'md5';
import * as QRCode from 'qr-image';
import * as Zip from 'jszip';
import * as fs from 'fs';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { CreateAdminDTO } from 'src/module/admin/admin.dto';
import { AdminService } from 'src/module/admin/admin.service';
import { RedisService } from 'nestjs-redis';
import { UserCouponService } from 'src/module/userCoupon/userCoupon.service';
import { CategoryRecordService } from 'src/module/categoryRecord/categoryRecord.service';
import { GoodRecordService } from 'src/module/goodRecord/goodRecord.service';
import { DataRecordService } from 'src/module/dataRecord/dataRecord.service';
import { CryptoUtil } from 'src/utils/crypto.util';
import { IdCardNoUtil } from 'src/utils/idCardNo.util';
import { IntegrationSummaryService } from 'src/module/integrationSummary/integrationSummary.service';

@Injectable()
export class InitService {
	constructor(
		private readonly adminService: AdminService,
		private readonly integrationSummaryService: IntegrationSummaryService,
	) {}

	async init() {
		await this.integrationSummaryService.init();
		// const check = this.idCardNoUtil.getIdCardInfo('350583198912246076')
		// console.log(check, 'sss')
		// const client = this.redis.getClient()
		// await client.hincrby('test', 'aa', 1.22)
		// const zip = new Zip()
		// var qr_svg = QRCode.imageSync('I love QR!', { type: 'png' });
		// zip.file('/qrcode/i_love_qr.png', qr_svg);
		// zip.generateAsync({  // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
		//   type: "nodebuffer",
		//   // 压缩算法
		//   compression: "DEFLATE",
		//   compressionOptions: {
		//     level: 9
		//   }
		// })
		//   .then(async content => {
		//     fs.writeFileSync(`temp/qrcode/qrcode.zip`, content)

		//   });
		// const client = this.redis.getClient()
		// await client.del('qiniu_upToken')
		// const categories = ['5ddcea8a224eec48e502d97f', '5ddcea8a224eec48e502d97e']
		// const goods = ['5de521a19123ea461cd9ac8f']
		// const condition = {
		//   type: 1,
		//   user: '5ddce260224eec48e502d97a',
		//   isUsed: false,
		//   expire: { $gte: Date.now() },
		//   $or: [
		//     { useType: 1, isLimit: false, },
		//     { useType: 1, isLimit: true, limit: { $gte: 10 } },
		//     { useType: 2, goods: { $in: goods }, isLimit: false },
		//     { useType: 2, goods: { $in: goods }, isLimit: true, limit: { $lte: 9 } },
		//     { useType: 3, categories: { $in: categories }, isLimit: false },
		//     { useType: 3, categories: { $in: categories }, isLimit: true, limit: { $lte: 9 } },
		//   ]
		// }
		// const data = await this.userCouponService.findByCondition(condition)
		// console.log(data, 'data')
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
