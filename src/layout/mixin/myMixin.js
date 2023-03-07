export default{
    methods:{
        lend(money){
            this.money -= money
            this.$parent.money += money
        }
    }
    // 还可以写mount、计算属性等配置
}