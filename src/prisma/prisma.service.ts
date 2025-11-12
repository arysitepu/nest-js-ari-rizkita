import {INestApplication, Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {Prisma, PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
    implements OnModuleInit {
    
    constructor() {
        // pass PrismaClientOptions e.g. logging levels or error formatting
        super({
            log: [
                { emit: 'stdout', level: 'query' },
                { emit: 'stdout', level: 'info' },
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' },
            ],
            errorFormat: 'pretty',
        });
        // this.$use(async (params, next) => {
        //     const before = Date.now()
        //     const result = await next(params)
        //     const after = Date.now()
        //     console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
        //     return result
        // });
        this.$on<any>('query', (event: Prisma.QueryEvent) => {
            // console.log('Query: ' + event.query);
            console.log('Params: ' + event.params);
            console.log('Duration: ' + event.duration + 'ms');
        });
    }

    async onModuleInit() {
        // await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async (event) => {
            console.log(event.name);
            await app.close();
        });

    }

}