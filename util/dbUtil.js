/**
 * Created by YanJun on 2015/7/3.
 */
var mysql = require("mysql");
var util = require("util");
var log = require('../util/logUtil');
var conf = require("../config.js");
var db = null;
var pool = null;

function tableObj(tablename, pool, fields) {
    this.tablename = tablename;
    this.pool = pool;
    this.fields = fields;
};
tableObj.prototype.checkTableField = function (params) {
    if (params && this.fields) {
        var pass = false;
        this.fields.forEach(function (r) {
            for (var column in params) {
                if (r === column || r.name === column) {
                    pass = true;
                }
            }
            if (!pass) {
                return false;
            }
        });
    }
    return true;
};
tableObj.prototype.getConnection = function (callback) {
    if (!callback) {
        callback = function () {
        };
    }
    this.pool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        callback(connection);
    });
};
tableObj.prototype.queryByCondition = function (params, callback) {
    var sql = "select * from " + this.tablename + " where 1 = 1";
    var table = this;
    if (table.checkTableField(params)) {
        for (var whereCondition in params) {
            sql += " and " + whereCondition + "=" + this.pool.escape(params[whereCondition]);
        }
    }
    this.getConnection(function (connection) {
        var query = connection.query(sql, function (err, result) {
            if (err) {
                log.helper.writeErr(err);
                callback(err, result);
            } else {
                log.helper.writeDebug('SQL:' + sql);
                callback(null, result);
            }
            connection.release();
        });
    });
};
tableObj.prototype.insert = function (params, callback) {
    var sql = 'insert into ' + this.tablename + ' set ?';
    this.getConnection(function (connection) {
        var query = connection.query(sql, params, function (err, result) {
            if (err) {
                log.helper.writeErr(err);
                callback(err, null);
            } else {
                log.helper.writeDebug('SQL:' + sql);
                callback(null, result.insertId);
            }
            connection.release();
        });
    });
};
tableObj.prototype.getById = function (id, callback) {
    var sql = "select * from " + this.tablename + " where id = ?";
    this.getConnection(function (connection) {
        var query = connection.query(sql, id, function (err, result) {
            if (err || result.length != 1) {
                callback(err, result);
            } else {
                callback(null, result[0]);
            }
            connection.release();
        });

    });
};

tableObj.prototype.executeSql = function (sql, params, callback) {
    if (params) {
        for (var i = 0; i < params.length; i++) {
            sql = sql.replace('?', this.pool.escape(params[i]));
        }
    }
    this.getConnection(function (connection) {
        var query = connection.query(sql, function (err, result) {
            if (err) {
                callback(err, result);
            } else {
                if (result && result.length > 0) {
                    callback(null, result);
                }
            }
            connection.release();
        });
    });
};
dbUtil.prototype.getTableObj = function (modelName) {
    if (modelName) {
        var _len = this.tables.length;
        for (i = 0; i < _len; i++) {
            if (this.tables[i][0] == modelName) {
                return this.tables[i][1];
            }
        }
    }
    return null;
};
var createPool = function () {
    if (pool == null) {
        pool = mysql.createPool({
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            port: '3306',
            database: 'yxsystem'
        });
    }
    return pool;
}

function dbUtil() {
    this.pool = createPool();
    this.tables = [];
}
dbUtil.prototype.binding = function (table) {
    var obj = this;
    if (util.isArray(table)) {
        table.forEach(function (t) {
            obj.tables.push([r.modelName, new tableObj(r.tableName, obj.pool, r.fields)]);
        });
    } else {
        obj.tables.push([table.modelName, new tableObj(table.tableName, obj.pool, table.fields)]);
    }
};
exports.Instance = function () {
    if (db == null) {
        db = new dbUtil();
    }
    return db;
};

//var db = this.Instance();
//db.binding({modelName:'User',tableName:'t_user',fields:['id','username','password','role','email']});
//var u = db.getTableObj('User');
//u.getById("1",function(result){
//    console.log(result);
//});

