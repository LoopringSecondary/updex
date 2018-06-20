import React from 'react';
import { List, InputItem,Button,WingBlank,Slider, Tabs, WhiteSpace, Badge,SegmentedControl, NavBar, Icon,Modal,Switch,Steps } from 'antd-mobile';
import { Icon as WebIcon,Switch as WebSwitch } from 'antd';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import OrderDetail from './Detail';
import PlaceOrderSteps from './PlaceOrderSteps';
import HelperOfAdvance from './HelperOfAdvance';
import HelperOfPrice from './HelperOfPrice';
import HelperOfAmount from './HelperOfAmount';
import ListMarketTickers from '../tickers/ListMarketTickers';
import {OpenOrderList,HistoryOrderList} from './ListOrders';
import ListMyFills from '../fills/ListMyFills';
import Containers from 'modules/containers';
import UiContainers from 'LoopringUI/containers'
import routeActions from 'common/utils/routeActions'
const Item = List.Item;
const Brief = Item.Brief;


// 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
// https://github.com/ant-design/ant-design-mobile/issues/307
// https://github.com/ant-design/ant-design-mobile/issues/163
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
const PlaceOrderForm = (props)=>{
  const { side,showLayer,form} = props
  return (
    <div>
       <List className="bg-none no-border">
        <InputItem
          {...form.getFieldProps('money3')}
          type="money"
          placeholder="00.000000"
          clear
          moneyKeyboardAlign="right"
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          extra={<WebIcon type="profile" style={{padding:'2px 0px 5px 20px',outline:'5px'}} onClick={showLayer.bind(this,{id:'helperOfPrice',side:'sell'})} />}
        ><div className="fs16">Price</div></InputItem>
      </List>
      <List className="bg-none no-border">
        <InputItem
          type="money"
          placeholder="00.000000"
          clear
          moneyKeyboardAlign="right"
          onChange={(v) => { console.log('onChange', v); }}
          onBlur={(v) => { console.log('onBlur', v); }}
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          extra={<WebIcon type="profile" style={{padding:'2px 0px 5px 20px',outline:'5px'}} onClick={showLayer.bind(this,{id:'helperOfAmount',side:'sell'})} />}
        ><div className="fs16">Amount</div></InputItem>
      </List>
      <List className="bg-none no-border">
        <InputItem
          type="money"
          placeholder="00.000000"
          extra={<WebIcon type="exclamation-circle-o" style={{padding:'2px 0px 5px 20px',outline:'5px'}} />}
          clear
          moneyKeyboardAlign="right"
          onChange={(v) => { console.log('onChange', v); }}
          onBlur={(v) => { console.log('onBlur', v); }}
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          editable={false}
        ><div className="fs16">Total</div></InputItem>
      </List>
      <List className="bg-none no-border">
        {
          false &&
          <InputItem
            type="money"
            placeholder="00.000000"
            extra={<span className="fs16 color-black-4">{null && "LRC"}</span>}
            clear
            moneyKeyboardAlign="right"
            onChange={(v) => { console.log('onChange', v); }}
            onBlur={(v) => { console.log('onBlur', v); }}
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            editable={false}
          >LRC Fee</InputItem>
        }
        {
          false &&
          <InputItem
            type="money"
            placeholder="06-10 12:00"
            extra={<span className="fs16 color-black-4">{null && "WETH"}</span>}
            clear
            moneyKeyboardAlign="left"
            onChange={(v) => { console.log('onChange', v); }}
            onBlur={(v) => { console.log('onBlur', v); }}
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            editable={false}
          >TTL</InputItem>
        }
        <Item>
          <div className="row align-items-center ml0 mr0 mb15 mt10">
            <div className="col color-black-3 fs16 pl0">Advanced</div>
            <div className="col-auto color-black-3 fs16 pr0">
              <WebSwitch onChange={(checked)=>{showLayer({id:'helperOfAdvance',side})}} />
            </div>
          </div>
          {
            side === 'sell' &&
            <Button onClick={showLayer.bind(this,{id:'placeOrderSteps',side})} className="w-100 d-block mb10 color-white bg-red-500" type="warning">Place Sell Order</Button>
          }
          {
            side === 'buy' &&
            <Button onClick={showLayer.bind(this,{id:'placeOrderSteps',side})} className="w-100 d-block mb10 bg-green-500 color-white">Place Buy Order</Button>
          }
        </Item>
      </List>

    </div>
  )
}
export default createForm()(PlaceOrderForm)







