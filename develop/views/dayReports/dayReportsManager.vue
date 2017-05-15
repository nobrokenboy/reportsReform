<template>
    <div id="dayReportsManager">
        <!--地区时间-->
        <section class="msg-head clearfix">
            <a class="btn-ask fl" @click="getPayAnswer"></a>
            <div class="fr text-right basic-field-wrapper">
                <a class="font-orange margin-right-5" @click="modalObj.isModalShow=true">自定义</a>
                <span class="margin-right-5">{{managerFields.area}}</span>
                <span>统计时间：</span>
                <span>{{managerFields.time}}</span>
            </div>
        </section>
        <!--基本信息-->
        <section class="basic-area">
            <!--第1行-->
            <div class="basic-list clearfix" v-for="item in turnOneToTwo(managerFields.basicItem)">
                <div v-for="value in item">
                    <span>{{value.itemName}}</span>
                    <span>{{value.itemNums}}</span>
                </div>
            </div >
        </section>
        <!--报表表格信息-->
        <section class="forms-wrapper">
            <div class="form-wrapper-header">
                <span>明细</span>
            </div>
            <div class="form-wrapper-body table-wrap">
                <div class="table-wrapper table-1-wrapper table-fixed-wrapper">
                    <table cellspacing="0" width="100" class="table-1" cellpadding="0">
                        <thead class="forms-thead" width="100">
                        <tr>
                            <th>项目经理</th>
                        </tr>
                        </thead>
                        <tbody v-for="(item,index) in managerFields.formItemFields.formItemArrs" >
                        <tr>
                            <td width="100">
                                <a>{{item.managerName}}</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-wrapper table-2-wrapper table-scroll-wrapper">
                    <table  width="750" class="table-2" cellspacing="0" cellpadding="0">
                        <colgroup >
                            <col width="120">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                        </colgroup>
                        <thead class="forms-thead">
                        <tr>
                            <th v-for="item in managerFields.formItemFields.formItemName">
                                {{item.name}}
                                <div class="differ" v-if="item.flag==1">
                                    (个)
                                </div>
                                <div class="differ" v-if="item.flag==2">
                                    (次个)
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody v-for="(item,key) in managerFields.formItemFields.formItemArrs">
                        <tr >
                            <td>{{item.department}}</td>
                            <td>{{item.constuctSite}}</td>
                            <td>{{item.dayBroadcast}}</td>
                            <td>{{item.weekBroadcast}}</td>
                            <td>{{item.weekQualityRate}}</td>
                            <td>{{item.monthBroadcast}}</td>
                            <td>{{item.daySign}}</td>
                            <td>{{item.weekSign}}</td>
                            <td>{{item.monthSign}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
        <!--显示报表是否有数据-->
        <section class="warm-msg" v-if="isDataNull">
            <p>报表暂时没有数据</p>
        </section>
        <!--加载层组件-->
        <section class="progress-layer" v-if="isLoading">
            <div class="spinner">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
        </section>
        <!--弹框层-->
        <app-modal ref="definedModal" :isShowModal="modalObj.isModalShow" :transition-type="modalObj.transitionType" >
            <a slot="close"></a>
            <div slot="content">
                <form class="app-modal-common-form">
                    <h4>地区</h4>
                    <div class="form-select">
                        <select name="area" >
                            <option value="0">所有</option>
                            <option value="1">广州</option>
                            <option value="2">惠州</option>
                        </select>
                        <i></i>
                    </div>
                    <h4>时间</h4>
                    <div class="form-text">
                        <!--<input type="text" placeholder="请选择时间" id="startDate" readonly/>-->
                        <!--<calendar theme='#ff8000'></calendar>-->
                        <input type="text" readonly placeholder="请选择时间" @click="datetimePickerObj.isShow=true"
                               v-model="datetimePickerObj.comfirmDate"/>
                        <i></i>
                    </div>
                    <button type="button" class="common-btn common-all-length-btn common-active-btn margin-top-10"
                            @click="defindRequest">
                        <span>确定</span>
                    </button>
                </form>
            </div>
        </app-modal>
        <!--日期-->
        <datetime-picker ref="datetimeObj" :isShowSelector="datetimePickerObj.isShow" :transition-type="datetimePickerObj.transitionType"
                         :beginYear="2015" :endYear="2017" datepickerType="month">
        </datetime-picker>

    </div>
</template>

<script type="text/ecmascript-6">
    import calendar from 'auto-calendar/src/calendar.vue';
    import definedUtil from '../../static/js/mylibs/util';
    import 'foundation-datepicker/js/foundation-datepicker.js';
    import DatetimePicker from "../../static/js/component/datetimePicker.vue";
    export default {
        props: [],
        data(){
        return {
            modalObj:{
                isModalShow:false,
                transitionType:"slide-fade"
            },
            datetimePickerObj:{
                isShow:false,
                transitionType:"slide-fade",
                comfirmDate:""
            },
            isLoading:false,
            isDataNull:false,
            managerFields:{
                status:"进度正常",
                area:"广州片区",
                time:new Date().toLocaleDateString().replace(/\//g,'-'),
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
                    },
                    {
                        itemName:"今日播报（个）",
                        itemNums:50
                    },
                    {
                        itemName:"今日签到（个）",
                        itemNums:20
                    }
                ],
                formItemFields:{
                    formItemName:[
                        {
                            name:"所属部门",
                            flag:0
                        },
                        {
                            name:"在施工地",
                            flag:0
                        },
                        {
                            name:"今日播报",
                            flag:1
                        },
                        {
                            name:"本周播报",
                            flag:2
                        },
                        {
                            name:"本周合格率",
                            flag:0
                        },
                        {
                            name:"本月播报",
                            flag:2
                        },
                        {
                            name:"今日签到",
                            flag:1
                        },
                        {
                            name:"本周签到",
                            flag:2
                        },
                        {
                            name:"本月签到",
                            flag:2
                        }
                    ],
                    formItemArrs:[]
                }


            },
            formTop:"",
            leftMove:100,/*获取div水平滑动的距离*/
            tableLeft:100/*获取table-2的左移位置*/
        }
    },
    computed:{
        modalFlag(){
            const self=this;
            return self.modalObj.isModalShow;
        }
    },
    mounted(){
        const self=this;
        self.isLoading=true;
        self.getScheduleData();
        self.formTop=document.querySelector(".table-wrap").offsetTop;
        console.log(self.formTop);

        self.$nextTick(function(){
            console.log("哈哈哈");

        });

    },
    methods:{
        getScheduleData(){
            const self=this;
            //请求数据
            self.$http.get("./data2.json")
                    .then((data) =>{
                        console.log(data);
                        console.log(data.body);
                        self.managerFields.formItemFields.formItemArrs=data.body;
                        console.log(self.managerFields.formItemFields.formItemArrs);
                        self.dealScheduleData();
                    });


        },
        defindRequest(){
            console.log("自定义呢");
            const self=this;
            self.modalObj.isModalShow=false;
        },
        downloadRequest(){
            const self=this;
            console.log("项目经理下载");
        },
        dealScheduleData(){
            const self=this;
            self.$nextTick(self.setHeight);
            self.$nextTick(self.setFixed);
            self.$nextTick(self.tableMoveLeft);
            self.isLoading=false;
        },
        getPayAnswer(){
            alert("报表中今天的收款金额、收款数、合同数需第二天凌晨从ERP进行同步数据，因此需明天才能统计今天的收款情况。");
        },
        turnOneToTwo(arr){
            return definedUtil.turnOneDimensArrToTwoDimensArr(arr,2);
        },
        setHeight() {
            //设置固定表格的高度跟滚动表格的高度一致
            $("#dayReportsManager .table-1 tbody").each(function () {
                var $this=$(this),
                        index=$this.index();
                //获取th
                var $td=$this.find("tr:eq(0) td");
                //获取table-2对应的tbody
                var tbodyHeight=$("#dayReportsManager .table-2 tbody").eq(index-1).height();
                $td.height(tbodyHeight);
            });
        },
        tableMoveLeft(){
            var self=this;
            //监听tabled-scroll左右滚动事件
            $(".table-scroll-wrapper").scroll(function () {
                var $this=$(this),
                        scrollHorizontal=$this.scrollLeft();
                if(scrollHorizontal<self.tableLeft){
                    self.leftMove=self.tableLeft-scrollHorizontal;
                }else{
                    self.leftMove="-"+(scrollHorizontal-self.tableLeft);
                }

                //获取固定的table-2的head
                $(".table-2 .thead-fixed").animate({
                    'left':self.leftMove+"px"
                },0);

            });
        },
        setFixed(){
            var self=this;
            //监听window滚动条
            $(window).scroll(function(){
                var $dc=$(document),
                        scrollMove=$dc.scrollTop();
                if(scrollMove>=self.formTop){
                    $(".forms-thead").addClass("thead-fixed");
                    $(".table-2 .forms-thead").css("left",self.leftMove+"px");
                }else{
                    $(".forms-thead").removeClass("thead-fixed");
                }
                self.$nextTick(self.setWidth);
            });


        },
        setWidth(){
            const self=this;
            $(".table-2 thead tr th").each(function(){
                var $this=$(this),
                        index=$this.index();
                //获取table-2对应的tbody
                var theadThWidth=$(".table-2 tbody tr td").eq(index).width();
                $this.width(theadThWidth);
            });
        }
     },
    components:{
        DatetimePicker
    }
    }
</script>

<style lang="scss" scoped>
    .table-2 {
        .thead-fixed{
             width:920px;
            th{
                padding:8px 2px;
            }
        }
    }
</style>