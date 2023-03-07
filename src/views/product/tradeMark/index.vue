<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px;" @click="showDialog">添加</el-button>
    <!-- 对话框 -->
    <el-dialog :title="this.tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" style="width: 80%;" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <!-- 也是写在upload里边 -->
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTM('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table width="100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column label="品牌名称" prop="tmName" />
      <el-table-column label="品牌LOGO" prop="logoUrl">
        <template slot-scope="{row,$index}">
          <el-image :src="row.logoUrl" style="width: 100px; height: 100px" fit="scale-down" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDateTM(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
            分页器应该包含内容：当前第几页、数据总数、每一页展示数据条数、连续页面数
            current-page：当前是第几页
            total：总数据数
            page-size：每一页展示多少条数据
            page-sizes：设置每一页展示多少条数据
            pager-count：按钮数；连续分页为按钮数-2（头和尾）
            layout：布局，->表示最靠右
        -->
    <el-pagination
      style="margin-top: 20px; textAlign:center"
      :current-page="page"
      :total="total"
      :page-size="3"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="getTradeMarkList"
      @size-change="changeSize"
    />
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    // 自定义表单验证规则
    var checkLenth = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('长度错误'))
      } else {
        // else里边也要有callback(),否则表单验证的validate会处于padding状态
        callback()
      }
    }
    return {
      // 当前所在页面
      page: 1,
      // 页面所显示的数据条数
      limit: 5,
      // 当前页面数据
      list: [],
      // 总的数据数
      total: 50,
      // 控制对话框显示
      dialogFormVisible: false,
      // 所上传logo的地址
      imageUrl: '',
      // 添加接口数据
      tmForm: {
        // 品牌名称
        tmName: '',
        // 品牌所在的服务器地址，这里写死了，因为接口不正常
        // logoUrl: 'http://47.93.148.192:8080/group1/M00/03/D9/rBHu8mHmKF2AWpcKAADv98DWYRo516.jpg'
        logoUrl: ''
      },
      // 表单校验规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          // 自定义规则
          { validator: checkLenth, trigger: 'change' }
        ],
        logoUrl: [
          // 非表单元素，trigger属性没有意义
          { required: true, message: '请选择品牌图片' }
        ]
      }
    }
  },
  mounted() {
    // 组件挂载完毕发送请求
    // console.log(this.$Api);
    // 调用获取数据方法
    this.getTradeMarkList()
  },
  // 优化的写法
  methods: {
    async getTradeMarkList(pager = 1) {
      // console.log('pager',pager);
      this.page = pager
      // 要获取参数，在data里边设置好变量，然后进行解构赋值
      const { page, limit } = this
      // 使用接口获取数据
      const result = await this.$Api.tradeMark.reqtradeMarkList(page, limit)
      this.list = result.data.data.records
      // console.log(result);
      // console.log('list',this.list);
    },
    // 页面显示量
    changeSize(size) {
      // console.log(size);
      this.limit = size
      this.getTradeMarkList()
    },
    // 添加对话框
    showDialog() {
      this.dialogFormVisible = true
    },
    // 更新产品
    updateTradeMark(row) {
      this.dialogFormVisible = true
      // row是服务器返回来的数据，使用下面这种写法相当于直接修改返回来的数据
      // this.tmForm = row
      // 使用浅复制？？，避免出现修改的时候展示表格就同步修改的问题
      this.tmForm = { ...row }
    },
    // 上传图片成功回调
    handleAvatarSuccess(res, file) {
      console.log('图片成功回调', res)
      this.tmForm.logoUrl = res.data
      // 正常情况下，这里res会返回图片的数据，包括在服务器上的地址
    },
    // 上传图片前的处理
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //     this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      // return isJPG && isLt2M;
      return isLt2M
    },
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false
      // 清空已输入的
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },
    // 确定提交或更改按钮
    addOrUpdateTM(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          // 发送数据（调用接口）
          const result = await this.$Api.tradeMark.addOrUpdateTradeMark(this.tmForm)
          console.log('result', result)
          if (result.data.code === 200) {
            this.$message(this.tmForm.id ? '更新成功' : '添加成功')
            this.getTradeMarkList(this.page)
            this.dialogFormVisible = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除品牌
    deleteDateTM(row) {
      console.log(row.id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const result = await this.$Api.tradeMark.deleteDateTM(row.id)
        console.log('resu', result)
        if (result.data.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新获取数据
          this.getTradeMarkList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
  // 原来的写法
  // methods:{
  //     async getTradeMarkList(){
  //         // 要获取参数，在data里边设置好变量，然后进行解构赋值
  //         const { page, limit } = this
  //         // 使用接口获取数据
  //         let result = await this.$Api.tradeMark.reqtradeMarkList(page,limit)
  //         this.list = result.data.data.records
  //         console.log(result);
  //         console.log('list',this.list);
  //     },
  //     getCurrentDate(pager){
  //         this.page = pager
  //         this.getTradeMarkList()
  //     }
  // }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
