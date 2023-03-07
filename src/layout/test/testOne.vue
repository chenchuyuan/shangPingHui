<template>
    <div>
        <ul>
            <li v-for="(item,index) in todos">
                <!-- 子组件的数据来自父组件，子组件没有决定不了结构和外观（css），需将数据回传给父组件处理 -->
                <!-- 作用域插槽：能够用于父子组件通信 -->
                <!-- 这里相当于占据了一个坑，留着给父组件处理 -->
                <slot :theSame="item" :$index="index"></slot>
            </li>
        </ul>
    </div>
</template>

<script>
export default{
    data(){
        return{
           
        }
    },
    props:{
        todos:Array
    }
}
</script>