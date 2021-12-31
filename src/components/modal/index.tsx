import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text, Button } from '@tarojs/components';
import './index.less'
type Props = {
  onShare: ()=>void,
  onClose:(e)=>void
}

interface Modal{
  props: Props,
}

interface ModalState {
}

class Modal extends Component<{},ModalState> {
  
  render() {
    return (
      <View className="notice">
        <View className="bg"></View>
        <View className="modal">
          <View className="top">
            <View className="topicBottom">操作失败，请尝试分享到群</View>
          </View>
          <View className="bottom">
            <View className="btn no" onClick={this.props.onClose}>取消</View>
            <View className="btn yes" onClick={this.props.onShare}>去分享
              <Button className="customer flex" openType="share"></Button>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Modal