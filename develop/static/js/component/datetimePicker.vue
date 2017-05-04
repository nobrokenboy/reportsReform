<template >
    <transition :name="transitionType" >
        <div class="shade-panel" v-if="isShowSelector" v-on:click.self="undoEvent">
            <div class="date-select-lists animation" >
                <!--header-->
                <div class="select-list area-header">
                    <div v-on:click="undoEvent()">取消</div>
                    <div class="title">选择日期</div>
                    <div v-on:click="comfirmEvent()">确定</div>
                </div>
                <!--content-->
                <div class="select-list area-content clearfix">
                    <!--省-->
                    <div class="swiper-container swiper-container-1">
                        <ul class="date-lists swiper-wrapper">
                            <li class="swiper-slide" v-for="i in yearLists" :class="{'swiper-active':i==activeYear}" >{{i+"年"}}</li>
                        </ul>
                        <div class="active-area"></div>
                    </div>
                    <!--市-->
                    <div class="swiper-container swiper-container-2">
                        <ul class="date-lists swiper-wrapper">
                            <li class="swiper-slide" v-for="item in monthLists" :class="{'swiper-active':item==activeMonth}">{{item+"月"}}</li>
                        </ul>
                        <div class="active-area"></div>
                    </div>
                    <!--区-->
                    <div class="swiper-container swiper-container-3">
                        <ul class="date-lists swiper-wrapper">
                            <li class="swiper-slide"  v-for="i in dateLists" :class="{'swiper-active':i==activeDate}">{{i+"日"}}</li>
                        </ul>
                        <div class="active-area"></div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    export default {
        props: ["isShowSelector","transitionType","shadeZIndex"],
        data(){
        let curDate=new Date();
        return {
            curYear:curDate.getFullYear(),
            curMonth:curDate.getMonth()+1,
            curDate:curDate.getDate(),
            activeYear:0,
            activeMonth:0,
            activeDate:0,
            dateLists:[],
            _hasTouch:('ontouchstart' in window)
        }
    },
    computed:{
        yearLists(){
            //设置起始年份为2015年
            var diffYear=this.curYear-2015+1;
            return Array.from({length:diffYear},(value,index) =>{
                return this.curYear-index;
            }).reverse();
        },
        monthLists(){
            return Array.from({length:12},(value,index) =>{
                return index+1;
            });
        }
    },
    mounted(){
        const self=this;
        self.activeYear=self.curYear;
        self.activeMonth=self.curMonth;
        self.activeDate=self.curDate;
        self.setDatePickerData(self.activeYear,self.activeMonth);
        console.log(self._hasTouch);
    },
    methods:{
        setDatePickerData(activeYear,activeMonth){
            const self=this;
            //对天数进行设置
            self.dateLists=self.setDate(activeYear,activeMonth);
            //设置滑动的位置
            self.setDistance();

        },
        setDate(activeYear,activeMonth){
            //根据年份以及月份，算出天数
            var dayNums=new Date(activeYear,activeMonth,0).getDate();
            return Array.from({length:dayNums},(value,index) =>{
                return index+1;
            });
        },
        setDistance(){

        },
        undoEvent(){
            const self=this;
            self.$parent.datetimePickerObj.isShow=false;
        },
        comfirmEvent(){
            const self=this;
            self.$parent.datetimePickerObj.comfirmDate=self.activeYear+"-"+self.activeMonth+"-"+self.activeDate;
            self.$parent.datetimePickerObj.isShow=false;
        }
    }
    }
</script>

<style lang="scss" scoped>
    .shade-panel{
        position:fixed;
        bottom:0;
        left:0;
        z-index:12;
        width:100%;
        height:100%;
        background: rgba(1,1,1,0.3);
    }
    .date-select-lists{
        position:absolute;
        bottom:0;
        left:0;
        z-index:15;
        width:100%;
        height:200px;
        background-color:#fff;
        border:1px solid #ccc;
        border-radius:3px;
        color:#C3C3C3;
        font-size:16px;
    }
    .date-select-lists .select-list{
        height:100%;
    }
    .date-select-lists .select-list>div{
        position:relative;
        float:left;
        width:32%;
        height:100%;
        line-height:40px;
        text-align:center;
    }
    .active-area{
        position:absolute;
        left:2px;
        top:40%;
        bottom:35%;
        z-index:10;
        width:99%;
        height:40px;
        line-height:40px;
        border-top:1px solid #ccc;
        border-bottom:1px solid #ccc;

    }
    .date-select-lists .select-list>div~div{
        margin-left:2%;
    }
    .date-select-lists .title{
        color:#000;
    }
    .date-select-lists .area-header{
        position:absolute;
        top:0;
        left:0;
        z-index:2;
        width:100%;
        height:40px;
        line-height:40px;
        background-color:#fff;
        border-bottom:1px solid #C4C3C3;
    }
    .date-select-lists .area-header>div{
        height:40px;
    }
    .date-select-lists .select-area{
        position:absolute;
        left:0;
        bottom:40px;
        z-index:2;
        width:100%;
        height:40px;
        line-height:40px;

    }
    .date-select-lists .select-area>div{
        border-top:1px solid #ccc;
        border-bottom:1px solid #ccc;
    }
    .date-select-lists .date-lists{
        /*position:absolute;
        left:0;
       /!* top:120px;*!/
        width:100%;
        text-align:center;*/
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        width: 100%;
        height: 100%;
        -webkit-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        -o-transform: translate(0,0);
        -ms-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
        -webkit-transition-property: -webkit-transform;
        -moz-transition-property: -moz-transform;
        -o-transition-property: -o-transform;
        -ms-transition-property: -ms-transform;
        transition-property: transform;
        transition: all .5s ease-in;
        text-align: center;
    }
    .date-select-lists .date-lists>li{
        list-style:none;
        -webkit-flex-shrink: 0;
        -ms-flex: 0 0 auto;
        flex-shrink: 0;
        width:100%;
        height:40px;
        
    }
    .swiper-container{
        margin-left: auto;
        margin-right: auto;
    }
    .swiper-wrapper{
        height:auto;
    }
    .swiper-slide{
        text-align: center;
        font-size: 14px;
        background: #fff;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -webkit-transition:all .2s ease-in;
        transition:all .2s ease-in;
    }
    .swiper-active{
        font-size:24px;
        color:#2b2b2b;
    }
    .animation{
        -webkit-animation-duration:.2s;
        animation-duration:.2s;
        -webkit-animation-timing-function:ease-in;
        animation-timing-function:ease-in;
    }
    .slideUp{
        -webkit-animation-name:slideUp;
        animation-name:slideUp;
    }
    .slideDown{
        -webkit-animation-name:slideDown;
        animation-name:slideDown;
    }
    /*.date-select-lists{
        transform:translateY(100%);
            -webkit-transform:translateY(100%);
    }*/

    /*动画效果*/
    @keyframes slideUp{
        0%{
            transform:translateY(-100%);
            -webkit-transform:translateY(-100%);
        }
        100%{
            transform:translateY(0);
            -webkit-transform:translateY(0);
        }
    }
    @-webkit-keyframes slideUp{
        0%{
            transform:translateY(-100%);
            -webkit-transform:translateY(-100%);
        }
        100%{
            transform:translateY(0);
            -webkit-transform:translateY(0);
        }
    }

    @keyframes slideDown{
        0%{
            transform:translateY(100%);
            -webkit-transform:translateY(100%);
        }
        100%{
            transform:translateY(0);
            -webkit-transform:translateY(0);
        }
    }
    @-webkit-keyframes slideUp{
        0%{
            transform:translateY(100%);
            -webkit-transform:translateY(100%);
        }
        100%{
            transform:translateY(0);
            -webkit-transform:translateY(0);
        }
    }
</style>