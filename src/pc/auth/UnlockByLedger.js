import React from 'react';
import {connect} from "dva";
import { NavBar,Button} from 'antd-mobile'
import {Icon, Radio,Input} from 'antd';
import intl from 'react-intl-universal';
import {getXPubKey, connect as connectLedger} from "LoopringJS/ethereum/ledger";
import {paths} from '../../common/config/data'
import Notification from 'LoopringUI/components/Notification'

const ledgerPaths = ["m/44'/60'/0'/0", "m/44'/60'/0'", "m/44'/61'/0'/0", "m/44'/60'/160720'/0'", "m/44'/1'/0'/0"];

const supportPaths = paths.filter(item => !!ledgerPaths.find(dpath => dpath === item.path));

function ChooseLedgerAddress({dispatch, pageNum, dpath, customPath, addresses, unlockByLedger}) {

  const showLayer = (payload = {}) => {
    dispatch({
      type: 'layers/showLayer',
      payload: {
        ...payload
      }
    })
  }

  const hideLayer = (payload = {}) => {
    dispatch({
      type:"layers/hideLayer",
      payload:{
        ...payload
      }
    })
  }

  const nextPage = () => {
    dispatch({type: 'determineWallet/pageNumChange', payload: {pageNum: pageNum + 1}})
  };

  const previousPage = () => {
    dispatch({type: 'determineWallet/pageNumChange', payload: {pageNum: pageNum - 1}})
  };

  const handlePathChange = async (e) => {
    const dpath = e.target.value;
    connectLedger().then(res => {
      if (!res.error) {
        const ledger = res.result;
        getXPubKey(dpath, ledger).then(resp => {
          if (!resp.error) {
            const {chainCode, publicKey} = resp.result;
            dispatch({
              type: 'determineWallet/setHardwareWallet',
              payload: {dpath, publicKey, chainCode, walletType: 'ledger'}
            });
          }
        });
      }
    });
  };
  const onCustomPathChange = (e) => {
    dispatch({type: 'determineWallet/customChange', payload: {customPath: e.target.value}})
  };

  const confirm = (index) => {
    const {chooseAddress} = unlockByLedger;

    if (window.WALLET && addresses[index].toLowerCase() !== window.WALLET.getAddress().toLowerCase()) {
      Notification.open({type: 'warning', description: intl.get('notifications.title.dif_address')});
      // return;
    }
    if (chooseAddress) {
      chooseAddress(dpath.concat(`/${index}`))
    }
    dispatch({type: 'layers/hideLayer', payload: {id: 'unlockByLedger'}});
    dispatch({type: 'determineWallet/reset'})
  };

  return (
    <div className="bg-white" style={{height: '100vh', overflow: 'auto'}}>
      <NavBar
        className="bg-white"
        mode="light"
        leftContent={[
          <span onClick={() => hideLayer({id: 'unlockByLedger'})} className="text-primary fs14 cursor-pointer"
                key="1"><Icon type="close"/></span>,
        ]}
        rightContent={[]}
      >
        <div className="color-black-1 fs16">
          {intl.get('unlock_by_ledger.title')}
        </div>
      </NavBar>
      <div className="divider 1px zb-b-t"></div>
      <div className="">
        <div className="text-primary pt10 pb10 fs16 pl15 pr15 mt15">1. {intl.get('wallet_determine.title_select_path')}</div>
        <div className="bg-white-light">
          <Radio.Group className="" onChange={handlePathChange} value={dpath}>
            {supportPaths.map((item, index) =>
              <Radio className="d-flex align-items-center pt10 pb10 zb-b-b pl15 pr15" value={item.path} key={index}>
                <div className="color-black fs13">{item.path}</div>
                <div className="color-black-3 fs12" style={{whiteSpace:'normal'}}>{item.wallet.join(", ")}</div>
              </Radio>
            )}
            <Radio className="d-flex align-items-center pt10 pb10 pl15 pr15" value={customPath}>
              <div className="selectable">
                <span className="color-black fs13">{intl.get('wallet_determine.custom_path')}</span>
                <Input className="ml10" value={customPath} onChange={onCustomPathChange}/>
              </div>
            </Radio>
          </Radio.Group>
        </div>
        <div className="">
          <div className="fs16 text-primary pt10 pb10 pl15 pr15 mt15">2. {intl.get('wallet_determine.title_deter_address')}</div>
          <div className="bg-white-light">
            {addresses.length > 0 && addresses.map((address, index) => {
              return (
                <div className="pt10 pb10 zb-b-b pl15 pr15 d-flex justify-content-between align-items-center" key={index}>
                  <span className="color-black fs12">{index+1}. {address}</span>
                  <Button className="ml5 bg-primary-light text-primary d-inline-block border-none fs12" size="small" type="primary" onClick={() => confirm(index)}>
                    {intl.get('common.import')}</Button>
                </div>)
            })}
            {
              addresses.length <= 0 &&
              <div className="fs12 pt10 pb10 color-black-3">{intl.get('wallet_determine.no_address_tip')}</div>
            }
          </div>
          <div className="d-flex justify-content-between account-addresses-pagenav p15">
            <Button className="fs12" type="primary" size="small" onClick={previousPage} disabled={pageNum <= 0}>{intl.get('common.previous_page')}</Button>
            <Button className="fs12" type="primary" size="small" onClick={nextPage}>{intl.get('common.next_page')}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {

  return {
    pageSize: state.determineWallet.pageSize,
    pageNum: state.determineWallet.pageNum,
    dpath: state.determineWallet.dpath,
    customPath:state.determineWallet.customPath,
    addresses: state.determineWallet.addresses
  }

}

export default connect(mapStateToProps)(ChooseLedgerAddress)
