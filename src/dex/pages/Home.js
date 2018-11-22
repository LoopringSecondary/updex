import React from 'react'
import {Redirect, Route, Switch } from 'dva/router'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { NavBar,Button } from 'antd-mobile'
import { Icon } from 'antd'
import LayoutDexHome from '../../layout/LayoutDexHome'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
        <LayoutDexHome className="" {...this.props}>
          <div className="bg-white">
            <NavBar
              className="bg-white"
              mode="light"
              onLeftClick={() => {}}
              leftContent={null && [
                <span key="1" className="color-black-1"><Icon  type="left" /></span>,
              ]}
              rightContent={null && [
                <span  key="1" className="text-primary" onClick={()=>{}}><Icon type="scan" /></span>
              ]}
            >
            <div className="color-black">Home</div>
            </NavBar>
            <div className="divider 1px zb-b-t"></div>
             <div className="pt25 pb25 zb-b-b text-center bg-white">
               <img className="h-50" src={require('../../assets/images/up-logo-notext-filled.png')} alt=""/>
               <div className="fs20 color-black-1 mt10">LoopringDEX</div>
               <div className="fs12 color-black-2">A New Version is Coming Soon</div>
             </div>
             <div className=""><div className="1px divider zb-b-b"></div></div>
             <div className="">
                <div className="row no-gutters">
                  <div className="col-12">
                    <div className="text-left pl10 pr10 pt15 pb15 zb-b-b" onClick={routeActions.gotoPath.bind(this,'/dex/placeOrder')}>
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto">
                          <div className="circle-45 center-center bg-primary color-white mr10 fs20"><Icon type="line-chart" /></div>
                        </div>
                        <div className="col">
                          <div className="fs16 color-black-1">Market Trade</div>
                          <div className="fs12 color-black-2 lh15">Public trade with everyone </div>
                        </div>
                        <div className="col-auto">
                          <Button  className="h-25 lh-25 fs12 text-primary bg-primary-light border-none" type="primary" size="small">Trade</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 zb-b-l">
                    <div className="text-left pl10 pr10 pt15 pb15 zb-b-b" onClick={routeActions.gotoPath.bind(this,'/face2face')}>
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto">
                          <div className="circle-45 center-center bg-primary color-white mr10 fs20"><Icon type="team" /></div>
                        </div>
                        <div className="col">
                          <div className="fs16 color-black-1">P2P Trade</div>
                          <div className="fs12 color-black-2 lh15">Privacy trade between friends</div>
                        </div>
                        <div className="col-auto">
                          <Button className="h-25 lh-25 fs12 text-primary bg-primary-light border-none" type="primary" size="small">Trade</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 zb-b-l">
                    <div className="text-left pl10 pr10 pt15 pb15 zb-b-b" onClick={routeActions.gotoPath.bind(this,'/dex/scan')} >
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto">
                          <div className="circle-45 center-center bg-primary color-white mr10 fs20"><Icon type="scan" /></div>
                        </div>
                        <div className="col">
                          <div className="fs16 color-black-1">QRcode Trade</div>
                          <div className="fs12 color-black-2 lh15">Trade evrerywhere by scanning simplely</div>
                        </div>
                        <div className="col-auto">
                          <Button className="h-25 lh-25 fs12 text-primary bg-primary-light border-none" type="primary" size="small">Trade</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  false && 
                  <div className="pt25 pb25 zb-b-b text-center bg-white">
                    <div className="circle-50 m-auto center-center fs25 bg-primary-light text-primary font-weight-bold">
                      <Icon type="scan" />
                    </div>
                    <div className="fs16 color-black-1 font-weight-bold mt10">UP DEX</div>
                    <div className="fs14 color-black-1 mt5">A Decentralized Exchange Built on Loopring</div>
                  </div>
                }
                {
                  false &&
                  <div className="row no-gutters bg-white mt15">
                    <div className="col-12">
                      <div className="text-left p10 zb-b-b" onClick={()=>routeActions.gotoPath('/dex/placeOrder')}>
                        <div className="fs14 color-black-1">About UP DEX</div>
                      </div>
                    </div>
                    <div className="col-12 zb-b-b">
                      <div className="text-left pl10 pr5 pt15 pb15" onClick={()=>routeActions.gotoPath('/dex/scan')}>
                        <div className="row no-gutters align-items-center">
                          <div className="col-auto">
                            <div className="circle-35 center-center bg-primary-light text-primary mr10 fs14 font-weight-bold">01</div>
                          </div>
                          <div className="col">
                            <div className="fs13 color-black-1">Feature 01</div>
                            <div className="fs11">Public trade with everyone </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 zb-b-b">
                      <div className="text-left pl10 pr5 pt15 pb15" onClick={()=>routeActions.gotoPath('/face2face')}>
                        <div className="row no-gutters align-items-center">
                          <div className="col-auto">
                            <div className="circle-35 center-center bg-primary-light text-primary mr10 fs14 font-weight-bold">02</div>
                          </div>
                          <div className="col">
                            <div className="fs13 color-black-1">Feature 02</div>
                            <div className="fs11">Privacy trade with friends</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 zb-b-b">
                      <div className="text-left pl10 pr5 pt15 pb15" onClick={()=>routeActions.gotoPath('/face2face')}>
                        <div className="row no-gutters align-items-center">
                          <div className="col-auto">
                            <div className="circle-35 center-center bg-primary-light text-primary mr10 fs14 font-weight-bold">03</div>
                          </div>
                          <div className="col">
                            <div className="fs13 color-black-1">Feature 03</div>
                            <div className="fs11">Privacy trade with friends</div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                }
             </div>
          </div>
        </LayoutDexHome>
    )
  }
}

export default Home
