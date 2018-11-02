import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm,sorterByMarket,sorterByVolume,sorterByPirce,sorterByChange} from 'modules/tickers/formatters'
import storage from '../../modules/storage'
import intl from 'react-intl-universal'
import routeActions from 'common/utils/routeActions'
import { ListView,Button,Tabs,NavBar,SearchBar } from 'antd-mobile'
import { Spin,Icon } from 'antd'
import { getMarketTickersBySymbol, searchMarkets } from './formatters'
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
    <div className="row ml0 mr0 align-items-center no-gutters fs12">
      <div className="col-4 fs12 color-black-4 text-left hover-default pt5 pb5 pl15" onClick={sortByType.bind(this, 'volume')}>
        <span className="position-relative">
        {intl.get('common.volume')} <Sorter className="d-inline-block " isActive={sort.sortBy === 'volume'} direction={direction}></Sorter>
        </span>
      </div>
      <div className="col-auto pr10 pt5 pb5">
        <Icon type="star-o" className="color-black-4 fs16" style={{opacity:0}}/>
      </div>
      <div className="col text-left pl5 pr10 hover-default pt5 pb5" onClick={sortByType.bind(this, 'price')}>
        <div className="fs12 color-black-4 position-relative">
          {intl.get('common.price')} <Sorter className="d-inline-block " isActive={sort.sortBy === 'price'} direction={direction}></Sorter>
        </div>
      </div>
      <div className="col-3 text-right hover-default pt5 pb5 pr15" onClick={sortByType.bind(this, 'change')}>
        <div className="fs12 color-black-4 mr5 position-relative">
          {intl.get('ticker.change')} <Sorter className="d-inline-block " isActive={sort.sortBy === 'change'} direction={direction}></Sorter>
        </div>
      </div>
    </div>
  )
}

export const TickerItem = ({item,actions,key,tickersList,dispatch})=>{
    if(!item){ return null }
    const {extra:{favored={}, sort={}, keywords}} = tickersList
    const tickerFm = new TickerFm(item)
    const tokens = tickerFm.getTokens()
    const direction = tickerFm.getChangeDirection()
    const gotoDetail = ()=>{
       routeActions.gotoPath(`/trade/${item.market}`)
      dispatch({
        type:'sockets/marketChange',
        payload:{
          market:item.market
        }
      })
      dispatch({
        type:'placeOrder/pairChangeEffects',
        payload:{
          pair:item.market
        }
      })
      dispatch({
        type:'layers/toggleLayer',
        payload:{
          id:'ListMarketTickers'
        }
      })
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
      <div style={{paddingTop:'0.7rem',paddingBottom:'0.7rem'}} className="row ml0 mr0 pl15 pr15 align-items-center no-gutters hover-default zb-b-b" onClick={gotoDetail}>
        <div className="col-auto pr10" onClick={toggleTickerFavored.bind(this, item.market)}>
          {
            favored[item.market] &&
            <i type="star" className="text-primary icon-star fs14"/>
          }
          {
            !favored[item.market] &&
            <i className="color-black-4 icon-star-o fs14"/>
          }
        </div>
        <div className="col-4 text-left">
          <div className="">
            <span className="fs12 color-black-1">{tokens.left} / {tokens.right}</span>
          </div>
          <div className="fs12 lh15">
              <span hidden className="fs12 color-black-4">{intl.get('common.volume')} </span>
              <span className="fs12 color-black-4 text-number">{tickerFm.getVol()}</span>
              <span className="fs12 color-black-4"> {tokens.right}</span>
          </div>
        </div>
        <div className="col text-left pr15 pl5 text-number">
          <div className="fs12 color-black-1">{formatPrice(tokens.left, tokens.right, tickerFm.getLast())}</div>
          <div className="fs12 color-black-4 lh15"><Worth amount={formatPrice(tokens.left, tokens.right, tickerFm.getLast())} symbol={tokens.right}/></div>
        </div>
        <div className="col-auto text-right text-number">
          {
            direction === 'up' &&
            <Button style={{height:'3.2rem',lineHeight:'3.2rem',width:'7.5rem'}} className="border-none radius-4 d-block pl5 pr5 fs14 bg-success color-white">
             +{tickerFm.getChange()}
            </Button>
          }
          {
            direction === 'down' &&
            <Button style={{height:'3.2rem',lineHeight:'3.2rem',width:'7.5rem'}} className="border-none radius-4 d-block pl5 pr5 fs14 bg-error color-white">
             {tickerFm.getChange()}
            </Button>
          }
          {
            direction === 'none' &&
            <Button style={{height:'3.2rem',lineHeight:'3.2rem',width:'7.5rem'}} className="border-none radius-4 d-block pl5 pr5 fs14 bg-grey-500 color-white">
             {tickerFm.getChange()}
            </Button>
          }
        </div>
      </div>
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
      <div className="divider 1px zb-b-t"></div>
      <Spin spinning={loading}>
        {!loading && items.length > 0 &&
          <div>
            <TickerHeader sort={sort} dispatch={dispatch}/>
            <div className="divider 1px zb-b-t"></div>
            {sortedItems.map((item, index) => <TickerItem key={index} item={item} dispatch={dispatch} tickersList={tickersList}/>)}
          </div>
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
    this.state = {
      keyword: ''
    }
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
      const tabs = []
      const tickerItems = []
      favoredTickers.sort(sorter)
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

      const search = (keyword) => {
        this.setState({keyword})
      }
      return (
        <div>
          <SearchBar
            placeholder="Search"
            onChange={(keyword)=>search(keyword)}
            className="bg-none"
            style={{marginTop:'0.2rem',marginBottom:'0.1rem'}}
            showCancelButton={false}
          />
          <div className="divider 1px zb-b-t"></div>
          {this.state.keyword &&
            <TickerList key={'search'} items={searchMarkets(this.state.keyword,tickersFm.getAllTickers())} loading={list.loading} dispatch={dispatch} tickersList={list}/>
          }
          {!this.state.keyword &&
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
          }
        </div>

      )
  }
}
export default connect(
  ({sockets:{tickersOfSource}})=>({tickersOfSource})
)(ListMarketTickers)

