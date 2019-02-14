import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

/**
 * @author suxiaoxin
 * @demo
 * <EasyDragSort data={()=>this.state.list} onChange={this.handleChange} >
 * {list}
 * </EasyDragSot>
 */
let curDragIndex = null;

function isDom(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.nodeType === 1 &&
    typeof obj.nodeName === 'string' &&
    typeof obj.getAttribute === 'function'
  );
}

export default class EasyDragSort extends React.Component {
  static propTypes = {
    children: PropTypes.array,
    onChange: PropTypes.func,
    onDragEnd: PropTypes.func,
    data: PropTypes.func,
    onlyChild: PropTypes.string
  };

  render() {
    const that = this;
    const props = this.props;
    const { onlyChild } = props;
    let container = props.children;
    const onChange = (from, to) => {
      if (from === to) {
        return;
      }
      let curValue;

      curValue = props.data();

      let newValue = arrMove(curValue, from, to);
      if (typeof props.onChange === 'function') {
        return props.onChange(newValue, from, to);
      }
    };
    return (
      <div>
        {container.map((item, index) => {
          if (React.isValidElement(item)) {
            return React.cloneElement(item, {
              draggable: onlyChild ? false : true,
              ref: 'x' + index,
              'data-ref': 'x' + index,
              onDragStart: function() {
                curDragIndex = index;
              },
              /**
               * 控制 dom 是否可拖动
               * @param {*} e
               */
              onMouseDown(e) {
                if (!onlyChild) {
                  return;
                }
                let el = e.target,
                  target = e.target;
                if (!isDom(el)) {
                  return;
                }
                do {
                  if (el && isDom(el) && el.getAttribute(onlyChild)) {
                    target = el;
                  }
                  if (el && el.tagName == 'DIV' && el.getAttribute('data-ref')) {
                    break;
                  }
                } while ((el = el.parentNode));
                if (!el) {
                  return;
                }
                let ref = that.refs[el.getAttribute('data-ref')];
                let dom = ReactDOM.findDOMNode(ref);
                if (dom) {
                  dom.draggable = target.getAttribute(onlyChild) ? true : false;
                }
              },
              onDragEnter: function() {
                onChange(curDragIndex, index);
                curDragIndex = index;
              },
              onDragEnd: function() {
                curDragIndex = null;
                if (typeof props.onDragEnd === 'function') {
                  props.onDragEnd();
                }
              }
            });
          }
          return item;
        })}
      </div>
    );
  }
}

function arrMove(arr, fromIndex, toIndex) {
  arr = [].concat(arr);
  let item = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, item);
  return arr;
}
