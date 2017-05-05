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
                <div class="select-list area-content clearfix date-slider-wrapper">
                    <!--年-->
                    <div class="swiper-container swiper-container-1">
                        <ul class="date-lists swiper-wrapper" @touchstart="touchStartEvent($event)" @touchmove="touchMoveEvent($event)"
                              @touchend="touchEndEvent($event)">
                            <li class="swiper-slide" v-for="(i,index) in yearLists" :class="{'swiper-active':i==activeYear.name}" >{{i+"年"}}</li>
                        </ul>
                        <div class="active-area"></div>
                    </div>
                    <!--月-->
                    <div class="swiper-container swiper-container-2">
                        <ul class="date-lists swiper-wrapper" @touchstart="touchStartEvent($event)" @touchmove="touchMoveEvent($event)"
                            @touchend="touchEndEvent($event)" >
                            <li class="swiper-slide" v-for="(item,index) in monthLists" :class="{'swiper-active':item==activeMonth.name}"
                                    v-if="">{{item+"月"}}</li>
                        </ul>
                        <div class="active-area"></div>
                    </div>
                    <!--日-->
                    <div class="swiper-container swiper-container-3">
                        <ul class="date-lists swiper-wrapper" @touchstart="touchStartEvent($event)" @touchmove="touchMoveEvent($event)"
                            @touchend="touchEndEvent($event)" >
                            <li class="swiper-slide"  v-for="(i,index) in dateLists" :class="{'swiper-active':i==activeDate.name}">{{i+"日"}}</li>
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
            activeYear:{
                name:"",
                index:0
            },
            activeMonth:{
                name:"",
                index:0
            },
            activeDate:{
                name:"",
                index:0
            },
            dateItemsHeight:40,
            activeItemIndex:[],
            initActiveIndex:2,
            startPosition:{},
            endPosition:{},
            direction:"",
            sliderDistance:"",
            sliderBlockNums:0
        }
    },
    watch:{
        isShowSelector(newVal,oldVal){
            const self=this;
            if(newVal){
                self.setDatePickerData(self.activeYear.name,self.activeMonth.name);
            }
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
        self.activeYear.name=self.curYear;
        self.activeYear.index=self.getIndexInArr(self.activeYear.name,self.yearLists);
        console.log(self.activeYear.index);
        self.activeMonth.name=self.curMonth;
        self.activeMonth.index=self.getIndexInArr(self.activeMonth.name,self.monthLists);
        console.log(self.activeMonth.index);
        self.activeDate.name=self.curDate;
    },
    methods:{
        setDatePickerData(activeYear,activeMonth){
            const self=this;
            //对天数进行设置
            self.dateLists=self.setDate(activeYear,activeMonth);
            self.activeDate.index=self.getIndexInArr(self.activeDate.name,self.dateLists);
            console.log(self.activeDate.index);
            //设置滑动的位置
            self.$nextTick(self.setDistance);

        },
        setDate(activeYear,activeMonth){
            //根据年份以及月份，算出天数
            var dayNums=new Date(activeYear,activeMonth,0).getDate();
            return Array.from({length:dayNums},(value,index) =>{
                return index+1;
            });
        },
        getIndexInArr(value,arr){
            var result=0;
            for(var i= 0,j=arr.length;i<j;i++){
                if(value==arr[i]){
                   result=i;
                }
            }
            return result;
        },
        setDistance(){
            //激活位置刚好在中间
            const self=this;
            self.activeItemIndex=[self.activeYear.index,self.activeMonth.index,self.activeDate.index];
            console.log(self.activeItemIndex);
            console.log(self.dateItemsHeight);
            Array.from(document.querySelectorAll(".date-lists")).forEach((value,index,arr)=>{
                let containerEle=arr[index];
                containerEle.style.webkitTransform ="translate3d(0,-"+(self.activeItemIndex[index]-self.initActiveIndex)*self.dateItemsHeight+"px,0)";
                containerEle.style.MozTransform ="translate3d(0,-"+(self.activeItemIndex[index]-self.initActiveIndex)*self.dateItemsHeight+"px,0)";
                containerEle.style.msTransform ="translate3d(0,-"+(self.activeItemIndex[index]-self.initActiveIndex)*self.dateItemsHeight+"px,0)";
                containerEle.style.OTransform ="translate3d(0,-"+(self.activeItemIndex[index]-self.initActiveIndex)*self.dateItemsHeight+"px,0)";
                containerEle.style.transform="translate3d(0,-"+(self.activeItemIndex[index]-self.initActiveIndex)*self.dateItemsHeight+"px,0)";
            });
        },
        touchStartEvent(e){
            const self=this;
            console.log(e);
            self.startPosition.x=e.touches[0].pageX;
            self.startPosition.y=e.touches[0].pageY;

        },
        touchMoveEvent(e){
            const self=this;
            self.endPosition.x=e.changedTouches[0].pageX;
            self.endPosition.y=e.changedTouches[0].pageY;
        },
        touchEndEvent(e){
            const self=this;
            //获取方向以及距离
            self.direction=self.getDirection(self.startPosition.x,self.startPosition.y,self.endPosition.x,self.endPosition.y);
            self.sliderDistance=self.getSliderDistance(self.startPosition.x,self.startPosition.y,self.endPosition.x,self.endPosition.y);
            console.log(self.direction);
            console.log(self.sliderDistance);
            //获取要滑动的块的个数
            self.sliderBlockNums=Math.ceil(self.sliderDistance/self.dateItemsHeight);
            console.log(self.sliderBlockNums);
            if(self.direction==1){//向上
                console.log("向上");
            }else if(self.direction==3){//向下
                console.log("向下");
            }

        },
        undoEvent(){
            const self=this;
            self.$parent.datetimePickerObj.isShow=false;
        },
        comfirmEvent(){
            const self=this;
            self.$parent.datetimePickerObj.comfirmDate=self.activeYear.name+"-"+self.activeMonth.name+"-"+self.activeDate.name;
            self.$parent.datetimePickerObj.isShow=false;
        },
        getAngle(dx,dy){//获取滑动的角度
            return Math.atan2(dy, dx) * 180 / Math.PI;
        },
        getSliderDistance(x1,y1,x2,y2){
            var calX=x2-x1,
                calY=y2-y1;
            return Math.pow((calX *calX + calY * calY), 0.5);
        },
        getDirection(x1,y1,x2,y2){//获取滑动的方向
            const self=this;
            var differX=x2-x1;
            var differY=y1-y2;//y轴向下为正方形
            var result=0,angle;
            /*距离太短考虑*/
            if(Math.abs(differX)<2&&Math.abs(differY)<2){
                return result;
            }
            /*获取角度并传回result*/
            angle=self.getAngle(differX,differY);
            if(angle >= 45 && angle < 135){//向上
                result=1;
            }else if((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)){//向左
                result=2;
            }else if(angle>=-135&& angle < -45){//向下
                result=3;
            }else if(angle >= -45 && angle < 45){//向右
                result=4;
            }

            return result;
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
        overflow: hidden;
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
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
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
    .swiper-active{
        font-size:18px;
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