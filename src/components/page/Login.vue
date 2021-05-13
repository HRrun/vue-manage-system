<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="账号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="verificationCode" :inline="true">
                    <el-input
                            style="width: 65%;"
                            placeholder="验证码"
                            v-model="param.verificationCode"
                            @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-circle-check"></el-button>
                    </el-input>
                    <div style="display: inline;" class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                        <img :src="imgsrc" id="imgIdentifyingCode" style="height:31px; width: 100px; cursor: pointer;border-radius:10px;"/>
                    </div>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips"></p>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            imgsrc: '',
            imgId: '',
            param: {
                username: 'admin',
                password: '',
                verificationCode: '',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
            },
        };
    },
    created() {
        this.getIdentifyingCode(true);
    },
    methods: {
        submitForm() {
            this.$addr.get("/auth/login", {
                params: {
                    account: this.param.username,
                    password: this.param.password,
                    verificationCode: this.param.verificationCode,
                    verifyCodeId: this.imgId
                }
            }).then((res) => {
                if (res.status !== 200) return;
                if (res.data.code === 111111) {
                    this.$message.success("登录成功");
                    localStorage.setItem('token', res.headers.token);
                    localStorage.setItem('csrf-token', res.headers['csrf-token']);
                    localStorage.setItem('ms_username', this.param.username);
                    return this.$router.push({path: '/dashboard'});
                }
                if (res.data.code === 600001) {
                    this.$message.error("登录失败，用户名或密码错误！");
                    this.getIdentifyingCode(true);
                }
                if (res.data.code === 600002) {
                    this.$message.error("登录失败，验证码已过期！");
                    this.getIdentifyingCode(true);
                }
                if (res.data.code === 600003) {
                    this.$message.error("登录失败，验证码错误！");
                    this.getIdentifyingCode(true);
                }
                if (res.data.error) return this.$message.error(res.data.error)
            });
        },
        /**
          * @param {Boolean} bRefresh 是否刷新
          */
        getIdentifyingCode: function (bRefresh) {
            this.$addr.get("/auth/verification/code/get").then((res) => {
                if (res.status === 200) {
                    this.imgsrc = 'data:image/png;base64,' + res.data.data.verifyCodeImage;
                    this.imgId = res.data.data.verifyCodeId;
                    return;
                }
                if (res.data.error) return this.$message.error(res.data.error)
            });
        }
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>