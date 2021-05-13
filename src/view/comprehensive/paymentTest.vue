<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 支付测试
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" style="width: 250px; height: 150px;margin-left: 20%;">
            <div id="qrcode" ref="qrcode" style="margin-left: 20%; margin-top: 5%" ></div>
        </div>

    </div>
</template>

<script>
    import QRCode from 'qrcodejs2'
    export default {
        name: "paymentTest",
        data() {
            return {
                billQRCode: ''
            }
        },

        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$addr.post("/bills/getQrCode").then((res) => {
                        this.billQRCode = res.data.data;
                       this.createQrCode();
                    }
                );
            },
            createQrCode() {
                let qrcode = new QRCode("qrcode", {
                    width: 100, // 二维码宽度，单位像素
                    height: 100, // 二维码高度，单位像素
                    text: this.billQRCode // 生成二维码的链接
                });
            }
        }
    }

</script>

<style scoped>

</style>