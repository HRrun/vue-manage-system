<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 卡管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="mr10" @click="handleAdd">
                    新增
                </el-button>

                <el-input v-model="query.plate" placeholder="车牌号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="plate"
                        label="车牌号"/>
                <el-table-column
                        label="卡类型">
                    <template slot-scope="scope">
                        <el-tag type="success">{{ scope.row.cardType | formatStatus }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"/>
                <el-table-column
                        prop="phone"
                        label="电话号码"/>
                <el-table-column label="购买时间">
                    <template slot-scope="scope">
                        {{ scope.row.buyTime | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column label="过期时间">
                    <template slot-scope="scope">
                        {{ scope.row.expiredTime | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="parkName"
                        label="停车场"
                        show-overflow-tooltip
                />
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                       <!-- <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>-->
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!--&lt;!&ndash; 编辑弹出框 &ndash;&gt;
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="edit" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="edit.username"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="edit.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="edit.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>-->

        <!-- 编辑新增框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="姓名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="车牌号">
                    <el-input v-model="form.plate"></el-input>
                </el-form-item>
                <el-form-item label="卡类型">
                    <el-select v-model="cardType" placeholder="请选择" style="width: 100%;">
                        <el-option
                                v-for="item in cardOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="停车场">
                    <el-select v-model="parkId" placeholder="请选择" style="width: 100%;">
                        <el-option
                                v-for="item in parkOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="container" style="width: 250px; height: 150px;margin-left: 20%;">
                    <div id="qrcode" ref="qrcode" style="margin-left: 20%;margin-top: 5%"></div>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {formatDate} from '../../utils/dateUtil';
    import QRCode from "qrcodejs2";
    export default {
        name: "monthCard",
        data() {
            return {
                query: {
                    plate: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                cardOptions: [
                    {
                        value: 2,
                        label: '月卡'
                    },
                    {
                        value: 3,
                        label: '年卡'
                    }
                ],
                parkOptions: [],
                editVisible: false,
                addVisible: false,
                pageTotal: 0,
                form: {},
                edit: {
                    username: '',
                    phone: '',
                    email: ''
                },
                idx: -1,
                id: -1,
                cardType: 3,
                parkId: '',
                billQRCode: '',
                billNO: ''
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$addr.post("/car-card/list",{
                    plate: this.query.plate,
                    pageSize: this.query.pageSize,
                    pageIndex: this.query.pageIndex
                }).then((res) => {
                        this.tableData = res.data.data;
                        this.pageTotal = res.data.total;
                    }
                );
                /*fetchData(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.list;
                    this.pageTotal = res.pageTotal || 50;
                });*/
            },
            // 触发新增按钮
            handleAdd() {
                this.addVisible = true;
                this.$addr.get("/car-park/list").then((res) => {
                        this.parkOptions = res.data.data;
                    }
                );
                this.$addr.post("/payment/web/card/buy", {
                    cardType: this.cardType
                }).then((res) => {
                        this.billQRCode = res.data.data.billQRCode;
                        this.billNo = res.data.data.billNo;
                        this.createQrCode();
                    }
                );
                //this.getQRCode();

            },
            getQRCode(){
                this.$addr.post("/payment/web/card/buy", {
                    cardType: this.cardType
                }).then((res) => {
                        this.billQRCode = res.data.data.billQRCode;
                        this.billNo = res.data.data.billNo;
                        this.createQrCode();
                    }
                );
            },
            createQrCode() {
                let qrcode = new QRCode(document.getElementById("qrcode"), {
                    width: 100, // 二维码宽度，单位像素
                    height: 100, // 二维码高度，单位像素
                    text: this.billQRCode, // 生成二维码的链接
                    background: '#f0f',   // 背景色
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.delList.push(row.id);
                        this.$addr.post("/car-card/delete", {
                            ids: this.delList
                        }).then((res) => {
                                this.$message.success(res.data.msg);
                                this.getData();
                            }
                        );

                    })
                    .catch(() => {});
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        const length = this.multipleSelection.length;
                        for (let i = 0; i < length; i++) {
                            this.delList.push(this.multipleSelection[i].id);
                        }
                        this.$addr.post("/car-card/delete", {
                            ids: this.delList
                        }).then((res) => {
                                this.$message.success('删除成功');
                                this.getData();
                            }
                        );

                    })
                    .catch(() => {});
                this.multipleSelection = [];
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.edit.username = row.username;
                this.editVisible = true;
            },
            add() {
                this.addVisible = false;
                this.$addr.post("/car-card/add", {
                    plate: this.form.plate,
                    cardType: this.cardType,
                    parkId: this.parkId,
                    username: this.form.username,
                    phone: this.form.phone,
                    billNo: this.billNo
                }).then((res) => {
                        if (res.data.code == 111111) {
                            this.$message.success(`新增成功`);
                            this.form = {};
                        }
                        this.getData();
                    }
                );
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            },
            changeCarType(curVal,oldVal){
                this.carType = curVal;
                this.getQRCode();
            }

        },
        filters: {
            statusFilter() {
                return 'success';
            },
            formatStatus(type) {
                const statusMap = {
                    1: '周卡',
                    2: '月卡',
                    3: '年卡'
                }
                return statusMap[type]
            },
            formatDate (time) {
                let date = new Date(time);
                return formatDate(time)
            }
        },
        watch: {
            data: 'changeCarType'// 值可以为methods的方法名
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>