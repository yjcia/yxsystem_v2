/**
 * Created by YanJun on 2015/7/17.
 */
global.Sql = new function () {
    this.amountLineMonth = "select a.u_id,date_format(a.date,'%m') as month,date_format(a.date,'%Y') as year," +
        "sum(a.amount) as amount from t_charge a where a.u_id = ? and a.type = ? and date_format(a.date,'%Y') = date_format(sysdate(),'%Y') " +
        "group by date_format(a.date,'%m')";

    this.bothAmountLineMonthForCost = "select a.u_id,date_format(a.date,'%m') as month,date_format(a.date,'%Y') as year," +
        "sum(a.amount) as amount from t_charge a where a.u_id = ? and a.type = 0 " +
        "and date_format(a.date,'%Y') = date_format(sysdate(),'%Y') " +
        "group by date_format(a.date,'%m')";

    this.bothAmountLineMonthForRev = "select a.u_id,date_format(a.date,'%m') as month,date_format(a.date,'%Y') as year," +
        "sum(a.amount) as amount from t_charge a where a.u_id = ? and a.type = 1 " +
        "and date_format(a.date,'%Y') = date_format(sysdate(),'%Y') " +
        "group by date_format(a.date,'%m')";

    this.amountLineYear = "select a.u_id,date_format(a.date,'%Y') as year,sum(a.amount) as amount from t_charge a " +
        "where a.u_id = ? and a.type = ? group by date_format(a.date,'%Y')";

    this.amountTypePie = "select b.name,sum(a.amount) as amount from t_charge a " +
        "left join t_charge_cate b on a.charge_cate_id = b.id where a.u_id = ? and a.type = ? " +
        "and date_format(a.date,'%Y') = date_format(sysdate(),'%Y') group by b.id";
}