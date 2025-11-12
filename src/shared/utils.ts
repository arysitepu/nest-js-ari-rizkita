import {MetaPaginationDto} from "./dto/meta-pagination.dto";

// const moment = require('moment');

export function getOffset(page :  number, limit: number): any {
    return {
        skip: (page - 1) * limit,
        take: Number(limit)
    };
}

export function getMeta(page: number, limit: number, count: number): MetaPaginationDto {
    return {
        page : +page,
        limit : +limit,
        totalPage: Math.ceil(count / limit),
        totalData: count
    };
}