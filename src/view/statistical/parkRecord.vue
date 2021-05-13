<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 停车记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button type="primary" icon="el-icon-plus" @click="handleAdd">
                    新增
                </el-button>
                <el-button
                        type="danger"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除</el-button>-->
                <!--<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>-->
                <el-input v-model="query.numberPlate" placeholder="车牌号" class="handle-input mr10"></el-input>
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
                        prop="numberPlate"
                        label="车牌号"
                        width="120"/>
                <el-table-column
                        label="入场时间"
                        show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{ scope.row.enterTime | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="出场时间"
                        show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{ scope.row.outTime | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="parkName"
                        label="停车场"
                        show-overflow-tooltip
                />
                <el-table-column
                        prop="entryName"
                        label="入口"
                        show-overflow-tooltip
                />
                <el-table-column
                        prop="outName"
                        label="出口"
                        show-overflow-tooltip
                />
                <el-table-column
                        prop="parkingTime"
                        label="停车时长"
                        show-overflow-tooltip
                />
                <el-table-column
                        label="应缴费金额"
                >
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.fee | formatAmount }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="缴费状态"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.payStatus | statusFilter">{{ scope.row.payStatus | formatStatus }}</el-tag>
                    </template>
                </el-table-column>
                <!--<el-table-column label="操作" width="180" align="center">
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
                </el-table-column>-->
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
    </div>
</template>

<script>
    import {formatDate} from "../../utils/dateUtil";

    export default {
        name: "parkRecord",
        data() {
            return {
                query: {
                    numberPlate: '',
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
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$addr.post("/parking-record/get/list", {
                    numberPlate: this.query.numberPlate,
                    pageIndex: this.query.pageIndex,
                    pageSize: this.query.pageSize
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
                        this.$addr.post("/sys-user/delete", {
                            ids: row.id
                        }).then((res) => {
                                this.tableData = res.data.data;
                                this.pageTotal = res.data.total;
                                this.$message.success('删除成功');
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
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
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
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$set(this.tableData, this.idx, this.form);
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
                    0: '未缴费',
                    1: '已缴费',
                    2: '不收费'
                }
                return statusMap[status]
            },
            formatDate (time) {
                if (time === null) {
                    return null;
                }
                let date = new Date(time);
                return formatDate(time)
            },
            formatAmount (totalAmount) {
                return totalAmount/100;
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