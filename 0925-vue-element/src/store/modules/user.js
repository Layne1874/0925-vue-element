//引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
//获取token|设置token|删除token函数
import { getToken, setToken, removeToken } from '@/utils/auth'
//路由模块当中重置路由的方法
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
//引进路由
import router from '@/router';

const getDefaultState = () => {

  return {
    // 获取token
    token: getToken(),
    //存储用户名
    name: '',
    //存储用户头像
    avatar: '',
    //服务器返回的菜单信息【根据不同的角色，返回的标记信息，数组里面的元素是字符串】
    routes: [],
    //角色信息
    roles: [],
    // 按钮权限的信息
    buttons: [],
    //！！对比之后【项目中代码已有的异步路由，与服务器返回的路由字段进行对比最终需要展示的路由】
    resultAsyncRoutes: [],
    //用户最终需要展示的路由
    resultAllRoutes: []
  }
}

//state就是getDefaultState调用返回的结果 
const state = getDefaultState();

//唯一修改state的地方
const mutations = {
  //重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },

  //登录之后存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //#region 
  // //存储用户名
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // //存储用户头像
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  //#endregion
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    //用户名
    state.name = userInfo.name;
    //用户头像
    state.avatar = userInfo.avatar;
    //菜单权限标记
    state.routes = userInfo.routes;
    //按钮权限标记
    state.buttons = userInfo.buttons;
    //角色
    state.roles = userInfo.roles;
  },
  //最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    //vuex所保存当前用户的异步路由，还不包括常量路由和任意路由，因此需要把所有路由合并并展示
    state.resultAsyncRoutes = asyncRoutes;
    //计算出当前用户所需展示的所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
    //最后给路由添加新的路由
    router.addRoutes(state.resultAllRoutes);
  }
}

//定义一个函数：两个存储路由相关信息的数组进行比较，对比当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {

  //过滤当前用户，【超级管理|普通员工】需要展示的异步路由
  //将前端所写的路由进行过滤，与后端返回的路由信息进行对比，后端返回里面有的才能展现出来，即return true;
  return asyncRoutes.filter(item => {
    //数组中没有这个元素返回的索引值-1，如果有这个元素返回的索引值一定不是-1
    if (routes.indexOf(item.name) != -1) {
      //递归，因为还有2、3、4...级路由需要筛选
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }

  });
}


const actions = {
  //#region 
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  //#endregion

  // user login在这里处理登录业务
  async login({ commit }, userInfo) {
    //解构赋值--用户和密码
    const { username, password } = userInfo;
    let result = await login({ username: username.trim(), password: password });

    //
    if (result.code == 20000) {
      //获取到用户token后进行以下操作--vuex存储token
      commit('SET_TOKEN', result.data.token);
      setToken(result.data.token);
      return 'ok!';
    } else {
      return Promise.reject(new Error('faile'));
    }

  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        //获取用户信息:返回的数据包含：用户名信息、用户头像avatar、routes-【返回的标志：不同的用户应该展示哪些菜单的标记】
        const { data } = response;
        //vuex存储用户全部的信息
        commit('SET_USERINFO', data);

        //将已有的路由与服务器返回的路由进行对比
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes));
        resolve(data);

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // async getInfo({ commit, state }) {
  //   let result = await getInfo();
  //   console.log(resresult);
  // },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

