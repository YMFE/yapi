import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Input, AutoComplete } from 'antd'
import './Search.scss'
import { withRouter } from 'react-router';
import axios from 'axios';

@connect(
  state => ({
    groupList: state.group.groupList,
    projectList: state.project.projectList
  })
)

@withRouter
export default class Srch extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[]
    };
  }

  static propTypes = {
    groupList : PropTypes.array,
    projectList: PropTypes.array,
    router: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
  }

  onSelect = (value) => {
    if( value.split(":")[0] == "group" ){
      this.props.history.push('/group/'+value.split(":")[1].trim());
    } else {
      this.props.history.push('/project/'+value.split("(")[1].slice(0,-1));
    }
  }

  handleSearch = (value) => {
    axios.get('/project/search?q='+value)
      .then((res) => {
        if(res.data && res.data.errcode === 0){
          const dataSource = [];
          for(let title in res.data.data){
            res.data.data[title].map(item => {
              title == "group" ? dataSource.push( title+": "+item.groupName ): dataSource.push( title+": "+item.name+"("+item._id+")" );
            })
          }
          this.setState({
            dataSource: dataSource
          });
        }else{
          console.log("查询项目或分组失败");
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getDataSource(groupList){
    const groupArr =[];
    groupList.forEach(item =>{
      groupArr.push("group: "+ item["group_name"]);
    })
    return groupArr;
  }

  render(){
    const { dataSource } = this.state;
    return(
      <div className="search-wrapper">
        <AutoComplete
          className="search-dropdown"
          dataSource={dataSource}
          size="large"
          style={{ width: '100%' }}
          defaultActiveFirstOption= {false}
          onSelect={this.onSelect}
          onSearch={this.handleSearch}
          filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
        >
          <Input
            prefix={<Icon type="search" className="srch-icon" />}
            size="large" style={{ width: 200 }}
            placeholder="search group/project"
            className="search-input"
          />
        </AutoComplete>
      </div>
    )
  }
}