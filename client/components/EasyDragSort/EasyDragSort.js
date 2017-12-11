import React from 'react'
import PropTypes from 'prop-types'


/**
 * @author suxiaoxin
 * @demo
 * <EasyDragSort data={()=>this.state.list} onChange={this.handleChange} >
 * {list}
 * </EasyDragSot>
 */
let curDragIndex = null;

EasyDragSort.propTypes = {
  children: PropTypes.array,
  onChange: PropTypes.func,
  onDragEnd: PropTypes.func,
  data: PropTypes.func
}

export default function EasyDragSort(props){
    let container = props.children;
    const onChange = (from, to)=>{
      if(from === to ) return ;
      let curValue;
      
      curValue = props.data();
      
      let newValue = arrMove(curValue, from, to);
      if(typeof props.onChange === 'function'){
        return props.onChange(newValue, from ,to);
      }
    } 
    return <div>
      {container.map((item, index)=>{
      if(React.isValidElement(item)){
        return React.cloneElement(item, {
          draggable:"true", 
          onDragStart: function(){
            curDragIndex = index
          },
          onDragEnter: function() {
            onChange(curDragIndex, index)
            curDragIndex = index;
          },
          onDragEnd: function(){
            curDragIndex = null;
            if(typeof props.onDragEnd === 'function'){
              props.onDragEnd()
            }
          }
        })
      }
      return item;
    })}
    </div>;
}

function arrMove(arr, fromIndex, toIndex){
  arr = [].concat(arr);
  let item = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex , 0, item);
  return arr;
}