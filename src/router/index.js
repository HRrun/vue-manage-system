import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    /*base: '/car-park/',
    mode: 'history',*/
    routes: [
        {
            path: '/',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/home',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            children: [
                {
                    path: '/dashboard',
                    //component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/page.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/users',
                    component: () => import('../view/system/users.vue'),
                    meta: { title: '用户管理'}
                },
                {
                    path: '/authority',
                    component: () => import('../view/system/authority.vue'),
                    meta: { title: '权限管理'}
                },
                {
                    path: '/roles',
                    component: () => import('../view/system/roles.vue'),
                    meta: { title: '角色管理'}
                },
                {
                    path: '/menus',
                    component: () => import('../view/system/menus.vue'),
                    meta: { title: '菜单管理'}
                },
                {
                    path: '/apis',
                    component: () => import('../view/system/apis.vue'),
                    meta: { title: 'API管理'}
                },
                {
                    path: '/park-record',
                    component: () => import('../view/statistical/parkRecord.vue'),
                    meta: { title: '停车记录'}
                },
                {
                    path: '/real-time',
                    component: () => import('../view/statistical/realTime.vue'),
                    meta: { title: '实时数据统计'}
                },
                {
                    path: '/turnover',
                    component: () => import('../view/statistical/turnover.vue'),
                    meta: { title: '营业额统计'}
                },
                {
                    path: '/stop-car',
                    component: () => import('../view/statistical/stopCar.vue'),
                    meta: { title: '停车统计'}
                },
                {
                    path: '/vehiclePayment',
                    component: () => import('../view/finance/vehiclePayment.vue'),
                    meta: { title: '车辆缴费列表'}
                },
                {
                    path: '/orders',
                    component: () => import('../view/finance/orders.vue'),
                    meta: { title: '订单列表'}
                },
                {
                    path: '/financial-statements',
                    component: () => import('../view/finance/financialStatements.vue'),
                    meta: { title: '财务报表'}
                },
                {
                    path: '/receive-payment',
                    component: () => import('../view/finance/receivePayment.vue'),
                    meta: { title: '收款管理'}
                },
                {
                    path: '/events-list',
                    component: () => import('../view/activity/eventsList.vue'),
                    meta: { title: '活动列表'}
                },
                {
                    path: '/coupon',
                    component: () => import('../view/activity/coupon.vue'),
                    meta: { title: '优惠券列表'}
                },
                {
                    path: '/pda',
                    component: () => import('../view/PDA/list.vue'),
                    meta: { title: 'PDA管理'}
                },
                {
                    path: '/common',
                    component: () => import('../view/cars/common.vue'),
                    meta: { title: '普通车辆管理'}
                },
                {
                    path: '/special',
                    component: () => import('../view/cars/special.vue'),
                    meta: { title: '特殊车辆管理'}
                },
                {
                    path: '/carType',
                    component: () => import('../view/cars/carType.vue'),
                    meta: { title: '车辆类型管理'}
                },
                {
                    path: '/car-park',
                    component: () => import('../view/comprehensive/carPark.vue'),
                    meta: { title: '停车场管理'}
                },
                {
                    path: '/gateway',
                    component: () => import('../view/comprehensive/gateway.vue'),
                    meta: { title: '出入口管理'}
                },
                {
                    path: '/hardware',
                    component: () => import('../view/comprehensive/hardware.vue'),
                    meta: { title: '硬件设施管理'}
                },
                {
                    path: '/paymentInstitution',
                    component: () => import('../view/comprehensive/paymentInstitution.vue'),
                    meta: { title: '支付机构管理'}
                },
                {
                    path: '/receivingMerchant',
                    component: () => import('../view/comprehensive/receivingMerchant.vue'),
                    meta: { title: '收款商户管理'}
                },
                {
                    path: '/platformAccount',
                    component: () => import('../view/comprehensive/platformAccount.vue'),
                    meta: { title: '平台账号管理'}
                },
                {
                    path: '/paymentTest',
                    component: () => import('../view/comprehensive/paymentTest.vue'),
                    meta: { title: '支付测试'}
                },
                {
                    path: '/monthCard',
                    component: () => import('../view/cards/monthCard.vue'),
                    meta: { title: '月卡管理'}
                },
                {
                    path: '/yearCard',
                    component: () => import('../view/cards/yearCard.vue'),
                    meta: { title: '年卡管理'}
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
