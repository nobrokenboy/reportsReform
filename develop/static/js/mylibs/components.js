/**
 * Created by jessic on 2017/4/7.
 */
import Vue from "vue";
import $ from "jquery";
import router from "vue-router";
/*验证码*/
Vue.component("comp-verifycode",{
    props:{
        second: {
            type: Number,
            default: 60
        }
    },
    template:'<div>\
        <div class="fl app-form-spe-left">\
            <label for="identity" class="c-label">验证码:</label>\
            </div>\
            <div class="fr app-form-spe-right clearfix">\
                <input type="text" placeholder="请输入验证码" class="verify-text fl"\
                v-model.trim="codeNum" @keyup="codekeyup" @blur="codeblur" @focus="codefocus"/>\
                <button type="button" class="common-btn common-inactive-btn btn-verify fr"\
                     @click="verifyclick" :disabled="isVerifyClickDisabled">\
                    <span>{{codeText}}</span>\
                </button>\
            </div>\
    </div>',
    data(){
        return {
            time:0,
            timer:null,
            codeNum:""
        }
    },
    computed:{
        codeText(){
            return  this.time==0?"获取验证码":this.time+"s后重新获取";
        },
        isVerifyClickDisabled(){
            return  this.time==0?false:true;
        }

    },
    methods:{
        setTime(){
            var self=this;
            self.time=self.second;
        },
        timeDeal(){
            var self=this;
            if(self.time==0){
                clearInterval(self.timer);
            }else{
                self.time--;
            }
        },
        codekeyup(){
            var self=this;
            self.$emit('codekeyup');
        },
        codeblur(){
            var self=this;
            self.$emit('codeblur',self.codeNum);
        },
        codefocus(){
            var self=this;
            self.$emit('codefocus');
        },
        verifyclick(){
            var self=this;
            self.setTime();
            self.timer=setInterval(function(){
                self.timeDeal();
                console.log(self.time);
            },1000);
            self.$emit('verifyclick');
        }
    }

});
/*弹框*/
Vue.component("app-modal",{
    props:["isShowModal","transitionType"],
    template:'<transition :name="transitionType" >\
        <div class="app-modal animated" id="appModal" v-if="isShowModal" v-on:click.self="setClose">\
            <div class="app-modal-wrapper">\
                <slot name="close"></slot>\
                <h2><slot name="title"></slot></h2>\
                <slot slot name="content"></slot></div>\
            </div>\
        </div>\
    </transition>',
    data(){
        return {

        }
    },
    mounted(){
        var self=this;
    },
    watch:{//控制滚动条
        isShowModal(nVal,oVal){
            console.log(nVal);
            if(nVal){
                $("html,body").addClass("hidden");
            }else{
                $("html,body").removeClass("hidden");
            }
        }
    },
    methods:{
        setClose(){
           const self=this;
            //约定父组件控制子组件状态的字段
            self.$parent.modalObj.isModalShow=false;
        }
    }

});
/*头部导航栏*/
Vue.component('header-nav',{
    props:[],
    template:`<nav class="app-nav-bar">
        <a class="app-nav-btn-wrapper" @click="goBack"></a>
        <slot name="title"></slot>
    </nav>`,
    methods:{
        goBack(){
            const self=this;
            window.history.go(-1);//会在hash之间跳转
        }
    }

});