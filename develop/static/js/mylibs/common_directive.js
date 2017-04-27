/**
 * Created by jessic on 2017/4/5.
 */
import Vue from "vue";
// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
    // 当绑定元素插入到 DOM 中。
    inserted(el){
        // 聚焦元素
        el.focus();
    }
});
/*切换卡下面的滑块滑动*/
Vue.directive('tab-slider',{
     bind(el,binding,vnode){
         const $el=el;
         const itemWidth=0.25;
         const vm=vnode.context;
         const activeIndex=vm.activeIndex;
         console.log(activeIndex);
         el.style.left=activeIndex*itemWidth*100+"%";
     },
    update(el,binding,vnode){
        const $el=el;
        const itemWidth=0.25;
        const vm=vnode.context;
        const activeIndex=vm.activeIndex;
        console.log(activeIndex);
        el.style.left=activeIndex*itemWidth*100+"%";
    }
});