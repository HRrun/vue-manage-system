<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
                    新增
                </el-button>
                <!--<el-button
                        type="danger"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除</el-button>-->
                <!--<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>-->
                <!--<el-input v-model="query.roleName" placeholder="角色名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>-->
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
                        prop="roleName"
                        label="角色名"
                        width="120"/>
                <el-table-column
                        prop="roleCode"
                        label="角色代码"
                        width="120"/>
                <el-table-column
                        prop="remark"
                        label="备注"
                        width="120"
                />
                <el-table-column
                        label="创建时间"
                        show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{ scope.row.createTime | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleAuth(scope.$index, scope.row)"
                        >授权</el-button>
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

        <!-- 授权弹出框 -->
        <el-dialog title="授权" :visible.sync="authVisible" width="30%">
            <el-table
                    :data="authData"
                    style="width: 100%"
                    ref="multipleTable"
                    row-key="id"
                    border
                    lazy
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    @selection-change="handleAuthSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="title"
                        width="140px"
                        label="菜单名称">
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="authVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAuth">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="角色名">
                    <el-input v-model="form.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色编码">
                    <el-input v-model="form.roleCode"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark"></el-input>
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
                <el-form-item label="角色名">
                    <el-input v-model="form.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色代码">
                    <el-input v-model="form.roleCode"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {formatDate} from '../../utils/dateUtil';
    export default {
        name: "roles",
        data() {
            return {
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                authData: [],
                multipleSelection: [],
                multipleAuthSelection: [],
                delList: [],
                roleIds: [],
                menuIds: [],
                authVisible: false,
                editVisible: false,
                addVisible: false,
                pageTotal: 0,
                form: {},
                auth: {},
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
                this.$addr.post("/sys-role/list",{
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
                        this.delList.push(row.id)
                        this.$addr.post("/sys-role/delete", {
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
            handleAuthSelectionChange(val) {
                this.multipleAuthSelection = val;
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$addr.post("/sys-role/"+ this.form.id +"/update", {
                    roleName: this.form.roleName,
                    roleCode: this.form.roleCode,
                    remark: this.form.remark
                }).then((res) => {
                        if (res.data.code == 111111) {
                            this.$message.success(`编辑成功`);
                        }
                        this.getData();
                    }
                );
            },
            // 授权操作
            handleAuth(index, row) {
                this.$addr.post("/sys-menu/list", {
                }).then((res) => {
                        this.authData = res.data.data;
                    }
                );
                this.idx = index;
                this.auth = row;
                this.authVisible = true;
            },
            // 确认授权
            saveAuth() {
                this.AuthVisible = false;
                this.roleIds.push(this.auth.id);
                const roleLength = this.multipleSelection.length;
                for (let i = 0; i < roleLength; i++) {
                    this.roleIds.push(this.multipleSelection[i].id);
                }
                const menuLength = this.multipleAuthSelection.length;
                for (let i = 0; i < menuLength; i++) {
                    this.menuIds.push(this.multipleAuthSelection[i].id);
                }
                this.$addr.post("/sys-role-menu/auth", {
                    menuIds: this.menuIds,
                    roleIds: this.roleIds
                }).then((res) => {
                        if (res.data.code == 111111) {
                            this.$message.success(`授权成功`);
                        } else {
                            this.$message.success(`授权失败`);
                        }
                        this.getData();
                    }
                );
            },
            addUser() {
                this.addVisible = false;
                this.$addr.post("/sys-role/add", {
                    roleName: this.form.roleName,
                    roleCode: this.form.roleCode,
                    remark: this.form.remark
                }).then((res) => {
                        if (res.data.code == 111111) {
                            this.$message.success(`新增成功`);
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