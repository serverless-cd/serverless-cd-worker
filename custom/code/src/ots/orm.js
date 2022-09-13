const { wrapAttributes, wrapRow, wrapRows } = require('./utils');
const tableClient = require('./client');
const TableStore = require('tablestore');

const { Condition, RowExistenceExpectation, ReturnType, SortOrder, QueryType, Long } = TableStore;

const orderQuery = (fieldName) => ({
  sorters: [
    {
      fieldSort: {
        fieldName,
        order: TableStore.SortOrder.SORT_ODER_DESC,
      },
    },
  ],
});

class Orm {
  constructor(tableName, indexName) {
    this.tableName = tableName;
    this.indexName = indexName;
  }
  async create(primaryKey, params) {
    const config = {
      tableName: this.tableName,
      condition: new Condition(RowExistenceExpectation.IGNORE, null),
      primaryKey,
      attributeColumns: wrapAttributes(params),
      returnContent: {
        returnType: ReturnType.Primarykey,
      },
    };
    console.debug(`orm save params: ${JSON.stringify(config, null, 2)}`);
    await tableClient.putRow(config);
  }
  async find(params = {}) {
    const { currentPage = 1, pageSize = 10, orderKey, ...termQuery } = params;
    const offset = currentPage > 1 && pageSize > 0 ? (currentPage - 1) * pageSize : 0;
    const limit = pageSize > 0 ? pageSize : 10;

    const mustQueries = [];
    for (let i in termQuery) {
      const query = {
        queryType: TableStore.QueryType.TERM_QUERY,
        query: {
          fieldName: i,
          term: termQuery[i],
        },
      };
      mustQueries.push(query);
    }

    const searchQuery = {
      offset,
      query:
        mustQueries.length === 0
          ? {
              queryType: TableStore.QueryType.MATCH_ALL_QUERY,
            }
          : {
              queryType: TableStore.QueryType.BOOL_QUERY,
              query: {
                mustQueries,
              },
            },
      limit,
      getTotalCount: true,
    };
    if (orderKey) {
      searchQuery.sort = orderQuery(orderKey);
    }

    const returnType = TableStore.ColumnReturnType.RETURN_ALL;
    const result = await tableClient.search({
      tableName: this.tableName,
      indexName: this.indexName,
      searchQuery,
      columnToGet: {
        returnType,
      },
    });

    return {
      result: wrapRows(result.rows),
      totalCount: result.totalCounts,
    };
  }
  async findOne(params) {
    const { result } = await this.find({
      currentPage: 1,
      pageSize: 1,
      ...params,
    });
    return result[0];
  }
  async findAll(params = {}) {
    let flag = true;
    let currentPage = 1;
    let totalCount = 0;
    let result = [];
    while (flag) {
      const res = await this.find({ ...params, currentPage, pageSize: 100 });
      currentPage += 1;
      totalCount = res.data.totalCount;
      result = result.concat(res.data.result);

      flag = totalCount > result.length;
    }
    return { success: true, data: { result, totalCount } };
  }
  async findByPrimary(primaryKey) {
    const config = {
      tableName: this.tableName,
      maxVersions: 1,
      primaryKey,
    };
    console.debug(`orm findByPrimary params: ${JSON.stringify(config)}`);
    const result = await tableClient.getRow(config);
    return wrapRow(result.row);
  }
  // 模糊查询
  async findByLike(params = {}) {
    const { currentPage = 1, pageSize = 10, sort, ...rest } = params;
    const offset = currentPage > 1 && pageSize > 0 ? (currentPage - 1) * pageSize : 0;
    const limit = pageSize > 0 ? pageSize : 10;

    const mustQueries = [
      {
        queryType: QueryType.MATCH_ALL_QUERY,
      },
    ];
    for (let i in rest) {
      if (!rest[i]) {
        continue;
      }
      const query = {
        queryType: QueryType.WILDCARD_QUERY,
        query: {
          fieldName: i,
          value: `*${rest[i]}*`,
        },
      };
      mustQueries.push(query);
    }

    const searchQuery = {
      offset,
      query: {
        queryType: QueryType.BOOL_QUERY,
        query: {
          mustQueries,
        },
      },
      limit,
      getTotalCount: true,
    };
    if (sort) {
      const sorters = [];
      for (const i in sort) {
        sorters.push({
          fieldSort: {
            fieldName: i,
            order: sort[i] === 1 ? SortOrder.SORT_ORDER_DESC : SortOrder.SORT_ORDER_ASC,
          },
        });
      }
      searchQuery.sort = { sorters };
    }

    const returnType = TableStore.ColumnReturnType.RETURN_ALL;
    const result = await tableClient.search({
      tableName: this.tableName,
      indexName: this.indexName,
      searchQuery,
      columnToGet: {
        returnType,
      },
    });

    return {
      result: wrapRows(result.rows),
      totalCount: Number(result.totalCounts),
    };
  }
  async update(primaryKey, params) {
    const config = {
      tableName: this.tableName,
      condition: new Condition(RowExistenceExpectation.EXPECT_EXIST, null),
      primaryKey,
      updateOfAttributeColumns: [
        {
          PUT: wrapAttributes({
            ...params,
            updatedTime: Long.fromNumber(Date.now()),
          }),
        },
      ],
      returnContent: {
        returnType: ReturnType.Primarykey,
      },
    };

    console.debug(`orm update params: ${JSON.stringify(config)}`);
    await tableClient.updateRow(config);
  }
  async delete(primaryKey) {
    const config = {
      tableName: this.tableName,
      condition: new Condition(RowExistenceExpectation.EXPECT_EXIST, null),
      primaryKey,
    };
    console.debug(`orm delete params: ${JSON.stringify(config)}`);
    return tableClient.deleteRow(config);
  }
}

module.exports = Orm;
