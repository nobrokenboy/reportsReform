<!--=include include/header.html-->
<style></style>
<div class="form-reports" id="monthReports" v-if="isShow" v-cloak>
    <section>
        <!--头部导航栏-->
        <header-nav>
            <span slot="title" class="f16">工程管理月报表</span>
        </header-nav>
        <!--导航栏-->
        <section>
            <nav class="select-type-nav clearfix">
                <div class="fl type-wrapper">
                    <ul class="type-select">
                        <li v-for="(item,key) in tabItems" @click="activeIndex=key" value="key">
                            <router-link :to="item.routerName" :class="{'active':activeIndex==key}" >{{item.text}}</router-link>
                        </li>
                    </ul>
                    <div class="slider-active" v-tab-slider></div>
                </div>
                <div class="fr download-wrapper">
                    <a class="font-orange block text-right padding-right-10" @click="download">下载</a>
                </div>
            </nav>
        </section>
        <!--路由切换-->
        <transition>
            <router-view ></router-view>
        </transition>
    </section>

</div>
<!--=include include/default.html-->
<script src="../common.chunk.js.build.js"></script>
<script src="month_reports.build.js"></script>
<!--=include include/footer.html-->