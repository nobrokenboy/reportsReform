/**
 * Created by jessic on 2017/4/1.
 */
var Vue=require('vue');
var vueResource=require('vue-resource');
var vueRouter=require('vue-router');
Vue.use(vueResource);
Vue.use(vueRouter);
var commondirective=-require('./mylibs/common_directive');
var definedUtil=require('./mylibs/util');
var components=require('./mylibs/components');
var schedule=require('views/dayReports/dayReportsManager.vue');

/*引入对应的路由*/
module.exports={
    dayReportsController:function(){
        const schedule = { template: '#scheduleTem' };
        const steward = { template: '#stewardTem' };
        const manager = { template: '#managerTem' };

        const routes = [
            {
                path: '/',
                redirect: '/schedule',
                component: schedule,
                name:schedule
            },
            {
                path: '/schedule',
                component: schedule,
                name:schedule
            },
            {
                path: '/steward',
                component: steward,
                name:steward
            },
            {
                path: '/manager',
                component: manager,
                name:manager
            }
        ];

        const router = new vueRouter({
            routes // （缩写）相当于 routes: routes
        });

        const app = new Vue({
            data:{
                isShow:false,
                activeIndex:0,
                tabItems:[
                    {
                        "text":"施工进度",
                        "routerName":"/schedule"
                    },
                    {
                        "text":"工程管家",
                        "routerName":"/steward"
                    },
                    {
                        "text":"项目经理",
                        "routerName":"/manager"
                    }
                ],
                scheduleFields:{
                    status:"进度正常",
                    area:"广州片区",
                    time:new Date().toLocaleDateString(),
                    definedFields:{
                        area:"",
                        status:""
                    },
                    basicItem:[
                        {
                            itemName:"在施工地数",
                            itemNums:50
                        },
                        {
                            itemName:"进度异常数",
                            itemNums:20
                        }
                    ],
                    formItemField:[

                    ]


                },
                stewardFields:{

                },
                managerFields:{

                }
            },
            computed:{

            },
            mounted(){
                var self=this;
                self.isShow=true;

            },
            router
        }).$mount('#dayReports')
    }
};
