import {
  HttpStatus,
  INestApplication,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as _ from 'lodash';
import { requestContext } from 'src/request-context';
import { ResponseError } from 'src/shared/utils/response-ststus';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
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

    // @ts-ignore
    this.$on<any>('query', (event: Prisma.QueryEvent) => {
      // console.log('Query: ' + event.query);
      console.log('Params: ' + event.params);
      console.log('Duration: ' + event.duration + 'ms');
    });

    const self = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const ip = requestContext.getStore()?.ip ?? 'unknown';
            await self.$executeRawUnsafe(
              `SELECT set_config('app.current_ip', '${ip}', false)`
            );
            return query(args);
          },
        },
      },
    });

    Object.assign(this, self);
  }

  async onModuleInit() {
    // await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // @ts-ignore
    this.$on('beforeExit', async (event) => {
      // @ts-ignore
      console.log(event.name);
      await app.close();
    });
  }

  async beforeRemoveData(
    modelName: string,
    fkFields: string[],
    idData: unknown,
    multiple: boolean = false,
    exludeModule: string[] = [],
  ) {
    const model = Prisma.dmmf.datamodel.models.filter(
      (model) => model.name === modelName,
    );

    if (!model.length) {
      throw ResponseError('unknown model', HttpStatus.BAD_REQUEST);
    }

    // checking data fk is data being used by other table
    for (const field of model[0].fields) {
      if (!exludeModule.includes(field.type)) {
        if (field.isList && field.kind === 'object') {
          const modelFk = Prisma.dmmf.datamodel.models.find(
            (model) => model.name === field.type,
          );
          const columnFk = modelFk.fields.find((fieldFk) =>
            fkFields.includes(fieldFk.name),
          );

          if (columnFk) {
            if (
              modelFk /* && ![Prisma.ModelName.ApprovalHistories as string, Prisma.ModelName.AuthHistories as string].includes(modelFk.name) */
            ) {
              const schema = await this.$queryRawUnsafe<
                { table_schema: string }[]
              >(
                `SELECT table_schema FROM information_schema.tables WHERE table_name = '${field.type}'`,
              );
              const result = await this.$queryRawUnsafe<{ id: string }[]>(
                `SELECT id from "${schema[0].table_schema}"."${field.type}" WHERE ${columnFk.name} = '${idData}' and deleted_at is null`,
              );

              if (result.length > 0) {
                throw ResponseError(
                  `cannot remove caused by data is being used in ${field.type}`,
                  HttpStatus.BAD_REQUEST,
                );
              }
            }
          }
        }
      }
    }
  }

  async isExistField(modelName: string, fields: string[]) {
    const model = Prisma.dmmf.datamodel.models.filter(
      (model) => model.name === modelName,
    );

    if (!model.length) {
      throw ResponseError('unknown model', HttpStatus.BAD_REQUEST);
    }

    const existField = model[0].fields.find((field) =>
      fields.includes(field.name),
    );

    return existField ? true : false;
  }

  async findSchemaTable(tableName: string) {
    if (_.isEmpty(tableName)) return null;

    const schema = await this.$queryRawUnsafe<{ table_schema: string }[]>(
      `SELECT table_schema FROM information_schema.tables WHERE table_name = '${tableName}'`,
    );

    if (!schema.length) return null;

    return schema[0].table_schema;
  }
}
