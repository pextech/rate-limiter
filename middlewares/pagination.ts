import {Pagination, QueryOptions} from "../interface/pagination";
class PaginationService {
    public static async paginateAggregate(
        Op: any,
        reqQuery: any,
        model: any,
        sortBy: string,
        sortOrder: string,
        filterOption?: any,
        ignoreFields?: string[],
        associations?: any,
        attribute?: any,
        group?: any
    ) {

        const page = parseInt(reqQuery.page as string, 10) || 1;
        const order = reqQuery.order
        const limit =
        parseInt(reqQuery.limit as string, 10) || 25;
        const startIndex = (page - 1) * limit;
          
        if (reqQuery.from && reqQuery.to) {
            const from = new Date(reqQuery.from as string);
            const to = new Date(reqQuery.to as string);
            filterOption.where = { ...filterOption.where, createdAt: { [Op.between]: [from, to] } }
        }

            
        if (reqQuery.keyword && reqQuery.columns) {
            const keyword = reqQuery.keyword
            const columns = reqQuery.columns
            let searchQueryConditions: any = {
                [Op.or]: columns.map((col: any) => ({
                  [col]: { [Op.iLike]: `%${keyword.toString()}%` },
                }))
              };
            filterOption.where = {...filterOption.where, ...searchQueryConditions }
        }
        
        const sortOrderInstance = order ? order : sortOrder?.toUpperCase();
    
        let queryOptions: QueryOptions = {
            ...filterOption,
            offset: startIndex,
            limit: limit,
            order: [[sortBy, sortOrderInstance === 'DESC' ? 'DESC' : 'ASC']],
        };

        if (ignoreFields) {
            queryOptions.attributes = { exclude: ignoreFields }
        }

        if (group) {
            queryOptions.group = {
            ...queryOptions.group,
            group
            }
        }

        if (filterOption) {
            queryOptions = {...queryOptions, where: filterOption.where}
        }

        if (associations) {
            queryOptions.include = associations
        }

        if (attribute) {
            queryOptions.attributes = attribute.attributes
        }


        const { count, rows } = await model.findAndCountAll(queryOptions);

        const total = count;
        const records = rows;
    
        const pagination: Pagination = { current: page, limit, total };
    
        const endIndex = startIndex + limit;
        if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
            total,
        };
        }
    
        if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
            total,
        };
        }
    
        return {
        data: records,
        count: records.length,
        total,
        pagination,
        };
    }
    
    public static async generateQueryOptions(
        Op: any,
        queryParams: any,
        ignoreKeys: string[],
    ) {
        const whereConditions: any = {};
    
        for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key) && !ignoreKeys.includes(key)) {
            let value: any = queryParams[key];
    
            if (Array.isArray(value)) {
            value = value.map((element) => {
                const parsedNumber = parseFloat(element);
                return isNaN(parsedNumber) ? element : parsedNumber;
            });
            whereConditions[key] = { [Op.in]: value };
            } else {
            const parsedNumber = parseFloat(value);
            if (!isNaN(parsedNumber)) {
                value = parsedNumber;
            }
            whereConditions[key] = value;
            }
        }
        }
    
        return {
         where: whereConditions,
        };
    }
}

    
export default PaginationService;
