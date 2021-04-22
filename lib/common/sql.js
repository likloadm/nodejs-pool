let debug = require('debug')('db');

async function fetchOne(sql, args) {
    let results = await fetchMany(sql, args);
    if (results.length === 0) {
        return null;
    } else {
        return results[0];
    }
}

function fetchMany(sql, args) {
    return execute(sql, args);
}

function execute(sql, args) {
    debug(`SQL EXEC: ${sql} ${JSON.stringify(args)}`);
    return new Promise((resolve, reject) => {
        global.mysql.query(sql, args, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function beginTransaction(callback) {
    // TODO: we have deadlocks - disabling for now
    // debug('TRANSACTION START');
    // let conn = await global.mysql.getConnection();
    // try {
    //     await conn.beginTransaction();
    let ret = await callback();
    // debug('TRANSACTION COMMIT');
    // await conn.commit();
    return ret;
    // } catch (e) {
    //     debug('TRANSACTION ROLLBACK');
    //     await conn.rollback();
    //     throw e;
    // }
}

module.exports = {
    escape: (...args) => mysql.escape(...args),
    fetchOne,
    fetchMany,
    execute,
    beginTransaction,
};
