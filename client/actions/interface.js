import {
  FETCH_INTERFACE_DATA,
} from '../actionTypes.js';

export function fetchAuditIcons () {
  const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    date: '2015-11-11 13:00:15',
    features: '3',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    date: '2015-11-11 13:00:15',
    features: '3',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    date: '2015-11-11 13:00:15',
    features: '3',
  }]

  return {
    type: FETCH_INTERFACE_DATA,
    payload: data,
  };
}