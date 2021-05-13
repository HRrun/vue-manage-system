<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
                    新增
                </el-button>
                <el-button
                        type="danger"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除</el-button>
                <!--<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>-->
                <el-input v-model="query.account" placeholder="用户名" class="handle-input mr10"></el-input>
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
                        prop="username"
                        label="用户名"
                        width="120"/>
                <el-table-column
                        prop="account"
                        label="账号"
                        width="120"/>
                <el-table-column
                        prop="mobile"
                        label="电话号码"
                        width="120"
                />
                <el-table-column
                        prop="email"
                        label="邮箱"
                        show-overflow-tooltip
                />
                <el-table-column
                        label="创建时间"
                        show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{ scope.row.createTime | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | formatStatus }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
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

        <!-- 编辑弹出框 -->
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
        </el-dialog>

        <!-- 编辑新增框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input v-model="form.comfirmPassword" show-password></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {formatDate} from '../../utils/dateUtil';
    export default {
        name: "users",
        data() {
            return {
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
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
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$addr.get("/sys-user/get/list").then((res) => {
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
                        this.$addr.post("/sys-user/delete", {
                            ids: this.delList
                        }).then((res) => {
                                this.$message.success('删除成功');
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
                        this.$addr.post("/sys-user/delete", {
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
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                let param = {};
                param.username = this.edit.username;
                if (this.edit.phone.split(" ").join("").length !== 0) {
                    param.phone = this.edit.phone;
                }
                if (this.edit.email.split(" ").join("").length !== 0) {
                    param.email = this.edit.email;
                }
                this.$addr.post("/sys-user/"+ this.form.id +"/update", param).then((res) => {
                        if (res.data.code == 111111) {
                            this.$message.success(`编辑成功`);
                        }
                        this.getData();
                    }
                );
            },
            addUser() {
                this.addVisible = false;
                this.$addr.post("/sys-user/add", {
                    account: this.form.account,
                    username: this.form.username,
                    password: this.form.password,
                    mobile: this.form.phone,
                    email: this.form.email
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
            }

        },
        filters: {
            statusFilter(status) {
                const statusMap = {
                    0: 'danger',
                    1: 'success'
                }
                return statusMap[status]
            },
            formatStatus(status) {
                const statusMap = {
                    0: '禁用',
                    1: '正常'
                }
                return statusMap[status]
            },
            formatDate (time) {
                let date = new Date(time);
                return formatDate(time)
            }
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