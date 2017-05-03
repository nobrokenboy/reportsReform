/**
 * Created by jessic on 2017/4/25.
 */
import Vue from  'vue';
/*import $ from "expose?$!jquery";*/
import $ from "jquery";
/*import  $ from "../../static/js/mylibs/jquery-vendor.js"*/
import vueRouter from "vue-router";
import vueResource from "vue-resource";
Vue.use(vueRouter);
Vue.use(vueResource);
import commondirective from '../../static/js/mylibs/common_directive';
import definedUtil from '../../static/js/mylibs/util';
import components from '../../static/js/mylibs/components';
import schedule from "./dayReportsSchedule.vue";
import steward from "./dayReportsSteward.vue";
import manager from "./dayReportsManager.vue";
/*import '../../static/css/common_m.scss';*/
import 'font-awesome/css/font-awesome.min.css';
import 'foundation-datepicker/css/foundation-datepicker.min.css';
import 'foundation-datepicker/js/foundation-datepicker.js';
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
        transitionName:"slide-left"

    },
    computed:{

    },
    mounted(){
        const self=this;
        self.isShow=true;
        console.log(self);
        const route= this.$route;
        const path=route.path;
        //根据路由设置activeIndex,兼容刷新时问题
        if(path.match('/schedule')){
            self.activeIndex=0;
        }else if(path.match('/steward')){
            self.activeIndex=1;
        }else if(path.match('/manager')){
            self.activeIndex=2;
        }

    },
    watch: {
        '$route' (to, from) {
            const self=this;
            console.log(to);
            if(to.path.match('/schedule')){
                self.activeIndex=0;
            }else if(to.path.match('/steward')){
                self.activeIndex=1;
            }else if(to.path.match('/manager')){
                self.activeIndex=2;
            }
            const toDepth = to.path.split('/').length
            const fromDepth = from.path.split('/').length
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
    },
    methods:{
        download(){
            const self=this;
            const route= this.$route;
            const path=route.path;
            route.name.methods.downloadRequest();
        }
    },
    router
}).$mount('#dayReports')