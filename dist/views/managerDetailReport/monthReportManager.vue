<template>
    <div id="dayReportSteward">
        <!--地区时间-->
        <section class="msg-head clearfix">
            <a class="btn-ask fl" @click="getPayAnswer"></a>
            <div class="fr text-right basic-field-wrapper">
                <span>统计时间：</span>
                <span>{{monthStewardFields.time}}</span>
            </div>
        </section>
        <!--基本信息-->
        <section class="basic-area">
            <!--第1行-->
            <div class="basic-list clearfix" v-for="item in turnOneToTwo(monthStewardFields.basicItem)">
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
                            <th>工程管家</th>
                        </tr>
                        </thead>
                        <tbody v-for="(item,index) in monthStewardFields.formItemFields.formItemArrs" >
                        <tr>
                            <td width="100">
                                <a>{{item.customerName}}</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-wrapper table-2-wrapper table-scroll-wrapper">
                    <table  width="720" class="table-2" cellspacing="0" cellpadding="0">
                        <colgroup >
                            <col width="120">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                        </colgroup>
                        <thead class="forms-thead">
                        <tr>
                            <th v-for="item in monthStewardFields.formItemFields.formItemName">{{item}}</th>
                        </tr>
                        </thead>
                        <tbody v-for="(item,key) in monthStewardFields.formItemFields.formItemArrs">
                        <tr >
                            <td>{{item.customerAddress}}</td>
                            <td>{{item.currentDot}}</td>
                            <td>{{item.nextDot}}</td>
                            <td>{{item.planInspectTime}}</td>
                            <td>{{item.actualInspectTime}}</td>
                            <td>{{item.signInTimes}}</td>
                            <td>{{item.inspectTimes}}</td>
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
    </div>
</template>

<script type="text/ecmascript-6">
    import definedUtil from '../../static/js/mylibs/util';
    export default {
        props: [],
        data(){
        return {
            isLoading:false,
            isDataNull:false,
            monthStewardFields:{
                time:new Date().toLocaleDateString().replace(/\//g,'-'),
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
                        itemName:"今日巡检数",
                        itemNums:50
                    },
                    {
                        itemName:"本周巡检数",
                        itemNums:50
                    },
                    {
                        itemName:"本月巡检数",
                        itemNums:50
                    },
                    {
                        itemName:"今日签到数",
                        itemNums:20
                    },
                    {
                        itemName:"本周签到数",
                        itemNums:20
                    },
                    {
                        itemName:"本月签到数",
                        itemNums:20
                    }
                ],
                formItemFields:{
                    formItemName:[
                        "客户地址",
                        "当前施工节点",
                        "下一个巡检节点",
                        "计划巡检时间",
                        "实际巡检时间",
                        "累计签到次数",
                        "累计巡检次数"
                    ],
                    formItemArrs:[]
                }


            },
            formTop:"",
            leftMove:100,/*获取div水平滑动的距离*/
            tableLeft:100/*获取table-2的左移位置*/
        }
    },
    mounted(){
        const self=this;
        self.isLoading=true;
        self.getScheduleData();
        self.formTop=document.querySelector(".table-wrap").offsetTop;
        console.log(self.formTop);
    },
    methods:{
        getScheduleData(){
            const self=this;
            //请求数据
            self.$http.get("./data1.json")
                    .then((data) =>{
                        console.log(data);
                        console.log(data.body);
                        self.monthStewardFields.formItemFields.formItemArrs=data.body;
                        console.log(self.monthStewardFields.formItemFields.formItemArrs);
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
            console.log("工程管家详细");
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
            $("#dayReportSteward .table-1 tbody").each(function () {
                var $this=$(this),
                        index=$this.index();
                //获取th
                var $td=$this.find("tr:eq(0) td");
                //获取table-2对应的tbody
                var tbodyHeight=$("#dayReportSteward .table-2 tbody").eq(index-1).height();
                console.log(tbodyHeight);
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
    }

    }
</script>

<style lang="scss" scoped>
    .table-2 {
    .thead-fixed{
        width:720px;
    th{
        padding:8px 2px;
    }
    }
    }
</style>