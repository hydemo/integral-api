import * as Schedule from 'node-schedule';
import { Injectable, Inject } from '@nestjs/common';
import { OrderService } from 'src/module/order/order.service';
import { DataRecordService } from 'src/module/dataRecord/dataRecord.service';
import { GoodRecordService } from 'src/module/goodRecord/goodRecord.service';
import { CategoryRecordService } from 'src/module/categoryRecord/categoryRecord.service';
import { UserRecordService } from 'src/module/userRecord/userRecord.service';
import { IntegrationSummaryService } from 'src/module/integrationSummary/integrationSummary.service';

@Injectable()
export class ScheduleService {
	constructor(
		private readonly orderService: OrderService,
		private readonly dataRecordService: DataRecordService,
		@Inject(UserRecordService)
		private readonly userRecordService: UserRecordService,
		@Inject(GoodRecordService)
		private readonly goodRecordService: GoodRecordService,
		@Inject(CategoryRecordService)
		private readonly categoryRecordService: CategoryRecordService,
		@Inject(IntegrationSummaryService)
		private readonly integrationSummaryService: IntegrationSummaryService,
	) {}

	async enableSchedule() {
		const logRule = new Schedule.RecurrenceRule();
		logRule.second = 0;
		logRule.minute = 1;
		logRule.hour = 0;

		const completeOrderRule = new Schedule.RecurrenceRule();
		completeOrderRule.second = 30;
		completeOrderRule.minute = 0;
		completeOrderRule.hour = 0;

		const priceRule = new Schedule.RecurrenceRule();
		completeOrderRule.second = 0;
		completeOrderRule.minute = 0;
		completeOrderRule.hour = 20;

		const integrationRule = new Schedule.RecurrenceRule();
		completeOrderRule.second = 0;
		completeOrderRule.minute = 0;
		completeOrderRule.hour = 0;

		Schedule.scheduleJob(logRule, async () => {
			await this.dataRecordService.genLog();
			await this.userRecordService.genLog();
			await this.categoryRecordService.genLog();
			await this.goodRecordService.genLog();
		});

		Schedule.scheduleJob(completeOrderRule, async () => {
			await this.orderService.completeOrder();
		});

		Schedule.scheduleJob(priceRule, async () => {
			await this.integrationSummaryService.refreshPrice();
		});

		Schedule.scheduleJob(integrationRule, async () => {
			await this.integrationSummaryService.updatePool();
		});

		Schedule.scheduleJob('*/1 * * * *', async () => {
			await this.orderService.clearOrder();
		});
	}
}
