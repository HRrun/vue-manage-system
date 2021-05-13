<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 车辆缴费列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
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
                this.$addr.post("/statistics/vehicle/payment", {
                    numberPlate: this.query.numberPlate,
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
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            }

        },
        filters: {
            statusFilter(payStatus) {
                const statusMap = {
                    0: 'danger',
                    1: 'success',
                    2: 'success'
                }
                return statusMap[payStatus]
            },
            formatStatus(payStatus) {
                const statusMap = {
                    0: '未缴费',
                    1: '已缴费',
                    2: '不收费'
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