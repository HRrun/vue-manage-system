<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 订单列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.billNo" placeholder="账单号" class="handle-input mr10"></el-input>
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
                        prop="billNo"
                        label="账单号"/>
                <el-table-column
                        prop="billDate"
                        label="日期"
                />
                <el-table-column
                        label="金额(元)"
                >
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.totalAmount | formatAmount }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="billDesc"
                        label="账单描述"
                />
                <el-table-column
                        label="支付状态"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.billStatus | statusFilter">{{ scope.row.billStatus | formatStatus }}</el-tag>
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

    </div>
</template>

<script>
    import {formatDate} from "../../utils/dateUtil";

    export default {
        name: "orders",
        data() {
            return {
                query: {
                    billNo: '',
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
                this.$addr.post("/statistics/orders", {
                    billNo: this.query.billNo,
                    pageIndex: this.query.pageIndex,
                    pageSize: this.query.pageSize
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
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 分页导航
            handlePageChange(val) {
                this.query.pageIndex = val;
                this.getData();
            }

        },
        filters: {
            statusFilter(payStatus) {
                const statusMap = {
                    0: 'danger',
                    1: 'success'
                }
                return statusMap[payStatus]
            },
            formatStatus(payStatus) {
                const statusMap = {
                    0: '未支付',
                    1: '已支付'
                }
                return statusMap[payStatus]
            },
            formatDate (time) {
                if (time === null) {
                    return "";
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