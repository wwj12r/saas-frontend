import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button} from '@tarojs/components';
import './index.less'
import Modal from '../modal/index';
import { track } from '../../utils/track';
import Api from '../../api/request';
import { goSomewhere } from '../../utils/common';
type Props = {
  popup: any,
  newRP: number,
  myShowModal: boolean,
  closeModal:()=>void,
  closePop:()=>void,
  receive:()=>void,
  getRP: ()=>void,
  closeRP: ()=>void,
  startClick: ()=>void,
}

interface IndexModal{
  props: Props,
}

interface PageState {
}

class IndexModal extends Component<{}, PageState> {
  constructor() {
    super(...arguments)
    this.state = {
    }
  }

  render() {
    const {popup, newRP, myShowModal} = this.props
    return (
      <View>
      {
        popup.imageUrl&&
        <View className="popup">
          <View className="bg" onClick={this.props.closePop}></View>
          <View className="modal">
            <Image src={popup.imageUrl} mode={"widthFix"} onClick={this.toPopUrl}></Image>
            <View className="close" onClick={this.props.closePop}></View>
          </View>
        </View>
      }
      {
        newRP &&
        <View className="newRP">
          <View className="bg" onClick={this.props.closeRP}></View>
          {
            newRP === 1 ?
            <View className="modal">
              <Image src='https://img.xianxiapai.net/saas/rpPopup.png' className="img"></Image>
              {/* <View className="flex shake" onClick={()=>{this.props.startClick();track('index_new_share')}}>分享到群，红包翻倍
                <Button openType="share"></Button>
              </View> */}
              <View className="flex shake" onClick={this.props.getRP.bind(this,'skip', 'notShare')}>立即领取</View>
              {/* <View className="btn flex" onClick={this.props.getRP.bind(this,'skip', 'notShare')}>只要10元就够了</View> */}
              <View className="close" onClick={this.props.closeRP}></View>
            </View>
            :
            <View className="modal open">
              <Image src='https://img.xianxiapai.net/saas/rpPopupOpen.png' className="img"></Image>
              <View className="flex" onClick={this.props.getRP.bind(this,'success')}>领取20元红包</View>
              <View className="btn flex" onClick={this.props.getRP.bind(this,'skip')}>只要10元红包</View>
              <View className="close" onClick={this.props.closeRP}></View>
            </View>
          }
        </View>
      }
      {
        myShowModal &&
        <Modal onClose={this.props.closeModal} onShare={()=>{this.props.startClick(),this.props.closeModal()}}></Modal>
      }
      {
        popup.give_user_avatar && !popup.is_give && !popup.is_mine &&
        <View className="giveCoupon">
          <View className="bg"></View>
          <View className="modal">
            <View className="icon"></View>
            <View className="close" onClick={this.props.closePop}></View>
            <Image src={popup.give_user_avatar} mode={"widthFix"} className="avatar"></Image>
            <View className="name">{popup.give_user_name}</View>
            <Text className="title">送你一张电影票，</Text>
            <Text className="title">一起去看场电影吧！</Text>
            <Image src="https://img.xianxiapai.net/saas/shareTicket.png" className="shareTicket"></Image>
            <View className="btn flex" onClick={this.props.receive}>立即收下</View>
          </View>
        </View>
      }
      </View>
    )
  }

  async toPopUrl() {
    track(`index_popclick_${this.props.popup.id}`)
    if (this.props.popup.jump_type === 'ajax') {
      const {message} = await Api.request(this.props.popup.href, 'POST')
      Taro.showToast({
        title: message,
        icon: 'none'
      })
      this.props.closePop()
    } else {
      goSomewhere(this.props.popup)
      this.props.closePop()
    }
  }
}

export default IndexModal