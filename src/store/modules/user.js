import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes, resetRouter, constantRoutes, anyRoutes } from '@/router'
import router from '@/router'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    buttons: [],
    roles: [],
    routes: [],
    // 1.新建一个新属性，将已有的异步路由与返回的路由权限进行对比，储存最终需要展示的数据
    resultAsyncRoutes: [],
    //  5.新建一个属性，用于储存最后总的需要的展示的路由（将常量、异步、任意路由进行合并）
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  SET_USERINFO: (state, info) => {
    const { name, avatar, roles, routes, buttons } = info
    state.name = name
    state.avatar = avatar
    state.roles = roles
    state.routes = routes
    state.buttons = buttons
  },
  // 2.对储存的信息进行赋值
  SET_RESULTASYNCROUTES: (state, resultAsyncResult) => {
    state.resultAsyncRoutes = resultAsyncResult
    //  5.进行合并
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    //  6.添加新的路由(router需要引入)
    router.addRoutes(state.resultAllRoutes)
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    // 解构赋值
    const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    // promise改用async写法
    const result = await login({ username: username.trim(), password: password })
    console.log('result', result)
    // 虚拟数据的code是20000
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        console.log('data', data)
        // const { name, avatar } = data

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        commit('SET_USERINFO', data)
        // 3.调用赋值的方法,并将计算后的值传过去（计算对象为导入的asyncRoutes和服务器返回的data.routes）
        commit('SET_RESULTASYNCROUTES', computedResult(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

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

// 4.将方法进行书写
const computedResult = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    // 值不为 -1 说明存在
    if (routes.indexOf(item.name) !== -1) {
      // 使用递归，判断其children节点的路由是否符合
      if (item.children && item.children.length) {
        // 注意：这里需要将返回的值进行赋值
        item.children = computedResult(item.children, routes)
      }
      return true
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

