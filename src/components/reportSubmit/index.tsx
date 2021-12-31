import Taro, { Component } from '@tarojs/taro';
import { View, Form, Button } from '@tarojs/components';
import './index.less';
import { getFormId } from '../../api/index';

interface PageOwnProps {
  children?: any;
}
interface PageState {}
interface reportState {
  props: PageOwnProps;
  state: PageState;
}

export default class Report extends Component<PageOwnProps, reportState> {
  public render() {
    return (
      <View className='page-wrapper'>
        <Form onSubmit={this.formSubmit} reportSubmit>
          <Button className='page-wrapper-btn' formType='submit' hover-class="none">
            {this.props.children}
          </Button>
        </Form>
      </View>
    );
  }
  private formSubmit(event:any) {
    const formId = event.detail.formId;
    getFormId(formId);
  }
}

