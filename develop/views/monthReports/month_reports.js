/**
 * Created by jessic on 2017/4/27.
 */
/**
 * Created by jessic on 2017/4/25.
 */
import Vue from  'vue';
import $ from "jquery";
import vueRouter from "vue-router";
import vueResource from "vue-resource";
Vue.use(vueRouter);
Vue.use(vueResource);
import commondirective from '../../static/js/mylibs/common_directive';
import definedUtil from '../../static/js/mylibs/util';
import components from '../../static/js/mylibs/components';
import steward from "./monthReportsSteward.vue";
import manager from "./monthReportsManager.vue";
const routes = [
    {
        path: '/',
        redirect: '/steward',
        component: steward,
        name:steward
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
        if(path.match('/steward')){
            self.activeIndex=0;
        }else if(path.match('/manager')){
            self.activeIndex=1;
        }

    },
    watch: {
        '$route' (to, from) {
            const self=this;
            console.log(to);
            if(to.path.match('/steward')){
                self.activeIndex=0;
            }else if(to.path.match('/manager')){
                self.activeIndex=1;
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
}).$mount('#monthReports')