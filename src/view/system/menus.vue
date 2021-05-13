<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 菜单管理
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
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>-->
            </div>
            <el-table
                    :data="tableData"
                    style="width: 100%"
                    ref="multipleTable"
                    row-key="id"
                    border
                    lazy
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="title"
                        width="140px"
                        label="菜单名称">
                </el-table-column>
                <el-table-column
                        label="类型">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.type | statusFilter">{{ scope.row.type | formatStatus }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="iconCode"
                        label="图标">
                </el-table-column>
                <el-table-column
                        prop="level"
                        label="排序">
                </el-table-column>
                <el-table-column
                        prop="flag"
                        label="状态">
                </el-table-column>
                <el-table-column
                        prop="url"
                        label="路径">
                </el-table-column>
                <el-table-column
                        prop="intro"
                        label="内容">
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
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
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
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑新增框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="form.intro"></el-input>
                </el-form-item>
                <el-form-item label="路径">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="显示顺序">
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="form.type"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-input v-model="form.iconCode"></el-input>
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
    export default {
        name: "menus",
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
                addParentId: '',
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
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$addr.post("/sys-menu/list", {

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
                const length = this.multipleSelection.length;
                if (length > 1) {
                    this.$alert("只能选择一个父级菜单！");
                    return;
                }
                this.addVisible = true;
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.delList.push(row.id);
                        this.$addr.post("/sys-menu/delete", {
                            ids: this.delList
                        }).then((res) => {
                                this.$message.success('删除成功');
                                this.getData();
                            }
                        );

                    })
                    .catch(() => {});
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
                this.getData();
            },
            addUser() {
                this.addVisible = false;
                const length = this.multipleSelection.length;
                if (length > 0)
                    this.addParentId = this.multipleSelection[0].id;

                this.$addr.post("/sys-menu/add", {
                    parentId: this.addParentId,
                    title: this.form.title,
                    type: this.form.type,
                    iconCode: this.form.iconCode,
                    level: this.form.level,
                    url: this.form.url,
                    intro: this.form.intro
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
            statusFilter() {
                return 'success'
            },
            formatStatus(status) {
                const statusMap = {
                    0: '目录',
                    1: '菜单',
                    2: '按钮'
                }
                return statusMap[status]
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