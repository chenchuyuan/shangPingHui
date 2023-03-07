import axios from 'axios'
const state = {}
const mutations = {}
const actions = {
  async getData({ commit }) {
    const res = await axios.get('/home/list')
    console.log(res)
  }
}
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}
