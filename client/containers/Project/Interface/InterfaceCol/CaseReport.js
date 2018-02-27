import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tabs } from 'antd'
const TabPane = Tabs.TabPane;
function json_format(json) {
  return JSON.stringify(json, null, '   ')
}

const CaseReport = function (props) {
  let params = json_format(props.data);
  let headers = json_format(props.headers, null, '   ');
  let res_header = json_format(props.res_header, null, '   ');
  let res_body = json_format(props.res_body);
  let validRes;
  if (props.validRes && Array.isArray(props.validRes)) {
    validRes = props.validRes.map((item, index) => {
      return <div key={index}>{item.message}</div>
    })
  }


  return <div className="report">
    <Tabs defaultActiveKey="request" >
      <TabPane className="case-report-pane" tab="Request" key="request">
        <Row className="case-report">
          <Col className="case-report-title" span="6">Url</Col>
          <Col span="18">{props.url}</Col>
        </Row>
        {props.query ?
          <Row className="case-report">
            <Col className="case-report-title" span="6">Query</Col>
            <Col span="18">{props.query}</Col>
          </Row>
          : null
        }

        {props.headers ?
          <Row className="case-report">
            <Col className="case-report-title" span="6">Headers</Col>
            <Col span="18"><pre>{headers}</pre></Col>
          </Row>
          : null
        }

        {params ?
          <Row className="case-report">
            <Col className="case-report-title" span="6">Body</Col>
            <Col span="18"><pre style={{whiteSpace: 'pre-wrap'}}>{params}</pre></Col>
          </Row>
          : null
        }
      </TabPane>
      <TabPane className="case-report-pane" tab="Response" key="response">
        {props.res_header ?
          <Row className="case-report">
            <Col className="case-report-title" span="6">Headers</Col>
            <Col span="18"><pre>{res_header}</pre></Col>
          </Row>
          : null
        }
        {props.res_body ?
          <Row className="case-report">
            <Col className="case-report-title" span="6">Body</Col>
            <Col span="18"><pre>{res_body}</pre></Col>
          </Row>
          : null
        }

      </TabPane>
      <TabPane className="case-report-pane" tab="验证结果" key="valid">
        {props.validRes ?
          <Row className="case-report">
            <Col className="case-report-title" span="6">验证结果</Col>
            <Col span="18">
              { validRes }
            </Col>
          </Row>
          : null
        }
      </TabPane>
    </Tabs>



  </div>
}

CaseReport.propTypes = {
  url: PropTypes.string,
  data: PropTypes.any,
  headers: PropTypes.object,
  res_header: PropTypes.object,
  res_body: PropTypes.any,
  query: PropTypes.string,
  validRes: PropTypes.array
}


export default CaseReport;