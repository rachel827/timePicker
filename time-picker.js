// jshint ignore: start

+ function($) {

    function isLeapYear(year) {    //计算是否是闰年
        var cond1 = year % 4 == 0;  //条件1：年份必须要能被4整除
        var cond2 = year % 100 != 0;  //条件2：年份不能是整百数
        var cond3 = year % 400 ==0;  //条件3：年份是400的倍数
        //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
        //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
        //所以得出判断闰年的表达式：
        var cond = cond1 && cond2 || cond3;
        if(cond) {
            return true;
        } else {
            return false;
        }
    }


    function getLastDays(start,num) {   //获取当月剩余日期
        var lastarr=[];
        function getDaysFun(start,num) {
            for(var i=start;i<num+1;i++){
                var obj={
                    name:i+'日',
                    value:i
                }
                lastarr.push(obj)
            }
            return lastarr;
        }
        return  getDaysFun(start,num);
    }

    function getDays(num){
        var arr=[];
        function getDaysFun(num) {
            for(var i=1;i<num+1;i++){
                var obj={
                    name:i+'日',
                    value:i
                }
                arr.push(obj)
            }
            return arr;
        }
       return  getDaysFun(num);
    }

    var days28 = getDays(28);
    var days29 = getDays(29);
    var days30 = getDays(30);
    var days31 = getDays(31);


    function isLongMonth(num) {
        var daysArr31 = [1,3,5,7,8,10,12];//31天的月份
        for(var x in daysArr31){
            if(num == daysArr31[x]){
                return true;
            }
        }
        return false;
    }

    var date = new Date();
    var curMonth = date.getMonth()+1;
    var curDay =  date.getDate();
    var curYear = date.getFullYear();

    var curYearArr=[],nextYearArr=[];
    for(var i=curMonth;i<13;i++){
        var monthObj={
            name:i+'月',
            value:i,
            sub:[]
        }
        if(i == curMonth){
            if(i == 2){
                if(isLeapYear(curYear)){   //是闰年
                    monthObj.sub=getLastDays(curDay,29)

                }else{
                    monthObj.sub=getLastDays(curDay,28)
                }


            }else if(isLongMonth(i)){   //31天
                monthObj.sub=getLastDays(curDay,31);
            }else{
                monthObj.sub=getLastDays(curDay,30)
            }


        }else{
            if(i == 2){
                if(isLeapYear(curYear)){   //是闰年
                    monthObj.sub=days29;

                }else{
                    monthObj.sub=days28;
                }
            }else if(isLongMonth(i)){   //31天
                monthObj.sub=days31;
            }else{
                monthObj.sub=days30;
            }
        }

        curYearArr.push(monthObj)
    }

    for(var j=1;j<curMonth;j++){

        var monthObj={
            name:j+'月',
            value:j,
            sub:[]
        }
        if(j == 2){
            if(isLeapYear(curYear+1)){   //是闰年
                monthObj.sub=days29;

            }else{
                monthObj.sub=days28;
            }
        }else if(isLongMonth(j)){   //31天
            monthObj.sub=days31;
        }else{
            monthObj.sub=days30;
        }
        nextYearArr.push(monthObj)
    }
    $.rawCitiesData=curYearArr.concat(nextYearArr);

}($);

// jshint ignore: end

/* global $:true */
/* jshint unused:false*/

+ function($) {
    "use strict";

    var defaults;
    var raw = $.rawCitiesData;


    var format = function(data) {
        var result = [];
        for(var i=0;i<data.length;i++) {
            var d = data[i];
            if(/^请选择|发布时间/.test(d.name)) continue;
            result.push(d);
        }
        if(result.length) return result;
        return [];
    };

    var sub = function(data) {
        return format(data.sub);
    };

    var getMonth = function(d) {
        for(var i=0;i< raw.length;i++) {
            if(raw[i].value === d || raw[i].name === d) return sub(raw[i]);
        }
        return [];
    };


    var hours = [];
    var minites = [];
    if(!hours.length) {
        for(var i = 0; i < 24; i++) {
            hours.push({
                name:''+i,
                value:i
            });
        }
    }
    if(!minites.length) {
        for(var j = 0; j < 60; j++) {
            minites.push({
                name:('' + j).length == 1 ?'0'  +j : '' + j,
                value:('' + j).length == 1 ?'0'  +j : '' + j,
            });
        }
    }


    var initHours = hours;
    var initMinites = minites;


    var parseInitValue = function (val) {
        var p = raw[0], c, d, e;
        var tokens = val.split(' ');
        raw.map(function (t) {
            if (t.name === tokens[0]) p = t;
        });
        p.sub.map(function (t) {
            if (t.name === tokens[1]) c = t;
        })
        
        initHours.map(function(t){
            if (t.name == tokens[2]) d = t;

        })

        initMinites.map(function(t){
            if (t.name == tokens[3]) e = t;
        })

        return [p.value, c.value, d.value, e.value];
    }

    $.fn.timePicker = function(params) {
        params = $.extend({}, defaults, params);
        return this.each(function() {
            var self = this;

            var YearsName = raw.map(function(d) {
                return d.name;
            });
            var Yearsvalue = raw.map(function(d) {
                return d.value;
            });
            var initCities = sub(raw[0]);
            var initCitiesName = initCities.map(function (c) {
                return c.name;
            });
            var initCitiesvalue = initCities.map(function (c) {
                return c.value;
            });

            var initHoursName = initHours.map(function (c) {
                return c.name;
            });
            var initHoursValue = initHours.map(function (c) {
                return c.value;
            });

            var initMinitesName = initMinites.map(function (c) {
                return c.name;
            });
            var initMinitesValue = initMinites.map(function (c) {
                return c.value;
            });



            var currentYear = YearsName[0];
            var currentMonth = initCitiesName[0];
            var currentHour =  initHoursName[0];
            var currentMinite = initMinitesName[0] ;

            var cols = [
                {
                    displayValues: YearsName,
                    values: Yearsvalue,
                    cssClass: "col-Year"
                },
                {
                    displayValues: initCitiesName,
                    values: initCitiesvalue,
                    cssClass: "col-Month"
                },
                {
                    displayValues: initHoursName,
                    values: initHoursValue,
                    cssClass: "col-hours"
                },
                {
                    displayValues: initMinitesName,
                    values: initMinitesValue,
                    cssClass: "col-minites"
                }
            ];

            var config = {
                cssClass: "Month-picker",
                rotateEffect: false,  //为了性能
                formatValue: function (p, values, displayValues) {
                    return displayValues.join(' ');
                },
                onChange: function (picker, values, displayValues) {
                    var newYear = picker.cols[0].displayValue;
                    var newMonth;
                    if(newYear !== currentYear) {
                        var newMonths = getMonth(newYear);
                        newMonth = newMonths[0].name;
                        currentYear = newYear;
                        currentMonth = newMonth;
                        picker.cols[1].replaceValues(newMonths.map(function (c) {
                            return c.value;
                        }), newMonths.map(function (c) {

                            return c.name;
                        }));
                        picker.updateValue();
                        return false; // 因为数据未更新完，所以这里不进行后序的值的处理
                    } else {

                    }
                    var len = (values[values.length-1] ? values.length - 1 : values.length - 2);
                    $(self).attr('data-code', values[len]);
                    $(self).attr('data-codes', values.join(','));
                    if (params.onChange) {
                        params.onChange.call(self, picker, values, displayValues);
                    }

                },
                cols: cols
            };

            if(!this) return;
            var p = $.extend({}, params, config);
            //计算value
            // var val = $(this).val();
           // var val =params.val;
            var date=new Date( (new Date().getTime())+15*60*1000);
            var curTime = date.getMonth()+1+'月 '+date.getDate()+'日 '+ date.getHours();
            var min=(''+date.getMinutes()).length ===1 ?'0'+ date.getMinutes(): date.getMinutes();
            curTime+=' ' +min;
            var val=curTime;

            if (!val) val = '1月 1日 0 00';
            currentYear = val.split(" ")[0];
            currentMonth = val.split(" ")[1];
            currentHour= val.split(" ")[2];
            currentMinite= val.split(" ")[3];
            if(val) {
                p.value = parseInitValue(val);
                if(p.value[0]) {
                    var months = getMonth(p.value[0]);
                    p.cols[1].values = months.map(function (c) {
                        return c.value;
                    });
                    p.cols[1].displayValues = months.map(function (c) {
                        return c.name;
                    });
                }


            }

            $(this).picker(p);
        });
    };

    var initdate=new Date( (new Date().getTime())+15*60*1000);
    var initcurTime = initdate.getMonth()+1+'月 '+initdate.getDate()+'日 '+ initdate.getHours();
    var initmin=(''+initdate.getMinutes()).length ===1 ?'0'+ initdate.getMinutes(): initdate.getMinutes();
    initcurTime+=' ' +initmin;
    defaults = $.fn.timePicker.prototype.defaults = {
        val:initcurTime //是否显示地区选择
    };

}($);