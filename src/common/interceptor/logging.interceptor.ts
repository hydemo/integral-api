import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	Logger,
	Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from 'nestjs-redis';
import { LogService } from 'src/module/logRecord/logRecord.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(
		@Inject(RedisService) private readonly redis: RedisService,
		@Inject(LogService) private readonly logService: LogService,
	) {}
	intercept(
		context: ExecutionContext,
		call$: Observable<any>,
	): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const url = request.originalUrl;
		const ip = request.headers['x-real-ip']
			? request.headers['x-real-ip']
			: request.ip.replace(/::ffff:/, '');
		Logger.log(url);
		Logger.log(request.method);
		Logger.log(ip);
		Logger.log(request.params);
		Logger.log(request.query);
		const body = { ...request.body };
		Logger.log(body);

		if (url.indexOf('/cms') === -1 && request.user) {
			const client = this.redis.getClient();
			client.hincrby('viewCount', String(request.user._id), 1);
		}
		const now = Date.now();

		return call$.pipe(
			tap(data => {
				if (url.indexOf('/cms') > -1) {
					let id = '';
					if (request.method === 'POST') {
						id = data._id;
					}
					if (url === '/cms/login') {
						id = data.userinfo._id;
						this.logService.genLog(url, request.method, id, ip, id);
					}
					if (request.method !== 'GET' && request.user && request.user._id) {
						this.logService.genLog(
							url,
							request.method,
							request.user._id,
							ip,
							id,
						);
					}
				}
				Logger.log(`Complete... ${Date.now() - now}ms`);
			}),
		);
	}
}
