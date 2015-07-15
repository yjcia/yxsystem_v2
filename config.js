var app = {
    email: '857207947@qq.com',
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'yxsystem'
};
global.Sys = new function () {
    //权限认证
    this.permissionUrls = [
        "/user/index"
    ],
        this.adminUrls = [
            "/admin/setting"
        ],
        this.month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']


}