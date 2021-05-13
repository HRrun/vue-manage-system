<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 出入口管理
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
                <!--<el-input v-model="query.name" placeholder="停车场名" class="handle-input mr10"></el-input>
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
                        prop="name"
                        label="出入口名"
                        width="120"/>
                <el-table-column
                        label="类型"
                        width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.gatewayType | statusFilter">{{ scope.row.gatewayType | formatStatus }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="equipmentNumber"
                        label="设备编号"
                        width="120"
                />
                <!--<el-table-column
                        prop="email"
                        label="邮箱"
                        show-overflow-tooltip
                />
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        show-overflow-tooltip
                />
                <el-table-column
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | formatStatus }}</el-tag>
                    </template>
                </el-table-column>-->
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
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.gatewayType" placeholder="请选择" >
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="form.gatewayType"></el-input>-->
                </el-form-item>
                <el-form-item label="设备编号">
                    <el-input v-model="form.equipmentNumber"></el-input>
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
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.gatewayType" placeholder="请选择" >
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="form.gatewayType"></el-input>-->
                </el-form-item>
                <el-form-item label="设备编号">
                    <el-input v-model="form.equipmentNumber"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "gateway",
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
                idx: -1,
                id: -1,
                carParkId: '',
                options: [{
                    value: '1',
                    label: '入口'
                }, {
                    value: '0',
                    label: '出口'
                }],
            };
        },
        created() {
            this.carParkId = this.$route.query.carParkId;
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$addr.post("/parking-gateway/"+ this.carParkId +"/list/get", {
                    name : this.query.name
                }).then((res) => {
                        this.tableData = res.data.data;
                        this.pageTotal = res.data.total;
                    }
                );
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
                        this.$addr.post("/parking-gateway/"+ this.carParkId +"/delete", {
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
                const length = this.multipleSelection.length;
                for (let i = 0; i < length; i++) {
                    this.delList.push(this.multipleSelection[i].id);
                }
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$addr.post("/parking-gateway/"+ this.carParkId +"/delete", {
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
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$addr.post("/parking-gateway/"+ this.form.id +"/update", {
                    parkingSpacesNumber: this.form.parkingSpacesNumber,
                    name: this.form.name,
                    address: this.form.address
                }).then((res) => {
                        if (res.data.code == 111111) {
                            this.$message.success(`更新成功`);
                        }
                        this.getData();
                    }
                );
            },
            add() {
                this.addVisible = false;
                this.$addr.post("/parking-gateway/"+ this.carParkId +"/add", {
                    name: this.form.name,
                    equipmentNumber: this.form.equipmentNumber,
                    gatewayType: this.form.gatewayType
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
            statusFilter(gatewayType) {
                const statusMap = {
                    0: 'success',
                    1: 'success'
                }
                return statusMap[gatewayType]
            },
            formatStatus(gatewayType) {
                const statusMap = {
                    0: '出口',
                    1: '入口'
                }
                return statusMap[gatewayType]
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