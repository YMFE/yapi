import React from 'react'
import PropTypes from 'prop-types'
import { Col, Icon } from 'antd'
import "./Intro.scss"
import { OverPack } from 'rc-scroll-anim'
import TweenOne from 'rc-tween-one'
import QueueAnim from 'rc-queue-anim';

const IntroPart = (props) =>(
  <Col span={12} className="switch-content">
    <div className="icon-switch">
      <Icon type="smile-o" />
    </div>
    <div>
      <p><b>{props.title}</b></p>
      <p>{props.des}</p>
    </div>
  </Col>
)

IntroPart.propTypes = {
  title : PropTypes.string,
  des : PropTypes.string
}

class Intro extends React.Component{
  constructor(props){
    super(props);
  }
  static propTypes={
    intro : PropTypes.shape({
      title:PropTypes.string,
      des:PropTypes.string,
      img:PropTypes.string,
      detail:PropTypes.arrayOf(PropTypes.shape({
        title:PropTypes.string,
        des:PropTypes.string
      }))
    }),
    className : PropTypes.string
  }
  render(){
    const {  intro } = this.props;
    const id = "motion";
    const animType = {
      queue: 'right',
      one: { x: '-=30', opacity: 0, type: 'from' }
    };
    return(
      <div className="intro-container">
        <OverPack
          playScale="0.3"
        >
          <TweenOne
            animation={animType.one}
            key={`${id}-img`}
            resetStyleBool
            id={`${id}-imgWrapper`}
            className="imgWrapper"
          >
            <div className="img-container" id={`${id}-img-container`}>
              <img src={intro.img}/>
            </div>
          </TweenOne>

          <QueueAnim
            type={animType.queue}
            key={`${id}-text`}
            leaveReverse
            ease={['easeOutCubic', 'easeInCubic']}
            id={`${id}-textWrapper`}
            className={`${id}-text des-container textWrapper`}
          >
            <div key={`${id}-des-content`}>
              <div className="des-title">
                {intro.title}
              </div>
              <div className="des-detail">
                {intro.des}
              </div>
            </div>
            <div className="des-switch" key={`${id}-des-switch`}>
              {intro.detail.map(function(item,i){
                return(<IntroPart key={i} title={item.title} des={item.des}/>)
              })}
            </div>
          </QueueAnim>
        </OverPack>
      </div>
    )
  }
}

export default Intro;

