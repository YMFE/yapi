import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
    fetchInterfaceColList,
    fetchInterfaceCaseList,
    setColData,
    fetchCaseList,
    fetchCaseData,
    queryColAndInterfaceCase
} from '../../../../reducer/modules/interfaceCol';
import { fetchProjectList } from '../../../../reducer/modules/project';
import axios from 'axios';
import ImportInterface from './ImportInterface';
import {
    Input,
    Icon,
    Button,
    Modal,
    message,
    Tooltip,
    Tree,
    Form,
    Select
} from 'antd';
import { arrayChangeIndex } from '../../../../common.js';

const { confirm } = Modal;
const { Option } = Select;

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const headHeight = 240; // menu顶部到网页顶部部分的高度

import './InterfaceColMenu.scss';
// import { replaceWithMeasure } from 'rc-mentions/lib/util';

const ColModalForm = Form.create()((props) => {
    const { visible, onCancel, onCreate, form, title } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal visible={visible} title={title} onCancel={onCancel} onOk={onCreate}>
        <Form layout="vertical">
          <FormItem label="集合名">
            {getFieldDecorator('colName', {
            rules: [{ required: true, message: '请输入集合命名！' }]
          })(<Input />)}
          </FormItem>
          <FormItem label="简介">
            {getFieldDecorator('colDesc')(<Input type="textarea" />)}
          </FormItem>
        </Form>
      </Modal>
    );
});

@connect(
    (state) => {
        return {
            interfaceColList: state.interfaceCol.interfaceColList,
            currCase: state.interfaceCol.currCase,
            isRander: state.interfaceCol.isRander,
            currCaseId: state.interfaceCol.currCaseId,
            // list: state.inter.list,
            // 当前项目的信息
            curProject: state.project.currProject
            // projectList: state.project.projectList
        };
    }, {
        fetchInterfaceColList,
        fetchInterfaceCaseList,
        fetchCaseData,
        // fetchInterfaceListMenu,
        fetchCaseList,
        setColData,
        fetchProjectList,
        queryColAndInterfaceCase
    }
)
@withRouter
export default class InterfaceColMenu extends Component {
    static propTypes = {
        match: PropTypes.object,
        interfaceColList: PropTypes.array,
        fetchInterfaceColList: PropTypes.func,
        fetchInterfaceCaseList: PropTypes.func,
        // fetchInterfaceListMenu: PropTypes.func,
        fetchCaseList: PropTypes.func,
        fetchCaseData: PropTypes.func,
        setColData: PropTypes.func,
        currCaseId: PropTypes.number,
        history: PropTypes.object,
        isRander: PropTypes.bool,
        // list: PropTypes.array,
        router: PropTypes.object,
        currCase: PropTypes.object,
        curProject: PropTypes.object,
        fetchProjectList: PropTypes.func,
        queryColAndInterfaceCase: PropTypes.func

        // projectList: PropTypes.array
    };

    state = {
        colModalType: '',
        colModalVisible: false,
        curColId: -1,
        filter: '',
        importInterVisible: false,
        confirmImportVisble: false,
        importInterIds: [],
        importColId: 0,
        expands: [],
        selects: [],
        checks: [],
        list: [],
        delIcon: null,
        selectedProject: null,
        currentSelectNode: null,
        secondColList: [],
        addToColVisible: false,
        addFirstTargetCol: null,
        addTargetCol: null,
        addType: null
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getList();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.interfaceColList !== nextProps.interfaceColList) {
            this.setState({
                list: nextProps.interfaceColList
            });
        }
    }

    async getList(getChild) {
        let r = await this.props.fetchInterfaceColList(
            this.props.match.params.id,
            this.state.curColId,
            getChild
        );
        // return r;
        if (!getChild) {
            this.setState({
                list: r.payload.data.data
            });
            return r.payload.data.data;
        } else {
            return r.payload.data.data;
        }
    }

    addorEditCol = async () => {
        const { colName: name, colDesc: desc } = this.form.getFieldsValue();
        const { colModalType, curColId: col_id } = this.state;
        const project_id = this.props.match.params.id;
        let res = {};
        if (colModalType === 'add') {
            res = await axios.post('/api/col/add_col', {
                name,
                desc,
                project_id,
                parent_id: col_id
            });
        } else if (colModalType === 'edit') {
            res = await axios.post('/api/col/up_col', { name, desc, col_id });
        }
        if (!res.data.errcode) {
            this.setState({
                colModalVisible: false
            });
            message.success(
                colModalType === 'edit' ? '修改集合成功' : '添加集合成功'
            );
            if (colModalType === 'edit') {
                let currentNode = this.state.currentSelectNode;
                currentNode.name = name;
                currentNode.desc = desc;
                let newList = [...this.state.list];
                let updateNode = (list) => {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].child_type === 0) {
                            if (list[i]._id == col_id) {
                                list[i].name = name;
                                list[i].desc = desc;
                                break;
                            }
                        }
                        if (list[i].children) {
                            updateNode(list[i].children);
                        }
                    }
                };
                updateNode(newList);
                this.setState({
                    currentSelectNode: currentNode,
                    list: [...newList]
                });
            } else {
                this.reloadColMenuList();
            }
        } else {
            message.error(res.data.errmsg);
        }
    };

    onExpand = (keys) => {
        this.setState({ expands: keys });
    };
    onCheck = (keys, e) => {
        if (
            (e.checked === true && e.node.props.child_type === 0) ||
            e.autoClik === true
        ) {
            const checkChildKeys = [];
            this.onLoadData(e.node).then((res) => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].child_type === 0) {
                        let key = 'col_' + res[i]._id;
                        checkChildKeys.push(key);
                        this.onCheck(key, { node: res[i], autoClik: true });
                    } else if (res[i].child_type === 1) {
                        checkChildKeys.push('case_' + res[i]._id);
                    } else {
                        checkChildKeys.push('refer_' + res[i]._id);
                    }
                    this.setState({
                        checks: Array.from(
                            new Set([...this.state.checks, keys, ...checkChildKeys])
                        )
                        // expands:[...this.state.expands, ...keys]
                    });
                }
            });
        } else {
            this.setState({
                checks: keys
            });
        }
    };
    onSelect = (keys, e) => {
        if (keys.length) {
            const type = keys[0].split('_')[0];
            const id = keys[0].split('_')[1];
            const project_id = this.props.match.params.id;
            const curNode = e.selectedNodes[0];
            const colId =
                curNode.props.child_type === 0 ?
                curNode.props._id :
                curNode.props.col_id;
            const curkey = keys[0];


            this.setState({
                currentSelectNode: curNode,
                curColId: colId,
                selects: [curkey]
            });
            if (type === 'col') {
                this.props.setColData({
                    isRander: false
                });
                this.props.history.push(
                    '/project/' + project_id + '/interface/col/' + id
                );
            } else if (type === 'case') {
                this.props.setColData({
                    isRander: false
                });
                this.props.history.push(
                    '/project/' + project_id + '/interface/case/' + id + '?colId=' + colId
                );
            } else {
                this.props.setColData({
                    isRander: false
                });
                this.props.history.push(
                    '/project/' +
                    project_id +
                    '/interface/case/' +
                    id +
                    '?colId=' +
                    colId +
                    '&project_id=' +
                    project_id
                );
            }
        }
    };

    changeExpands = () => {
        this.setState({
            expands: null
        });
    };

    showDelColConfirm = (colId) => {
        let that = this;
        const params = this.props.match.params;
        confirm({
            title: '您确认删除此测试集合',
            content: '温馨提示：该操作会删除该集合下所有测试用例，用例删除后无法恢复',
            okText: '确认',
            cancelText: '取消',
            async onOk() {
                const res = await axios.get('/api/col/del_col?col_id=' + colId);
                if (!res.data.errcode) {
                    message.success('删除集合成功');
                    const nextColId = that.state.list[0]._id;
                    that.reloadColMenuList();
                    //  let newList = [...that.state.list];
                    //  let deleteNode = (list)=>{
                    //    for (let i = 0 ; i < list.length; i ++) {
                    //     if(list[i].child_type === 0) {
                    //       if(list[i]._id == colId) {
                    //         list.splice(i, 1)
                    //         break;
                    //       }
                    //     }
                    //     deleteNode(list[i].children);
                    //   }
                    //  }
                    //  deleteNode(newList);
                    that.props.history.push(
                        '/project/' + params.id + '/interface/col/' + nextColId
                    );
                } else {
                    message.error(res.data.errmsg);
                }
            }
        });
    };

    // 复制测试集合
    copyInterface = async (item) => {
        if (this._copyInterfaceSign === true) {
            return;
        }
        this._copyInterfaceSign = true;
        const { desc, project_id, _id: col_id, parent_id } = item;
        let { name } = item;
        name = `${name} copy`;
        // 添加集合
        const add_col_res = await axios.post('/api/col/add_col', {
            name,
            desc,
            project_id,
            parent_id
        });

        if (add_col_res.data.errcode) {
            message.error(add_col_res.data.errmsg);
            return;
        }

        const new_col_id = add_col_res.data.data._id;

        // 克隆集合
        const add_case_list_res = await axios.post('/api/col/clone_case_list', {
            new_col_id,
            col_id,
            project_id
        });
        this._copyInterfaceSign = false;

        if (add_case_list_res.data.errcode) {
            message.error(add_case_list_res.data.errmsg);
            return;
        }

        this.props.setColData({ isRander: true });
        message.success('克隆测试集成功');
        this.reloadColMenuList();
    };

    reloadColMenuList = () => {
        this.setState({
                curColId: -1,
                list: [],
                selects: [],
                checks: []
            },
            async () => {
                await this.getList();
                let expandIds = this.state.expands.map((item) => {
                    return Number(item.split('_')[1]);
                });
                console.log('expandIds', expandIds);
                let newList = [...this.state.list];
                let updateNode = async (list) => {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].child_type === 0) {
                            if (expandIds.indexOf(list[i]._id) > -1) {
                                await this.onLoadData(list[i]);
                            }
                        }
                        if (list[i].children) {
                            updateNode(list[i].children);
                        }
                    }
                };
                updateNode(newList);
                this.setState({
                    list: [...newList]
                });
            }
        );
    };
    showNoDelColConfirm = () => {
        confirm({
            title: '此测试集合为最后一个集合',
            content: '温馨提示：建议不要删除'
        });
    };
    caseCopy = async (caseId) => {
        let that = this;
        let caseData = await that.props.fetchCaseData(caseId);
        let data = caseData.payload.data.data;
        data = JSON.parse(JSON.stringify(data));
        data.casename = `${data.casename}_copy`;
        delete data._id;
        const res = await axios.post('/api/col/add_case', data);
        if (!res.data.errcode) {
            message.success('克隆用例成功');
            let colId = res.data.data.col_id;
            let projectId = res.data.data.project_id;
            this.props.history.push(
                '/project/' + projectId + '/interface/col/' + colId
            );
            this.setState({
                visible: false
            });
            that.reloadColMenuList();
        } else {
            message.error(res.data.errmsg);
        }
    };
    showDelCaseConfirm = (caseId) => {
        let that = this;
        const params = this.props.match.params;
        confirm({
            title: '您确认删除此测试用例',
            content: '温馨提示：用例删除后无法恢复， 所有该用例的映射也将一并删除',
            okText: '确认',
            cancelText: '取消',
            async onOk() {
                const res = await axios.get('/api/col/del_case?caseid=' + caseId);
                if (!res.data.errcode) {
                    message.success('删除用例成功');
                    that.reloadColMenuList();
                    // 如果删除当前选中 case，切换路由到集合
                    if (+caseId === +that.props.currCaseId) {
                        that.props.history.push(
                            '/project/' + params.id + '/interface/col/'
                        );
                    } else {
                        // that.props.fetchInterfaceColList(that.props.match.params.id);
                        that.props.setColData({ isRander: true });
                    }
                } else {
                    message.error(res.data.errmsg);
                }
            }
        });
    };
    showColModal = (type, col) => {
        const editCol =
            type === 'edit' ? { colName: col.name, colDesc: col.desc } : { colName: '', colDesc: '' };
        this.setState({
            colModalVisible: true,
            colModalType: type || 'add',
            curColId: this.state.curColId
        });
        this.form.setFieldsValue(editCol);
    };
    saveFormRef = (form) => {
        this.form = form;
    };

    selectInterface = (importInterIds, selectedProject) => {
        this.setState({ importInterIds, selectedProject });
    };

    showImportInterfaceModal = async (colId) => {
        // const projectId = this.props.match.params.id;
        // console.log('project', this.props.curProject)
        const groupId = this.props.curProject.group_id;
        await this.props.fetchProjectList(groupId);
        // await this.props.fetchInterfaceListMenu(projectId)
        this.setState({ importInterVisible: true, importColId: colId });
    };

    handleImportOk = async () => {
        const project_id = this.state.selectedProject || this.props.match.params.id;
        const { importColId, importInterIds } = this.state;
        const res = await axios.post('/api/col/add_case_list', {
            interface_list: importInterIds,
            col_id: importColId,
            project_id
        });
        if (!res.data.errcode) {
            // this.setState({ importInterVisible: false , importInterIds: [], selectedProject: null});
            this.setState({ importInterVisible: false });
            message.success('导入集合成功');
            // await this.props.fetchInterfaceColList(project_id);
            // this.getList(true);
            this.reloadColMenuList();
            this.props.setColData({ isRander: true });
        } else {
            message.error(res.data.errmsg);
        }
    };
    handleImportCancel = () => {
        // this.setState({ importInterVisible: false , importInterIds: [], selectedProject: null });
        this.setState({ importInterVisible: false });
    };
    showConfirm = () => {
        let that = this;
        confirm({
            title: '已选中' + this.state.importInterIds.length + '条接口，确认提交吗?',
            content: '只能导入已展开目录下的接口',
            onOk() {
                that.handleImportOk();
            },
            onCancel() {
                that.handleImportCancel();
            }
        });
    };
    filterCol = (e) => {
        const value = e.target.value;
        // console.log('list', this.props.interfaceColList);
        // const newList = produce(this.props.interfaceColList, draftList => {})
        // console.log('newList',newList);
        this.setState({
            filter: value
            // list: JSON.parse(JSON.stringify(this.props.interfaceColList))
            // list: newList
        });
    };
    onDrop = async (e) => {
        // const projectId = this.props.match.params.id;
        const { interfaceColList } = this.props;
        const dropColIndex = e.node.props.pos.split('-')[1];
        const dropColId = interfaceColList[dropColIndex]._id;
        const id = e.dragNode.props.eventKey;
        const dragColIndex = e.dragNode.props.pos.split('-')[1];
        const dragColId = interfaceColList[dragColIndex]._id;

        const dropPos = e.node.props.pos.split('-');
        const dropIndex = Number(dropPos[dropPos.length - 1]);
        const dragPos = e.dragNode.props.pos.split('-');
        const dragIndex = Number(dragPos[dragPos.length - 1]);

        if (id.indexOf('col') === -1) {
            if (dropColId === dragColId) {
                // 同一个测试集合下的接口交换顺序
                let caseList = interfaceColList[dropColIndex].caseList;
                let changes = arrayChangeIndex(caseList, dragIndex, dropIndex);
                axios.post('/api/col/up_case_index', changes).then();
            }
            await axios.post('/api/col/up_case', {
                id: id.split('_')[1],
                col_id: dropColId
            });
            this.reloadColMenuList();
            // this.props.fetchInterfaceColList(projectId);
            // this.getList();
            // this.props.setColData({ isRander: true });
        } else {
            let changes = arrayChangeIndex(interfaceColList, dragIndex, dropIndex);
            axios.post('/api/col/up_col_index', changes).then();
            this.reloadColMenuList();
            // this.getList();
        }
    };

    enterItem = (id) => {
        this.setState({ delIcon: id });
    };

    leaveItem = () => {
        this.setState({ delIcon: null });
    };

    async doInterfaceSearch() {
        if (this.state.filter === '') {
            this.setState({
                curColId: -1
            }, async () => {
                this.reloadColMenuList();
            })
        } else {
            this.setState({
                    list: [],
                    expands: [],
                    selects: []
                },
                async () => {
                    let r = await this.props.queryColAndInterfaceCase({
                        project_id: Number(this.props.match.params.id),
                        query_text: this.state.filter
                    });
                    const data = r.payload.data.data;
                    if (data.length === 0) {
                        message.info('搜索结果为空');
                    }
                    this.setState({
                        list: data
                    });
                }
            );
        }
    }
    // 动态加载子节点数据
    onLoadData = (treeNode) => {
        const id = !treeNode.props ? treeNode._id : treeNode.props._id;
        const catid = !treeNode.props ?
            treeNode.parent_id :
            treeNode.props.parent_id;
        const child_type = !treeNode.props ?
            treeNode.child_type :
            treeNode.props.child_type;
        const getCurCatId = child_type === 0 ? id : catid;
        return new Promise((resolve) => {
            let childrenList = [];
            // setState异步更新
            this.setState({
                    curColId: getCurCatId
                },
                async () => {
                    childrenList = await this.getList(true);
                    console.log('更新孩子----');
                    if (treeNode.props) {
                        treeNode.props.dataRef.children = [...childrenList];
                    } else {
                        treeNode.children = [...childrenList];
                    }
                    this.setState({
                        currentSelectNode: treeNode
                    });
                    resolve(childrenList);
                }
            );
        }).catch((err) => {
            console.log(err.message);
        });
    };

    // 子节点渲染 0 文件夹 1 接口
    renderTreeNodes = (data) => {
        //  const data = props.data;
        return data.map((item) => {
            if (item.child_type === 0) {
                if (item.children && item.children.length > 0) {
                    return (
                      <TreeNode
              key={'col_' + item._id}
              {...item}
              title={this.itemInterfaceColTitle(item)}
              dataRef={item}
              className="interface-item-nav"
            >
                        {this.renderTreeNodes(item.children)}
                      </TreeNode>
                    );
                }
                return (
                  <TreeNode
            checkable={true}
            key={'col_' + item._id}
            {...item}
            title={this.itemInterfaceColTitle(item)}
            dataRef={item}
            className="interface-item-nav"
          />
                );
            } else if (item.child_type === 1) {
                return (
                  <TreeNode
            checkable={true}
            key={'case_' + item._id}
            {...item}
            title={this.itemInterfaceCreateTitle(item)}
            dataRef={item}
            isLeaf={true}
          />
                );
            } else {
                return (
                  <TreeNode
            checkable={true}
            selectable={true}
            key={'refer_' + item.refer_caseid + '_' + item._id}
            {...item}
            title={this.itemInterfaceReferTitle(item)}
            dataRef={item}
            isLeaf={true}
          />
                );
            }
        });
    };
    reloadCurChildList = () => {
        // 把当前需要更新且已经加载的目录从已加载目录中删除,解决目录已经打开不会重新onload
        if (this.state.curColId !== -1) {
            const curParentKey = 'col_' + this.state.currentSelectNode.parent_id;
            let arr = this.state.expands ? this.state.expands.slice(0) : [];
            const newLoadKeys = arr.splice(arr.indexOf(curParentKey), 1);
            this.onLoadData(this.state.currentSelectNode);
            this.setState({
                expands: [
                    ...this.state.expands,
                    this.state.currentSelectNode.key,
                    curParentKey,
                    newLoadKeys
                ]
            });
        } else {
            this.changeExpands();
            this.getList();
        }
    };
    handleSecondColChange = (e) => {
        this.setState({
            addTargetCol: e
        });
        // console.log("handleSecondColChange", e);
        // this.setState({
        //   curColId: e
        // }, ()=> {
        //   const result = this.getList(true).payload.data.data;
        //   if (result && result.length > 0) {
        //     this.setState({
        //       secondColList: [...this.state.secondColList, ...result],
        //     })
        //     result.forEach(item => {
        //       this.handleFirstColChange(item);
        //     })
        //  }
        // })
    };
    handleFirstColChange = (e, option, setState = true) => {
        this.setState({
                curColId: e
            },
            async () => {
                const result = await this.getList(true);
                const oldSecondlist = this.state.secondColList;
                let newSecondlist = [];
                const colResult = result.filter((item) => item.child_type === 0);
                let flag = false;
                if (colResult && colResult.length > 0) {
                    newSecondlist = [...oldSecondlist, ...colResult];
                    colResult.forEach((item) => {
                        this.handleFirstColChange(item._id, undefined, false);
                    });
                    if (setState === true) {
                        flag = true;
                        this.setState({
                            addFirstTargetCol: e,
                            secondColList: [
                                { _id: e, name: '不选择，默认添加到一级目录' },
                                ...newSecondlist
                            ]
                        });
                    } else {
                        this.setState({
                            // addFirstTargetCol: e,
                            secondColList: [...newSecondlist]
                        });
                    }
                } else if (setState === true && !flag) {
                    flag = true;
                    this.setState({
                        addFirstTargetCol: e,
                        addTargetCol: e,
                        secondColList: [{ _id: e, name: '无子目录，默认添加到一级目录' }]
                    });
                }
            }
        );
    };
    handleToColCancel = () => {
        this.setState({
            addToColVisible: false,
            addFirstTargetCol: null,
            addTargetCol: null
        });
    };
    showAddToColConfirm = async () => {
        console.log('checks', this.state.checks);
        const caseChecks = this.state.checks.filter(
            (item) => item.indexOf('case') > -1
        );
        if (
            this.state.addFirstTargetCol === null ||
            this.state.addTargetCol === null
        ) {
            message.info('请选择目标测试集');
            return;
        }

        if (this.state.addType === 0) {
            caseChecks.forEach(async (key, index) => {
                let caseId = key.split('_')[1];
                let that = this;
                let caseData = await that.props.fetchCaseData(caseId);
                let data = caseData.payload.data.data;
                data.col_id = this.state.addTargetCol;
                data = JSON.parse(JSON.stringify(data));
                data.casename = `${data.casename}_copy`;
                delete data._id;
                const res = await axios.post('/api/col/add_case', data);
                console.log('index', index);
                if (!res.data.errcode && caseChecks.length === index + 1) {
                    message.success('添加用例成功');
                    // let colId = res.data.data.col_id;
                    // let projectId=res.data.data.project_id;
                    // this.props.history.push('/project/' + projectId + '/interface/col/' + colId);
                    that.handleToColCancel();
                    that.reloadColMenuList();
                } else if (res.data.errcode) {
                    message.error(res.data.errmsg);
                }
            });
        } else {
            let caseList = [];
            caseChecks.forEach(async (key) => {
                let caseId = key.split('_')[1];
                caseList.push(caseId);
            });
            const data = {};
            data.col_id = Number(this.state.addTargetCol);
            data.case_list = caseList;
            data.project_id = Number(this.props.match.params.id);
            const res = await axios.post('/api/col/addRefer', data);
            if (!res.data.errcode) {
                message.success('添加映射成功');
                // let colId = res.data.data.col_id;
                // let projectId=res.data.data.project_id;
                // this.props.history.push('/project/' + projectId + '/interface/col/' + colId);
                this.handleToColCancel();
                this.reloadColMenuList();
            } else if (res.data.errcode) {
                message.error(res.data.errmsg);
            }
        }
    };
    async doSearchAllReference() {
        const caseChecks = this.state.checks.filter(
            (item) => item.indexOf('case') > -1
        );
        if (caseChecks.length == 0) {
            message.info('请先勾选需要查看映射的用例');
            return;
        } else if (caseChecks.length > 1) {
            message.info('最多勾选一个用例');
            return;
        }
        let data = {};
        data.case_id = Number(caseChecks[0].split('_')[1]);
        data.project_id = Number(this.props.match.params.id);
        // await this.reloadColMenuList();
        this.setState({
            curColId: -1,
            list: [],
            selects: [],
            checks: []
        }, async () => {
            const res = await axios.post('/api/col/referColListByCase', data);
            if (!res.data.errcode) {
                if (res.data.data.length === 0) {
                    message.info('没有该用例的映射');
                } else {
                    const showColList = res.data.data;
                    showColList.forEach((item) => {
                        item._id = item.col_id;
                    });

                    this.setState({
                        list: showColList
                    });
                    let expandIds = this.state.expands.map((item) => {
                        return Number(item.split('_')[1]);
                    });
                    let newList = [...this.state.list];
                    let updateNode = async (list) => {
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].child_type === 0) {
                                if (expandIds.indexOf(list[i]._id) > -1) {
                                    await this.onLoadData(list[i]);
                                }
                            }
                            if (list[i].children) {
                                updateNode(list[i].children);
                            }
                        }
                    };
                    updateNode(newList);
                    this.setState({
                        list: [...newList]
                    });
                }
            } else {
                message.error(res.data.errmsg);
            }
        });
    }
    async deleteAllRefer() {
        const caseChecks = this.state.checks
            .filter((item) => item.indexOf('case') > -1)
            .map((item) => {
                return Number(item.split('_')[1]);
            });
        let that = this;
        confirm({
            title: '确定解除所选测试用例的所有映射吗?',
            content: '',
            async onOk() {
                const res = await axios.post('/api/col/deleteAllReferCase', {
                    refer_caseid_list: caseChecks
                });
                if (!res.data.errcode) {
                    message.success('成功解除映射' + res.data.data.n + '条');
                    that.reloadColMenuList();
                } else {
                    message.error(res.data.errmsg);
                }
            },
            onCancel() {}
        });
    }
    async deleteAllSingleRefer() {
        let that = this;
        const caseChecks = this.state.checks.filter(
            (item) => item.indexOf('refer') > -1
        );
        if (caseChecks.length == 0) {
            message.info('请先勾选需要删除的映射');
            return;
        }
        confirm({
            title: '确定删除勾选的' + caseChecks.length + '条映射吗?',
            content: '',
            async onOk() {
                caseChecks.forEach(async (item, index) => {
                    const id = Number(item.split('_')[2]);
                    const res = await axios.post('/api/col/deleteReferCaseById', { id });
                    if (!res.data.errcode && index === caseChecks.length - 1) {
                        message.success('成功解除映射!');
                        that.reloadColMenuList();
                    } else if (res.data.errcode) {
                        message.error(res.data.errmsg);
                    }
                })
            },
            onCancel() {}
        });
    }
    async deleteOneRefer(id) {
        let that = this;
        confirm({
            title: '确定解除该条映射吗?',
            content: '',
            async onOk() {
                const res = await axios.post('/api/col/deleteReferCaseById', { id });
                if (!res.data.errcode) {
                    message.success('成功解除映射!');
                    that.reloadColMenuList();
                } else {
                    message.error(res.data.errmsg);
                }
            },
            onCancel() {}
        });
    }
    itemInterfaceColTitle(col) {
        return (
          <div
        className="menu-title"
        onMouseEnter={() => {
          this.enterItem('col_' + col._id);
        }}
        onMouseLeave={this.leaveItem}
        // onClick={(e) => {
        // }}
      >
            <span>
              <Icon type="folder-open" style={{ marginRight: 5 }} />
              <span>{col.name}</span>
            </span>
            <div className="btns">
              <Tooltip title="删除集合">
                <Icon
              type="delete"
              // style={{ display: list.length > 1 ? '' : 'none' }}
              className="interface-delete-icon"
              style={{
                display:
                  this.state.delIcon == 'col_' + col._id ? 'block' : 'none'
              }}
              onClick={() => {
                this.showDelColConfirm(col._id);
                this.setState({
                  curColId: Number(col._id),
                  currentSelectNode: col
                });
              }}
            />
              </Tooltip>
              <Tooltip title="修改集合">
                <Icon
              type="edit"
              className="interface-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                this.showColModal('edit', col);
                this.setState({
                  curColId: Number(col._id),
                  currentSelectNode: col
                });
              }}
            />
              </Tooltip>
              <Tooltip title="导入接口">
                <Icon
              type="plus"
              className="interface-delete-icon"
              style={{
                display:
                  this.state.delIcon == 'col_' + col._id ? 'block' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                this.showImportInterfaceModal(col._id);
                this.setState({
                  curColId: Number(col._id),
                  currentSelectNode: col
                });
              }}
            />
              </Tooltip>
              <Tooltip title="克隆集合">
                <Icon
              type="copy"
              className="interface-delete-icon"
              style={{
                display:
                  this.state.delIcon == 'col_' + col._id ? 'block' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                this.setState({
                  curColId: Number(col._id),
                  currentSelectNode: col
                });
                this.copyInterface(col);
              }}
            />
              </Tooltip>
            </div>
            {/*<Dropdown overlay={menu(col)} trigger={['click']} onClick={e => e.stopPropagation()}>
        <Icon className="opts-icon" type='ellipsis'/>
      </Dropdown>*/}
          </div>
        );
    }
itemInterfaceCreateTitle(interfaceCase) {
  function StarComponent(props) {
    if (props.isShow===1) {
      return (
        <Tooltip  title="此用例已被映射测试集引用">
          <Icon
            type="star"
            theme="filled"
            className="refer-star"
          />
        </Tooltip>
      )
    }else {
      return ''
    }
  } 
    return (
      <div
        className="menu-title"
        onMouseEnter={() => this.enterItem(interfaceCase._id)}
        onMouseLeave={this.leaveItem}
        title={interfaceCase.casename}
      >
        <span className="casename"><StarComponent isShow={interfaceCase.is_refered} />{interfaceCase.casename}</span>
        <div className="btns">
          <Tooltip title="删除用例">
            <Icon
                    type="delete"
                    className="interface-delete-icon"
                    onClick={(e) => {
                    e.stopPropagation();
                      this.showDelCaseConfirm(interfaceCase._id);
                    }}
                    style={{
                      display:
                        this.state.delIcon == interfaceCase._id ? 'block' : 'none'
                    }}
                />
          </Tooltip>
          <Tooltip title="克隆用例">
            <Icon
                  type="copy"
                  className="interface-delete-icon"
                  onClick={(e) => {
                   e.stopPropagation();
                    this.caseCopy(interfaceCase._id);
                  }}
                  style={{
                    display:this.state.delIcon == interfaceCase._id ? 'block' : 'none'
                  }}
                />
          </Tooltip>
        </div>
      </div>);
}
    itemInterfaceReferTitle(interfaceCaseRefer) {
        return (
          <div
            className="menu-title"
            title={interfaceCaseRefer.casename}
          >
            <span className="casename">
              <Tooltip title="映射用例">
                <Icon
                      type="star"
                      theme="filled"
                      className="refer-star-gray"
                    />
              </Tooltip>
              {interfaceCaseRefer.casename}
              <div className="btns">
                <Tooltip title="点击删除映射">
                  <Icon
                    type="delete"
                    className="interface-delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.deleteOneRefer(interfaceCaseRefer._id);
                    }}
                  />
                </Tooltip>
              </div>
            </span>
          </div>
        );
    }
    render() {
        // const { currColId, currCaseId, isShowCol } = this.props;
        // const matchParams = this.props.match.params;
        const {
            colModalType,
            colModalVisible,
            importInterVisible,
            addToColVisible
        } = this.state;
        const currProjectId = this.props.match.params.id;
        // const menu = (col) => {
        //   return (
        //     <Menu>
        //       <Menu.Item>
        //         <span onClick={() => this.showColModal('edit', col)}>修改集合</span>
        //       </Menu.Item>
        //       <Menu.Item>
        //         <span onClick={() => {
        //           this.showDelColConfirm(col._id)
        //         }}>删除集合</span>
        //       </Menu.Item>
        //       <Menu.Item>
        //         <span onClick={() => this.showImportInterface(col._id)}>导入接口</span>
        //       </Menu.Item>
        //     </Menu>
        //   )
        // };

        const defaultExpandedKeys = () => {
            const { router, currCase, interfaceColList } = this.props,
                rNull = { expands: [], selects: [] };
            if (interfaceColList && interfaceColList.length === 0) {
                return rNull;
            }
            if (router) {
                if (router.params.action === 'case') {
                    if (!currCase || !currCase._id) {
                        // return rNull;
                        return {
                            expands: this.state.expands ?
                                this.state.expands : ['col_' + currCase.col_id]
                        };
                    }
                    return {
                        expands: this.state.expands ?
                            this.state.expands : ['col_' + currCase.col_id],
                        selects: this.state.selects ?
                            this.state.selects : ['case_' + currCase._id + '']
                    };
                } else {
                    let col_id = router.params.actionId;
                    return {
                        expands: this.state.expands ?
                            this.state.expands : ['col_' + col_id],
                        selects: this.state.selects ? this.state.selects : []
                    };
                }
            } else {
                if (this.state.curColId === -1) {
                    return {
                        selects: [],
                        expands: []
                    };
                } else {
                    return {
                        expands: this.state.expands ?
                            this.state.expands : ['col_' + interfaceColList[0]._id],
                        selects: []
                    };
                }
            }
        };

        let currentKes = defaultExpandedKeys();

        let list = this.state.list;

        return (
          <div>
            <div className="interface-filter">
              <Input
            placeholder="搜索测试集合"
            onChange={this.filterCol}
            value={this.state.filter}
          />
              <Tooltip placement="bottom" title="搜索测试集合">
                <Button
              type="primary"
              onClick={() => {
                this.doInterfaceSearch();
              }}
              className="btn-filter interface-search-bt"
            >
              搜索
                </Button>
              </Tooltip>
              <Tooltip placement="bottom" title="添加集合">
                <Button
              type="primary"
              style={{ marginLeft: '16px' }}
              onClick={() => {
                // 选中目录才可以添加
                if (this.state.selects.length === 0) {
                  const that = this;
                  confirm({
                    title: '添加集合',
                    content:
                      '当前鼠标未点击选中文件夹，新的集合将默认添加到一级目录',
                    okText: '确认',
                    cancelText: '取消',
                    async onOk() {
                      that.setState(
                        {
                          curColId: -1
                        },
                        () => {
                          that.showColModal(
                            'add',
                            that.state.currentSelectNode
                          );
                        }
                      );
                    }
                  });
                } else if (
                  this.state.currentSelectNode &&
                  this.state.currentSelectNode.props &&
                  this.state.currentSelectNode.props.child_type === 1
                ) {
                  message.error('测试用例不可再添加集合');
                } else if (
                  this.state.currentSelectNode &&
                  this.state.currentSelectNode.props &&
                  this.state.currentSelectNode.props.child_type === 2
                ) {
                  message.error('映射不可再添加集合');
                } else if (this.state.selects.length === 0) {
                  message.error('选中文件夹再添加集合');
                } else {
                  this.showColModal('add', this.state.currentSelectNode);
                }
              }}
              className="btn-filter"
            >
              添加集合
                </Button>
              </Tooltip>
            </div>
            <div className="interface-operation">
              <Tooltip title="添加到测试集">
                <Icon
              type="plus-square"
              className="operation-icon"
              onClick={(e) => {
                e.stopPropagation();
                const caseChecks = this.state.checks.filter(
                  (item) => item.indexOf('case') > -1
                );
                if (caseChecks.length == 0) {
                  message.info('请先勾选需要添加的接口');
                  return;
                }
                this.setState({
                  addToColVisible: true,
                  secondColList: [],
                  addTargetCol: '',
                  addType: 0
                });
                // this.showDelCaseConfirm(interfaceCase._id);
              }}
            />
              </Tooltip>
              <Tooltip title="批量添加映射">
                <Icon
              type="interaction"
              className="operation-icon"
              onClick={(e) => {
                e.stopPropagation();
                const caseChecks = this.state.checks.filter(
                  (item) => item.indexOf('case') > -1
                );
                if (caseChecks.length == 0) {
                  message.info('请先勾选需要添加的接口');
                  return;
                }
                // else if(caseChecks.length > 1) {
                //   message.info("每次最多只能添加一条映射");
                // }
                this.setState({
                  addToColVisible: true,
                  secondColList: [],
                  addTargetCol: '',
                  addType: 1
                });
                // this.showDelCaseConfirm(interfaceCase._id);
              }}
            />
              </Tooltip>
              <Tooltip title="删除勾选的映射用例">
                <Icon
              type="disconnect"
              className="operation-icon"
              onClick={(e) => {
                e.stopPropagation();
                const caseChecks = this.state.checks.filter(
                  (item) => item.indexOf('refer') > -1
                );
                if (caseChecks.length == 0) {
                  message.info('请先勾选需要删除的映射');
                  return;
                }
                //  else if (caseChecks.length > 1) {
                //   message.info('每次最多只能选择一个接口');
                //   return;
                // }
                this.deleteAllSingleRefer();
              }}

            />
              </Tooltip>
              <Tooltip title="删除接口的所有映射用例">
                <Icon
              type="star"
              className="operation-icon"
              onClick={(e) => {
                e.stopPropagation();
                const caseChecks = this.state.checks.filter(
                  (item) => item.indexOf('case') > -1
                );
                if (caseChecks.length == 0) {
                  message.info('请先勾选需要解除映射的用例');
                  return;
                }
                //  else if (caseChecks.length > 1) {
                //   message.info('每次最多只能选择一个接口');
                //   return;
                // }
                this.deleteAllRefer();
              }}
            />
              </Tooltip>
              <Tooltip title="查看所有映射">
                <Icon
              type="eye"
              className="operation-icon"
              onClick={(e) => {
                e.stopPropagation();
                this.doSearchAllReference();
              }}
            />
              </Tooltip>
            </div>
            <div
          className="tree-wrapper"
          style={{
            maxHeight: parseInt(document.body.clientHeight) - headHeight + 'px'
          }}
        >
              <Tree
            checkable={true}
            className="col-list-tree"
            loadData={this.onLoadData}
            defaultExpandedKeys={currentKes.expands}
            defaultSelectedKeys={currentKes.selects}
            expandedKeys={currentKes.expands}
            selectedKeys={currentKes.selects}
            onSelect={this.onSelect}
            onCheck={this.onCheck}
            // checkedKeys={this.state.checks}
            autoExpandParent={false}
            draggable={true}
            onExpand={this.onExpand}
            onDrop={this.onDrop}
            expandAction={'doubleClick'}
          >
                {/* {list.map(col => (
              <TreeNode
                key={'col_' + col._id}
                title={
                  
                }
              >
                {col.caseList.map(itemInterfaceColCreate)}
              </TreeNode>
            ))} */}
                {/* <TreeNode
                className="item-all-interface"
                isLeaf={true}
                title={
                  <Link
                    onClick={(e)=> {
                      e.stopPropagation();
                      this.setState({
                        curCatid: Number(-1)
                      });
                    }}
                    to={'/project/' + matchParams.id + '/interface/case'}
                  >
                    <Icon type="folder" style={{ marginRight: 5 }} />
                    全部测试用例
                  </Link>
                }
                key="root"
              /> */}
                {this.renderTreeNodes(list)}
              </Tree>
            </div>
            <ColModalForm
          ref={this.saveFormRef}
          type={colModalType}
          visible={colModalVisible}
          onCancel={() => {
            this.setState({ colModalVisible: false });
          }}
          onCreate={this.addorEditCol}
        />

            <Modal
          title="导入接口到集合"
          visible={importInterVisible}
          onOk={this.showConfirm}
          onCancel={this.handleImportCancel}
          className="import-case-modal"
          widthth={800}
        >
              <ImportInterface
            currProjectId={currProjectId}
            selectInterface={this.selectInterface}
          />
            </Modal>

            <Modal
          title="选择添加到的测试集"
          visible={addToColVisible}
          onOk={this.showAddToColConfirm}
          onCancel={this.handleToColCancel}
          className="import-case-modal"
          width={800}
        >
              <div>
                <div>
                  <p className={'select-title'}>选择一级目录</p>
                  <p className={'select-title'}>选择子目录</p>
                </div>
                <Select
              // defaultValue={0}
              style={{ width: 250 }}
              value={this.state.addFirstTargetCol}
              onChange={this.handleFirstColChange}
            >
                  {this.state.list.map((item) => (
                    <Option key={item._id}>{item.name}</Option>
              ))}
                </Select>
                <Select
              style={{ width: 250 }}
              value={this.state.addTargetCol}
              onChange={this.handleSecondColChange}
            >
                  {this.state.secondColList.map((item) => (
                    <Option key={item._id}>{item.name}</Option>
              ))}
                </Select>
              </div>
            </Modal>
          </div>
        );
    }
}