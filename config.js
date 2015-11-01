var app = {
    email: '857207947@qq.com',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'yxsystem'
};
global.Sys = new function(){
    //权限认证
    this.permissionUrls = [
        "/user/index", "/user/setting"
    ],
    this.adminUrls = [
        "/admin/setting"
    ],
    this.month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    this.dateFormat = 'YYYY-MM-DD HH:mm:ss',
    this.appid = 'wxa85db346322cb0c1',
    this.appsecret = 'cfbb95c56b60c76f8021b5eb51ed8db9'
    this.token = 'yanjun'
};