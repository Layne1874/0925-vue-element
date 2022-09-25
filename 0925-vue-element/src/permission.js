import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist


//路由切换之前以及初始化的时候，里面的回调就会执行
router.beforeEach(async (to, from, next) => {
  // console.log(to);//用next({...to})这里会打印两次，一次没有name属性，一次有name属性

  //to --表示要去的那个路由
  //from --表示从哪里来的那个路由
  //next --next()--调用之后表示可以进行路由切换

  // start progress bar 开启页面加载的效果
  NProgress.start()

  // set page title  获取页面标签的标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in --判断用户是否登录 获取token，如果hasToken有返回结果，证明已经登录
  const hasToken = getToken()//该函数执行结果是获得token

  //存在token说明已经登录
  if (hasToken) {

    //登录过就不能访问登录页面，需要中断这一次路由守卫，执行下一次路由守卫，并且下一次守卫的to是主页
    if (to.path === '/login') {
      // 如果跳转的是login登录界面的路由，那么执行以下代码
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      //如果去的不是登录页面，则获取仓库中存储的用户名
      const hasGetUserInfo = store.getters.name//获取仓库中存储的用户名
      if (hasGetUserInfo) {
        // 如果有用户名，则放行
        next()
      } else {
        // 页面刷新之后，会存在用户信息丢失的情况，也就是说每次页面刷新都会走一遍下面的代码  如果没有用户名就去仓库获取用户信息
        try {
          //#region 
          // get user info
          // next()
          /** 
           * next(): 不会触发 beforeEach
          next('/xxx') 或者 next({ path: '/xxx' }) 跳到不同的地址都会再次执行 router.beforeEach 钩子函数
          */
          //在getInfo执行的过程中，如果addRoutes并未完成，路由守卫会一层一层地执行，直到addRoutes完成，找到相对应的路由

          /**此时就要使用next({ ...to, replace: true })来确保addRoutes()时动态添加的路由已经被完全加载上去。
           * 其实next({ ...to })的执行很简单，它会判断：
          
          如果参数to不能找到对应的路由的话，就再执行一次beforeEach((to, from, next)直到其中的next({ ...to})能找到对应的路由为止。
          
          也就是说此时addRoutes()已经完成啦，找到对应的路由之后，接下来将执行前往对应路由的beforeEach((to, from, next) ，因此需要用代码来判断这一次是否就是前往对应路由的beforeEach((to, from, next)，如果是，就执行next()放行。
          
          如果守卫中没有正确的放行出口的话，会一直next({ ...to})进入死循环 !!!
          
          因此你还需要确保在当addRoutes()已经完成时，所执行到的这一次beforeEach((to, from, next)中有一个正确的next()方向出口
           */
          //#endregion
          await store.dispatch('user/getInfo')//通知仓库
          /** 
           * 上面这段代码包含动态添加路由的操作router.addRoutes(),由于在此过程中是要发送请求的，请求是有延迟的，因此
            next()不能直接写，否则addRoutes()还没结束就直接跳转，造成页面空白
           * */
          /*
          !!!!再次刷新页面会发现页面变空白了，这是因为刷新页面router实例会重新初始化到初始状态。
          如果直接next()，就表示不会再执行前置路由守卫了,会直接跳转到一个没有name属性的to对象
          虽然前面await store.dispatch('user/getInfo')已经把动态路由创建完了，
          但是最本质的区别在于next({ ...to, replace: true })会再走一遍前置路由守卫，
          这样就确保了在资源获取完成和动态路由创建完成后再进行路由重跳转||加载，这时再次进入的前置路由守卫的参数to就是已经动态创建好的路由
          这个时候的页面就有资源了
          */
          next({ ...to, replace: true });
          // console.log(router);
          // next()
        } catch (error) {

          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 没有token但是在白名单上
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
