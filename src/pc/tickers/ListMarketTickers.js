import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm,sorterByMarket,sorterByVolume,sorterByPirce,sorterByChange} from 'modules/tickers/formatters'
import storage from '../../modules/storage'
import intl from 'react-intl-universal'
import routeActions from 'common/utils/routeActions'
import { ListView,Button,Tabs } from 'antd-mobile'
import { Spin,Icon } from 'antd'
import { getMarketTickersBySymbol } from './formatters'
import Worth from 'modules/settings/Worth'
import {formatPrice} from 'modules/orders/formatters'
import markets from 'modules/storage/markets'

export const Sorter = ({className,style={},isActive,direction})=>{
  return (
    <div className={`${className}`} style={{paddingLeft:'1px',...style}}>
      <div style={{position:'absolute',top:'0.1rem'}} className={`lh10 fs6 ${isActive && direction=== 'up' ? 'text-primary' : ''}`} >▲</div>
      <div style={{position:'absolute',top:'0.8rem'}} className={`lh10 fs6 ${isActive && direction=== 'down' ? 'text-primary': ''}`}>▼</div>
    </div>
  )
  // return (
  //   <div className={`${className} ${active}`}>
  //     <Icon hidden type="up" style={{position:'absolute',top:'2px'}} className="lh10" ></Icon>
  //     <Icon hidden type="down" style={{position:'absolute',top:'12px'}} className="lh10"></Icon>
  //     <Icon type={`arrow-${direction}`} className=""></Icon>
  //   </div>
  // )

}
export const TickerHeader = ({sort,dispatch})=>{
  const sortByType = (type) => {
    dispatch({
      type:'sockets/extraChange',
      payload:{
        id:'tickersOfSource',
        extra:{
          sort: {
            sortBy:type ,
            orderBy:sort.orderBy === 'ASC' ? 'DESC' : 'ASC'
          }
        }
      }
    })
  }
  let direction
  if(sort.orderBy === 'ASC'){direction = 'up'}
  if(sort.orderBy === 'DESC'){direction = 'down'}
  if(!sort.sortBy){
    sort.sortBy = 'volume'
    direction = 'down'
  }
  return (
    <tr className="">
      <th hidden className="pl5 fs12 pt5 pb5 font-weight-normal">
      </th>
      <th className="pl20 fs12 color-black-4 text-left hover-default pt5 pb5 font-weight-normal" onClick={sortByType.bind(this, 'market')}>
        <div className="fs12 color-black-4 mr5 position-relative">
          {intl.get('common.volume')} <Sorter className="d-inline-block " isActive={sort.sortBy === 'volume'} direction={direction}></Sorter>
        </div>
        {
          false &&
          <div className="fs12 color-black-4 position-relative">
            {intl.get('common.market')} <Sorter className="d-inline-block " isActive={sort.sortBy === 'market'} direction={direction}></Sorter>
          </div>  
        }
      </th>
      <th className="text-right pl5 pr20 hover-default pt5 pb5 font-weight-normal" onClick={sortByType.bind(this, 'price')}>
        <div className="fs12 color-black-4 position-relative">
          {intl.get('common.price')} <Sorter className="d-inline-block " isActive={sort.sortBy === 'price'} direction={direction}></Sorter>
        </div>
        {
          false &&
          <div className="fs12 color-black-4 mr5 position-relative">
            Change <Sorter className="d-inline-block " isActive={sort.sortBy === 'change'} direction={direction}></Sorter>
          </div>
        }
      </th>
    </tr>
  )
}

export const TickerItem = ({item,actions,key,tickersList,dispatch})=>{
    if(!item){ return null }
    const {extra:{favored={}, sort={}, keywords}} = tickersList
    const tickerFm = new TickerFm(item)
    const tokens = tickerFm.getTokens()
    const direction = tickerFm.getChangeDirection()
    const gotoDetail = ()=>{
      routeActions.gotoPath(`/dex/markets/${item.market}`)
    }
    const toggleTickerFavored = (item, e)=>{
      e.stopPropagation();
      dispatch({
        type:'sockets/extraChange',
        payload:{
          id:'tickersOfSource',
          extra:{
            favored:{...favored,[item]:!favored[item]},
          }
        }
      })
      markets.toggleFavor(item)
    }
    return (
      <tr className="hover-default zb-b-b" onClick={gotoDetail}>
        <td hidden className="pl10 fs14 pt10 pb10" onClick={toggleTickerFavored.bind(this, item.market)}>
          { favored[item.market] && <i type="star" className="text-primary icon-star"/> }
          { !favored[item.market] && <i className="color-black-4 icon-star-o"/> }
        </td>
        <td className="text-left pl20 pt10 pb10">
            <div className="row no-gutters">
              <div className="col-auto pr15">
                <i className={`d-block text-center bg-primary-light text-primary fs18 font-weight-bold icon-token-${tokens.left}`} style={{height:'36px',width:'36px',lineHeight:'36px',borderRadius:'50em'}}/>
              </div>
              <div className="col">
                <div className="fs14 color-black">{tokens.left} / {tokens.right} </div>
                <div className="fs12 color-black-4">{tickerFm.getVol()} {tokens.right}</div>
              </div>
            </div>
            
        </td>
        <td className="text-right pr20 pt10 pb10">
          
          {
            direction === 'up' &&
            <div className="fs12 color-success">
              <div className="fs12 lh15">{formatPrice(tokens.left, tokens.right, tickerFm.getLast())}</div>
             +{tickerFm.getChange()}
            </div>
          }
          {
            direction === 'down' &&
            <div className="fs12 color-error">
              <div className="fs12 lh15">{formatPrice(tokens.left, tokens.right, tickerFm.getLast())}</div>
             {tickerFm.getChange()}
            </div>
          }
          {
            direction === 'none' &&
            <div className="fs12 text-primary">
              <div className="fs12 lh15">{formatPrice(tokens.left, tokens.right, tickerFm.getLast())}</div>
             {tickerFm.getChange()}
            </div>
          }
        </td>
      </tr>
    )
}
export const TickerList = ({items,loading,dispatch, tickersList})=>{
  const {extra:{sort={}, keywords}} = tickersList
  const sortedItems = [...items]
  if(sort.sortBy) {
    switch(sort.sortBy) {
      case 'market':
        sortedItems.sort(sorterByMarket)
        if(sort.orderBy === 'DESC') {
          sortedItems.reverse()
        }
        break;
      case 'volume':
        sortedItems.sort(sorterByVolume)
        if(sort.orderBy === 'DESC') {
          sortedItems.reverse()
        }
        break;
      case 'price':
        sortedItems.sort(sorterByPirce)
        if(sort.orderBy === 'DESC') {
          sortedItems.reverse()
        }
        break;
      case 'change':
        sortedItems.sort(sorterByChange)
        if(sort.orderBy === 'DESC') {
          sortedItems.reverse()
        }
        break;
    }
  }

  return (
    <div className="" style={{minHeight:'50vh'}}>
      <Spin spinning={loading}>

        {!loading && items.length > 0 &&
          <table className="w-100">
            <TickerHeader sort={sort} dispatch={dispatch}/>
            {sortedItems.map((item, index) => <TickerItem key={index} item={item} dispatch={dispatch} tickersList={tickersList}/>)}
          </table>
        }
        {!loading && items.length === 0 &&
          <div className="p10 text-center color-black-4">
            {intl.get('common.list.no_data')}
          </div>
        }
      </Spin>
    </div>
  )
}

class ListMarketTickers extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
      const {tickersOfSource:list,dispatch} = this.props
      const tickersFm = new TickersFm(list)
      const allTickers = tickersFm.getAllTickers().filter(item=>item.label === 'whitelist')
      const favoredTickers = tickersFm.getFavoredTickers().filter(item=> {
        return allTickers.find((n)=>n.market === item.market)
      })
      const recentTickers = tickersFm.getRecentTickers()
      const sorter = (a,b)=>{
        if(a.vol === b.vol ){
          if(a.last === b.last){
            return b.market > a.market ? -1 : 1
          }else{
            return Number(b.last) - Number(a.last)
          }
        }else{
          return Number(b.vol) - Number(a.vol)
        }
      }
      allTickers.sort(sorter)
      const marketGroups = {}
      allTickers.forEach(item=>{
        const market = item.market.split('-')
        let group = marketGroups[market[1]]
        if(group){
          group.push(item)
        } else {
          group = [item]
        }
        marketGroups[market[1]] = group
      })
      favoredTickers.sort(sorter)
      const tabs = []
      const tickerItems = []
      if(marketGroups && Object.keys(marketGroups).length > 0) {
        tabs.push({ title: <div className="fs16">{intl.get('ticker_list.title_favorites')}</div> })
        tickerItems.push(<TickerList key={'fav'} items={favoredTickers} loading={list.loading} dispatch={dispatch} tickersList={list}/>)
        const keys = Object.keys(marketGroups)
        const wethIndex = keys.findIndex(item=> item === 'WETH')
        if(wethIndex > -1) {
          keys.splice(wethIndex, 1);
          tabs.push({title: <div className="fs16">{'WETH'}</div>})
          tickerItems.push(<TickerList key={'WETH'} items={getMarketTickersBySymbol('WETH',allTickers)} loading={list.loading} dispatch={dispatch} tickersList={list}/>)
        }
        const lrcIndex = keys.findIndex(item=> item === 'LRC')
        if(lrcIndex > -1) {
          keys.splice(lrcIndex, 1);
          tabs.push({title: <div className="fs16">{'LRC'}</div>})
          tickerItems.push(<TickerList key={'LRC'} items={getMarketTickersBySymbol('LRC',allTickers)} loading={list.loading} dispatch={dispatch} tickersList={list}/>)
        }
        keys.forEach(item => {
          tabs.push({title: <div className="fs16">{item}</div>})
          tickerItems.push(<TickerList key={item} items={getMarketTickersBySymbol(item,allTickers)} loading={list.loading} dispatch={dispatch} tickersList={list}/>)
        })
      }
      return (
        <Spin spinning={list.loading} className="pt50">
          <Tabs
            tabs={tabs}
            tabBarTextStyle={{}}
            initialPage={1}
            swipeable={false}
            onChange={(tab, index) => {}}
            onTabClick={(tab, index) => { }}
          >
            {tickerItems}
          </Tabs>
        </Spin>
      )
  }
}
export default connect(
  ({sockets:{tickersOfSource}})=>({tickersOfSource})
)(ListMarketTickers)

