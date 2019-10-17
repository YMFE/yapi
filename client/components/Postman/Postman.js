import React, {PureComponent as Component} from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  Icon,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
  Tabs,
  Tooltip
} from 'antd';
import constants from '../../constants/variable.js';
import AceEditor from 'client/components/AceEditor/AceEditor';
import _ from 'underscore';
import {deepCopyJson, isJson, json5_parse} from '../../common.js';
import axios from 'axios';
import ModalPostman from '../ModalPostman/index.js';
import './Postman.scss';
import ProjectEnv from '../../containers/Project/Setting/ProjectEnv/index.js';
import json5 from 'json5';


const FormItem = Form.Item;
const { handleParamsValue, ArrayToObject, schemaValidator } = require('common/utils.js');
const {
  handleParams,
  checkRequestBodyIsRaw,
  handleContentType,
  crossRequest,
  checkNameIsExistInArray
} = require('common/postmanLib.js');
const createContext = require('common/createContext')

const HTTP_METHOD = constants.HTTP_METHOD;
const InputGroup = Input.Group;
const Option = Select.Option;
const Panel = Collapse.Panel;

export const InsertCodeMap = [
  {
    code: 'storage.getItem()',
    title: '从storage取值'
  },
  {
    code: 'assert.equal(status, 200)',
    title: '断言 httpCode 等于 200'
  },
  {
    code: 'assert.equal(body.code, 0)',
    title: '断言返回数据 code 是 0'
  },
  {
    code: 'assert.notEqual(status, 404)',
    title: '断言 httpCode 不是 404'
  },
  {
    code: 'assert.notEqual(body.code, 40000)',
    title: '断言返回数据 code 不是 40000'
  },
  {
    code: 'assert.deepEqual(body, {"code": 0})',
    title: '断言对象 body 等于 {"code": 0}'
  },
  {
    code: 'assert.notDeepEqual(body, {"code": 0})',
    title: '断言对象 body 不等于 {"code": 0}'
  },
 {
  code: 'utils.',
    title: '使用utils工具函数'
  }
];

const ParamsNameComponent = props => {
  const { example, desc, name } = props;
  const isNull = !example && !desc;
  const TooltipTitle = () => {
    return (
      <div>
        {example && (
          <div>
            示例：点击可在示例值/用例值间切换
            <div><span className="table-desc">{example}</span></div>
          </div>
        )}
        {desc && (
          <div>
            备注： <span className="table-desc">{desc}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {isNull ? (
        <Input disabled value={name} className="key" />
      ) : (
        <Tooltip placement="topLeft" title={<TooltipTitle />}>
          <Input disabled value={name} className="key" />
        </Tooltip>
      )}
    </div>
  );
};
ParamsNameComponent.propTypes = {
  example: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  desc: PropTypes.string,
  name: PropTypes.string
};

export default class Run extends Component {
  static propTypes = {
    data: PropTypes.object, //接口原有数据
    save: PropTypes.func, //保存回调方法
    type: PropTypes.string, //enum[case, inter], 判断是在接口页面使用还是在测试集
    projectToken:PropTypes.string,
    curUid: PropTypes.number.isRequired,
    interfaceId: PropTypes.number.isRequired,
    projectId: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      resStatusCode: null,
      test_valid_msg: null,
      test_script_msg: null,
      resStatusText: '',
      case_env: '',
      mock_verify: false,
      enable_script: false,
      test_script: '',
      case_pre_script: '',
      case_post_script: '',
      hasPlugin: true,
      inputValue: '',
      cursurPosition: { row: 1, column: -1 },
      envModalVisible: false,
      test_res_header: null,
      test_res_body: null,
      ...this.props.data
    };
  }

  checkInterfaceData(data) {
    if (!data || typeof data !== 'object' || !data._id) {
      return false;
    }
    return true;
  }

  // 整合header信息
  handleReqHeader = (value, env) => {
    let index = value
      ? env.findIndex(item => {
          return item.name === value;
        })
      : 0;
    index = index === -1 ? 0 : index;

    let req_header = [].concat(this.props.data.req_headers || []);
    let header = [].concat(env[index].header || []);
    header.forEach(item => {
      if (!checkNameIsExistInArray(item.name, req_header)) {
        item = {
          ...item,
          abled: true
        };
        req_header.push(item);
      }
    });
    req_header = req_header.filter(item => {
      return item && typeof item === 'object';
    });
    return req_header;
  };

  selectDomain = value => {
    let headers = this.handleReqHeader(value, this.state.env);
    this.setState({
      case_env: value,
      req_headers: headers
    });
  };

  async initState(data) {
    if (!this.checkInterfaceData(data)) {
      return null;
    }
    const { req_body_other, req_body_type, req_body_is_json_schema ,case_post_script,case_pre_script} = data;
    let body = req_body_other;
    // 运行时才会进行转换
    if (
      this.props.type === 'inter' &&
      req_body_type === 'json' &&
      req_body_other &&
      req_body_is_json_schema
    ) {
      let schema = {};
      try {
        schema = json5.parse(req_body_other);
      } catch (e) {
        console.log('e', e);
        return;
      }
      let result = await axios.post('/api/interface/schema2json', {
        schema: schema,
        required: true
      });

      body = JSON.stringify(result.data);
    }

    data.case_pre_script= typeof case_pre_script === "undefined"?'':case_pre_script;
    data.case_post_script= typeof case_post_script === "undefined"?'':case_post_script;

    this.setState(
      {
        ...this.state,
        test_res_header: null,
        test_res_body: null,
        ...data,
        req_body_other: body,
        resStatusCode: null,
        test_valid_msg: null,
        test_script_msg:null,
        resStatusText: ''
      },
      () => this.props.type === 'inter' && this.initEnvState(data.case_env, data.env)
    );
  }

  initEnvState(case_env, env) {
    let headers = this.handleReqHeader(case_env, env);

    this.setState(
      {
        req_headers: headers,
        env: env
      },
      () => {
        let s = !_.find(env, item => item.name === this.state.case_env);
        if (!this.state.case_env || s) {
          this.setState({
            case_env: this.state.env[0].name
          });
        }
      }
    );
  }

   componentWillMount() {

    this.initState(this.props.data);

  }


  componentWillReceiveProps(nextProps) {
    if (this.checkInterfaceData(nextProps.data) && this.checkInterfaceData(this.props.data)) {
      if (nextProps.data._id !== this.props.data._id) {
        this.initState(nextProps.data);
      } else if (nextProps.data.interface_up_time !== this.props.data.interface_up_time) {
        this.initState(nextProps.data);
      }
      if (nextProps.data.env !== this.props.data.env) {
        this.initEnvState(this.state.case_env, nextProps.data.env);
      }
    }
  }

  handleValue(val, global) {
    let globalValue = ArrayToObject(global);
    return handleParamsValue(val, {
      global: globalValue
    });
  }

  onOpenTest = d => {
    this.setState({
      test_script: d.text
    });
  };


  handleInsertCode = code => {
    this.aceEditor.editor.insertCode(code);
  };

  handleRequestBody = d => {
    this.setState({
      req_body_other: d.text
    });
  };

  reqRealInterface = async () => {
    const {pre_script,after_script,case_pre_script,case_post_script}=this.state;
    if (this.state.loading === true) {
      this.setState({
        loading: false
      });
      return null;
    }
    this.setState({
      loading: true
    });

    let options = handleParams(this.state, this.handleValue),
      result;

    try {
      options.taskId = this.props.curUid;
      result = await crossRequest(options, pre_script, after_script,case_pre_script,case_post_script, createContext(
        this.props.curUid,
        this.props.projectId,
        this.props.interfaceId
      ));
      result = {
        header: result.res.header,
        body: result.res.body,
        status: result.res.status,
        statusText: result.res.statusText,
        runTime: result.runTime
      };
    } catch (data) {
      result = {
        header: data.header,
        body: data.body,
        status: null,
        statusText: data.message
      };
    }
    if (this.state.loading === true) {
      this.setState({
        loading: false
      });
    } else {
      return null;
    }

    let tempJson = result.body;
    if (tempJson && typeof tempJson === 'object') {
      result.body = JSON.stringify(tempJson, null, '  ');
      this.setState({
        res_body_type: 'json'
      });
    } else if (isJson(result.body)) {
      this.setState({
        res_body_type: 'json'
      });
    }

    // 对 返回值数据结构 和定义的 返回数据结构 进行 格式校验
    let validResult = this.resBodyValidator(this.props.data, result.body);
    if (!validResult.valid) {
      this.setState({ test_valid_msg: `返回参数 ${validResult.message}` });
    } else {
      this.setState({ test_valid_msg: '' });
    }

    this.setState({
      resStatusCode: result.status,
      resStatusText: result.statusText,
      test_res_header: result.header,
      test_res_body: result.body
    });
  };

  // reqRealInterfaceinserver = async () => {
  //   const {pre_script,after_script}=this.state;
  //
  //   let curitem = Object.assign(
  //     {},
  //     {caseitme:this.state},
  //     {
  //       pre_script: pre_script,
  //       after_script: after_script
  //     },
  //     {
  //       token: this.props.projectToken,
  //       taskId: this.props.curUid
  //     }
  //   );
  //
  //   curitem.caseitme.taskId = this.props.curUid;
  //     console.log({"用例请求数据":curitem});
  //    let result = await axios.post('/api/open/run_case', {params:curitem});
  //     result=result.data.data;
  //
  //   console.log({"用例执行结果数据":result});
  //
  //   if (this.state.loading === true) {
  //     this.setState({
  //       loading: false
  //     });
  //     return null;
  //   }
  //   this.setState({
  //     loading: true
  //   });
  //
  //
  //
  //   if (this.state.loading === true) {
  //     this.setState({
  //       loading: false
  //     });
  //   } else {
  //     return null;
  //   }
  //
  //   let tempJson = result.res_body;
  //   if (tempJson && typeof tempJson === 'object') {
  //     result.res_body = JSON.stringify(tempJson, null, '  ');
  //     this.setState({
  //       res_body_type: 'json'
  //     });
  //   } else if (isJson(result.res_body)) {
  //     this.setState({
  //       res_body_type: 'json'
  //     });
  //   }
  //
  //   // 对 返回值数据结构 和定义的 返回数据结构 进行 格式校验
  //   let validResult = this.resBodyValidator(this.props.data, result.res_body);
  //   if (!validResult.valid) {
  //     this.setState({ test_valid_msg: `返回参数 ${validResult.message}` });
  //   } else {
  //     this.setState({ test_valid_msg: '' });
  //   }
  //
  //   let validRes=result.validRes;
  //   if (validRes.length>1) {
  //     this.setState({ test_script_msg: JSON.stringify(validRes,null,2) });
  //   } else {
  //     this.setState({ test_script_msg: '' });
  //   }
  //
  //   this.setState({
  //     resStatusCode: result.status,
  //     resStatusText: result.statusText,
  //     test_res_header: result.res_header,
  //     test_res_body: result.res_body
  //   });
  // };



  // 返回数据与定义数据的比较判断
  resBodyValidator = (interfaceData, test_res_body) => {
    const { res_body_type, res_body_is_json_schema, res_body } = interfaceData;
    let validResult = { valid: true };

    if (res_body_type === 'json' && res_body_is_json_schema) {
      const schema = json5_parse(res_body);
      const params = json5_parse(test_res_body);
      validResult = schemaValidator(schema, params);
    }

    return validResult;
  };


  // 模态框的相关操作
  showModal = (val, index, type) => {
    let inputValue = '';
    let cursurPosition;
    if (type === 'req_body_other') {
      // req_body
      let editor = this.aceEditor.editor.editor;
      cursurPosition = editor.session.doc.positionToIndex(editor.selection.getCursor());
      // 获取选中的数据
      inputValue = this.getInstallValue(val || '', cursurPosition).val;
    } else {
      // 其他input 输入
      let oTxt1 = document.getElementById(`${type}_${index}`);
      cursurPosition = oTxt1.selectionStart;
      inputValue = this.getInstallValue(val || '', cursurPosition).val;
      // cursurPosition = {row: 1, column: position}
    }

    this.setState({
      modalVisible: true,
      inputIndex: index,
      inputValue,
      cursurPosition,
      modalType: type
    });
  };

  // 点击插入
  handleModalOk = val => {
    const { inputIndex, modalType } = this.state;
    if (modalType === 'req_body_other') {
      this.changeInstallBody(modalType, val);
    } else {
      this.changeInstallParam(modalType, val, inputIndex);
    }

    this.setState({ modalVisible: false });
  };

  // 根据鼠标位置往req_body中动态插入数据
  changeInstallBody = (type, value) => {
    const pathParam = deepCopyJson(this.state[type]);
    // console.log(pathParam)
    let oldValue = pathParam || '';
    let newValue = this.getInstallValue(oldValue, this.state.cursurPosition);
    let left = newValue.left;
    let right = newValue.right;
    this.setState({
      [type]: `${left}${value}${right}`
    });
  };

  // 获取截取的字符串
  getInstallValue = (oldValue, cursurPosition) => {
    let left = oldValue.substr(0, cursurPosition);
    let right = oldValue.substr(cursurPosition);

    let leftPostion = left.lastIndexOf('{{');
    let leftPostion2 = left.lastIndexOf('}}');
    let rightPostion = right.indexOf('}}');
    // console.log(leftPostion, leftPostion2,rightPostion, rightPostion2);
    let val = '';
    // 需要切除原来的变量
    if (leftPostion !== -1 && rightPostion !== -1 && leftPostion > leftPostion2) {
      left = left.substr(0, leftPostion);
      right = right.substr(rightPostion + 2);
      val = oldValue.substring(leftPostion, cursurPosition + rightPostion + 2);
    }
    return {
      left,
      right,
      val
    };
  };

  // 根据鼠标位置动态插入数据
  changeInstallParam = (name, v, index, key) => {
    key = key || 'value';
    const pathParam = deepCopyJson(this.state[name]);
    let oldValue = pathParam[index][key] || '';
    let newValue = this.getInstallValue(oldValue, this.state.cursurPosition);
    let left = newValue.left;
    let right = newValue.right;
    pathParam[index][key] = `${left}${v}${right}`;
    this.setState({
      [name]: pathParam
    });
  };

  // 取消参数插入
  handleModalCancel = () => {
    this.setState({ modalVisible: false, cursurPosition: -1 });
  };

  // 环境变量模态框相关操作
  showEnvModal = () => {
    this.setState({
      envModalVisible: true
    });
  };

  handleEnvOk = (newEnv, index) => {
    this.setState({
      envModalVisible: false,
      case_env: newEnv[index].name
    });
  };

  handleEnvCancel = () => {
    this.setState({
      envModalVisible: false
    });
  };
  changeParam = (name, v, index, key) => {

    key = key || 'value';
    const pathParam = deepCopyJson(this.state[name]);
    pathParam[index][key] = v;
    pathParam[index].isexampler=v===pathParam[index].example;
    if (key === 'value') {
      pathParam[index].enable = !!v;
    }
    this.setState({
      [name]: pathParam
    });
  };

  swichitemvalue=item=>{
    //console.log({item});
    item.tempValue=item.value===item.example?item.tempValue:item.value;
    item.isexampler=item.isexampler?false:true;
    if(item.value!==item.example){
      item.value = item.example;
    }else{
      item.value = item.tempValue;
    }
  }

  isexampler = () => {
    const req_params = deepCopyJson(this.state.req_params);
    const req_query = deepCopyJson(this.state.req_query);
    // const req_headers = deepCopyJson(this.state.req_headers);
    const bodyForm = deepCopyJson(this.state.req_body_form);

    //   console.log({pathParam,name, v, index, key});
    for(let i=0;i<req_params.length;i++){
      this.swichitemvalue(req_params[i]);
    }
    for(let i=0;i<req_query.length;i++){
      this.swichitemvalue(req_query[i]);
    }
    //header本身有参数值，参数全量切换，不需要切换header的示例值
    // for(let i=0;i<req_headers.length;i++){
    //   this.swichitemvalue(req_headers[i]);
    // }
    for(let i=0;i<bodyForm.length;i++){
      this.swichitemvalue(bodyForm[i]);
    }
    this.setState({
      req_params : req_params,
      req_query:req_query,
      // req_headers:req_headers,
      req_body_form:bodyForm
    });
  };

  changeBody = (v, index, key) => {
    const bodyForm = deepCopyJson(this.state.req_body_form);
    key = key || 'value';
    bodyForm[index].isexampler=v===bodyForm[index].example;
    if (key === 'value') {
      bodyForm[index].enable = !!v;
      if (bodyForm[index].type === 'file') {
        bodyForm[index].value = 'file_' + index;
      } else {
        bodyForm[index].value = v;
      }
    } else if (key === 'enable') {
      bodyForm[index].enable = v;
    }
    this.setState({ req_body_form: bodyForm });
  };

  changetv = (item,name, index, key) => {
    item.tempValue=item.value===item.example?item.tempValue:item.value;
    item.isexampler=item.isexampler?false:true;
    if(item.value!==item.example){
      name==='req_body_form'?this.changeBody(item.example, index, key):this.changeParam(name,item.example,index,key);
    }else{
      name==='req_body_form'?this.changeBody(item.tempValue, index, key):this.changeParam(name,item.tempValue,index,key);
    }
  };

  content = (item, name, index, key) => {
    return (
      <div >
        <Icon type="swap" style={{ color: item.isexampler?'rgba(255, 0, 0,0.7)':'rgba(0, 0, 0,0.7)'}} onClick={e => {
          e.stopPropagation();
          this.changetv(item,name, index, key);
        }} />
        {' '+ item.example}
      </div>
    )
  };

    prefix=(item, name, index)=>{
     //console.log({item})
      return (
        <Icon type="swap" style={{ color: item.isexampler?'rgba(255, 0, 0,0.7)':'rgba(0, 0, 0,0.7)'}}
              onClick={e => {
                e.stopPropagation();
                this.changetv(item,name, index);
              }}/>
      )
    }

  render() {
    const {
      method,
      env,
      path,
      req_params = [],
      req_headers = [],
      req_query = [],
      req_body_type,
      req_body_form = [],
      loading,
      case_env,
      inputValue,
      hasPlugin,
      case_pre_script = '',
      case_post_script = ''
    } = this.state;
    // console.log(env);
    return (
      <div className="interface-test postman">
        {this.state.modalVisible && (
          <ModalPostman
            visible={this.state.modalVisible}
            handleCancel={this.handleModalCancel}
            handleOk={this.handleModalOk}
            inputValue={inputValue}
            envType={this.props.type}
            id={+this.state._id}
          />
        )}

        {this.state.envModalVisible && (
          <Modal
            title="环境设置"
            visible={this.state.envModalVisible}
            onOk={this.handleEnvOk}
            onCancel={this.handleEnvCancel}
            footer={null}
            width={800}
            className="env-modal"
          >
            <ProjectEnv projectId={this.props.data.project_id} onOk={this.handleEnvOk} />
          </Modal>
        )}

        <div className="url">
          <InputGroup compact style={{ display: 'flex' }}>
            <Select disabled value={method} style={{ flexBasis: 60 }}>
              {Object.keys(HTTP_METHOD).map(name => {
                <Option value={name.toUpperCase()}>{name.toUpperCase()}</Option>;
              })}
            </Select>
            <Select
              value={case_env}
              style={{ flexBasis: 180, flexGrow: 1 }}
              onSelect={this.selectDomain}
            >
              {env.map((item, index) => (
                <Option value={item.name} key={index}>
                  {item.name + '：' + item.domain}
                </Option>
              ))}
              <Option value="环境配置" disabled style={{ cursor: 'pointer', color: '#2395f1' }}>
                <Button type="primary" onClick={this.showEnvModal}>
                  环境配置
                </Button>
              </Option>
            </Select>

            <Input
              disabled
              value={path}
              onChange={this.changePath}
              spellCheck="false"
              style={{ flexBasis: 180, flexGrow: 1 }}
            />
          </InputGroup>

          <Tooltip
            placement="bottom"
            title='示例数据和参数值间切换'
          >
            <Button
              onClick={this.isexampler}
              type="primary"
              style={{ marginLeft: 10 }}

            >
              切换参数
            </Button>
          </Tooltip>

          <Tooltip
            placement="bottom"
            title={(() => {
              if (hasPlugin) {
                return '发送请求';
              } else {
                return '请安装 cross-request 插件';
              }
            })()}
          >
            <Button
              disabled={!hasPlugin}
              onClick={this.reqRealInterface}
              type="primary"
              style={{ marginLeft: 10 }}
              icon={loading ? 'loading' : ''}
            >
              {loading ? '取消' : '发送'}
            </Button>
          </Tooltip>

          <Tooltip
            placement="bottom"
            title={() => {
              return this.props.type === 'inter' ? '保存到测试集' : '更新该用例';
            }}
          >
            <Button onClick={this.props.save} type="primary" style={{ marginLeft: 10 }}>
              {this.props.type === 'inter' ? '保存' : '更新'}
            </Button>
          </Tooltip>
        </div>

        <Collapse defaultActiveKey={['0', '1', '2', '3']} bordered={true}>
          <Panel
            header="PATH PARAMETERS"
            key="0"
            className={req_params.length === 0 ? 'hidden' : ''}
          >
            {req_params.map((item, index) => {
              return (
                <div key={index} className="key-value-wrap">
                  {/* <Tooltip
                    placement="topLeft"
                    title={<TooltipContent example={item.example} desc={item.desc} />}
                  >
                    <Input disabled value={item.name} className="key" />
                  </Tooltip> */}
                  <ParamsNameComponent example={this.content(item, 'req_params',index)} desc={item.desc} name={item.name}/>
                  <span className="eq-symbol">=</span>
                  <Input
                    value={item.isexampler?item.example:item.value}
                    prefix={this.prefix(item, 'req_params',index)}
                    className="value"
                    onChange={e => this.changeParam('req_params', e.target.value, index)}
                    placeholder="参数值"
                    id={`req_params_${index}`}
                    addonAfter={
                      <Icon
                        type="edit"
                        onClick={() => this.showModal(item.value, index, 'req_params')}
                      />
                    }
                  />

                </div>
              );
            })}
            <Button
              style={{ display: 'none' }}
              type="primary"
              icon="plus"
              onClick={this.addPathParam}
            >
              添加Path参数
            </Button>
          </Panel>
          <Panel
            header="QUERY PARAMETERS"
            key="1"
            className={req_query.length === 0 ? 'hidden' : ''}
          >
            {req_query.map((item, index) => {
              return (
                <div key={index} className="key-value-wrap">
                  {/* <Tooltip
                    placement="topLeft"
                    title={<TooltipContent example={item.example} desc={item.desc} />}
                  >
                    <Input disabled value={item.name} className="key" />
                  </Tooltip> */}
                  <ParamsNameComponent example={this.content(item, 'req_query',index)} desc={item.desc} name={item.name} />
                  &nbsp;
                  {item.required == 1 ? (
                    <Checkbox className="params-enable" checked={true} disabled />
                  ) : (
                    <Checkbox
                      className="params-enable"
                      checked={item.enable}
                      onChange={e =>
                        this.changeParam('req_query', e.target.checked, index, 'enable')
                      }
                    />
                  )}
                  <span className="eq-symbol">=</span>
                  <Input
                    value={item.isexampler?item.example:item.value}
                    prefix={this.prefix(item, 'req_query',index)}
                    className="value"
                    onChange={e => this.changeParam('req_query', e.target.value, index)}
                    placeholder="参数值"
                    id={`req_query_${index}`}
                    addonAfter={
                      <Icon
                        type="edit"
                        onClick={() => this.showModal(item.value, index, 'req_query')}
                      />
                    }
                  />
                </div>
              );
            })}
            <Button style={{ display: 'none' }} type="primary" icon="plus" onClick={this.addQuery}>
              添加Query参数
            </Button>
          </Panel>
          <Panel header="HEADERS" key="2" className={req_headers.length === 0 ? 'hidden' : ''}>
            {req_headers.map((item, index) => {
              return (
                <div key={index} className="key-value-wrap">
                  {/* <Tooltip
                    placement="topLeft"
                    title={<TooltipContent example={item.example} desc={item.desc} />}
                  >
                    <Input disabled value={item.name} className="key" />
                  </Tooltip> */}
                  <ParamsNameComponent example={this.content(item, 'req_headers',index)} desc={item.desc} name={item.name} />
                  <span className="eq-symbol">=</span>
                  <Input
                    value={item.isexampler?item.example:item.value}
                    prefix={this.prefix(item, 'req_headers',index)}
                    disabled={!!item.abled}
                    className="value"
                    onChange={e => this.changeParam('req_headers', e.target.value, index)}
                    placeholder="参数值"
                    id={`req_headers_${index}`}
                    addonAfter={
                      !item.abled && (
                        <Icon
                          type="edit"
                          onClick={() => this.showModal(item.value, index, 'req_headers')}
                        />
                      )
                    }
                  />
                </div>
              );
            })}
            <Button style={{ display: 'none' }} type="primary" icon="plus" onClick={this.addHeader}>
              添加Header
            </Button>
          </Panel>
          <Panel
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Tooltip title="F9 全屏编辑">BODY(F9)</Tooltip>
              </div>
            }
            key="3"
            className={
              HTTP_METHOD[method].request_body &&
              ((req_body_type === 'form' && req_body_form.length > 0) || req_body_type !== 'form')
                ? 'POST'
                : 'hidden'
            }
          >
            <div
              style={{ display: checkRequestBodyIsRaw(method, req_body_type) ? 'block' : 'none' }}
            >
              {req_body_type === 'json' && (
                <div className="adv-button">
                  <Button
                    onClick={() => this.showModal(this.state.req_body_other, 0, 'req_body_other')}
                  >
                    高级参数设置
                  </Button>
                  <Tooltip title="高级参数设置只在json字段值中生效">
                    {'  '}
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </div>
              )}

              <AceEditor
                className="pretty-editor"
                ref={editor => (this.aceEditor = editor)}
                data={this.state.req_body_other}
                mode={req_body_type === 'json' ? null : 'text'}
                onChange={this.handleRequestBody}
                fullScreen={true}
              />
            </div>

            {HTTP_METHOD[method].request_body &&
              req_body_type === 'form' && (
                <div>
                  {req_body_form.map((item, index) => {
                    return (
                      <div key={index} className="key-value-wrap">
                        {/* <Tooltip
                          placement="topLeft"
                          title={<TooltipContent example={item.example} desc={item.desc} />}
                        >
                          <Input disabled value={item.name} className="key" />
                        </Tooltip> */}
                        <ParamsNameComponent
                          example={this.content(item, 'req_body_form',index)}
                          desc={item.desc}
                          name={item.name}
                        />
                        &nbsp;
                        {item.required == 1 ? (
                          <Checkbox className="params-enable" checked={true} disabled />
                        ) : (
                          <Checkbox
                            className="params-enable"
                            checked={item.enable}
                            onChange={e => this.changeBody(e.target.checked, index, 'enable')}
                          />
                        )}
                        <span className="eq-symbol">=</span>
                        {item.type === 'file' ? (
                          '因Chrome最新版安全策略限制，不再支持文件上传'
                          // <Input
                          //   type="file"
                          //   id={'file_' + index}
                          //   onChange={e => this.changeBody(e.target.value, index, 'value')}
                          //   multiple
                          //   className="value"
                          // />
                        ) : (
                          <Input
                            value={item.isexampler?item.example:item.value}
                            prefix={this.prefix(item, 'req_body_form',index)}
                            className="value"
                            onChange={e => this.changeBody(e.target.value, index)}
                            placeholder="参数值"
                            id={`req_body_form_${index}`}
                            addonAfter={
                              <Icon
                                type="edit"
                                onClick={() => this.showModal(item.value, index, 'req_body_form')}
                              />
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                  <Button
                    style={{ display: 'none' }}
                    type="primary"
                    icon="plus"
                    onClick={this.addBody}
                  >
                    添加Form参数
                  </Button>
                </div>
              )}
            {HTTP_METHOD[method].request_body &&
              req_body_type === 'file' && (
                <div>
                  <Input type="file" id="single-file" />
                </div>
              )}
          </Panel>
          <Panel header="用例前置/后置js处理器" key="4">
            <div className="project-request">
              <Form >
                <FormItem  label="前置处理器:">
                  <AceEditor
                      data={case_pre_script}
                      onChange={editor => this.setState({ case_pre_script: editor.text }) }
                      fullScreen={true}
                      className="request-editor"
                      ref={aceEditor => {
                        this.aceEditor = aceEditor;
                      }}
                  />
                </FormItem>
                <FormItem  label="后置处理器">
                  <AceEditor
                      data={case_post_script}
                      onChange={editor => this.setState({ case_post_script: editor.text })}
                      fullScreen={true}
                      className="request-editor"
                      ref={aceEditor => {
                        this.aceEditor = aceEditor;
                      }}
                  />
                </FormItem>
              </Form>
            </div>
          </Panel>
        </Collapse>

        <Tabs size="large" defaultActiveKey="res" className="response-tab">
          <Tabs.TabPane tab="Response" key="res">
            <Spin spinning={this.state.loading}>
              <h2
                style={{ display: this.state.resStatusCode ? '' : 'none' }}
                className={
                  'res-code ' +
                  (this.state.resStatusCode >= 200 &&
                  this.state.resStatusCode < 400 &&
                  !this.state.loading
                    ? 'success'
                    : 'fail')
                }
              >
                {this.state.resStatusCode + '  ' + this.state.resStatusText}
              </h2>
              <div>
                请通过按键【F12】 进入开发者工具，在console中查看原始请求数据和响应
              </div>
              {this.state.test_valid_msg && (
                <Alert
                  message={
                    <span>
                      Warning &nbsp;
                      <Tooltip title="针对定义为 json schema 的返回数据进行格式校验">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                  type="warning"
                  showIcon
                  description={this.state.test_valid_msg}
                />
              )}
              {this.state.test_script_msg && (
                <Alert
                  message="Error"
                  type="error"
                  showIcon
                  description={<pre>{this.state.test_script_msg}</pre>}
                />
              )}

              <div className="container-header-body">
                <div className="header">
                  <div className="container-title">
                    <h4>Headers</h4>
                  </div>
                  <AceEditor
                    callback={editor => {
                      editor.renderer.setShowGutter(false);
                    }}
                    readOnly={true}
                    className="pretty-editor-header"
                    data={this.state.test_res_header}
                    mode="json"
                  />
                </div>
                <div className="resizer">
                  <div className="container-title">
                    <h4 style={{ visibility: 'hidden' }}>1</h4>
                  </div>
                </div>
                <div className="body">
                  <div className="container-title">
                    <h4>Body</h4>
                  </div>
                  <AceEditor
                    readOnly={true}
                    className="pretty-editor-body"
                    data={this.state.test_res_body}
                    mode={handleContentType(this.state.test_res_header)}
                    // mode="html"
                  />
                </div>
              </div>
            </Spin>
          </Tabs.TabPane>
          {this.props.type === 'case' ? (
            <Tabs.TabPane
              className="response-test"
              tab={<Tooltip title="测试脚本，可断言返回结果，使用方法请查看文档">Test</Tooltip>}
              key="test"
            >
              <h3 style={{ margin: '5px' }}>
                &nbsp;是否开启:&nbsp;
                <Switch
                  checked={this.state.enable_script}
                  onChange={e => this.setState({ enable_script: e })}
                />
              </h3>
              <p style={{ margin: '10px' }}>注：Test 脚本只有做自动化测试才执行</p>
              <Row>
                <Col span={18}>
                  <AceEditor
                    onChange={this.onOpenTest}
                    className="case-script"
                    data={this.state.test_script}
                    ref={aceEditor => {
                      this.aceEditor = aceEditor;
                    }}
                  />
                </Col>
                <Col span={6}>
                  <div className="insert-code">
                    {InsertCodeMap.map(item => {
                      return (
                        <div
                          style={{ cursor: 'pointer' }}
                          className="code-item"
                          key={item.title}
                          onClick={() => {
                            this.handleInsertCode('\n' + item.code);
                          }}
                        >
                          {item.title}
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </Tabs.TabPane>
          ) : null}
        </Tabs>
      </div>
    );
  }
}
