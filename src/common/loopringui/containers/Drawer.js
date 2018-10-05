import React from 'react'
import {Drawer} from 'antd'

const DrawerWrapper = (props)=>{
  const {
    children,id,
    width='auto',
    height='100vh',
    position='left',
    showMask=true,
    level='all', // all, null, className, id, tagName, array
    mask,closable=true,maskClosable=true,apisOnly=false,wrapClassName="",className="",
    style,
    ...rest
  } = props
  const {[id]:module={}} = props
  const drawerProps = {
    className,
    wrapClassName,
    width,
    height,
    placement:position,
    maskClosable:showMask,
    // level,
    visible:module.visible,
    onClose:module.hideLayer && module.hideLayer.bind(this),
    destroyOnClose:true,
  }
  const childProps = {...rest}
  return (
    <Drawer {...drawerProps}>
      <div style={{...style}}>
        {
          React.Children.map(children, child => {
              return React.cloneElement(child, {...childProps})
          })
        }
      </div>
    </Drawer>
  )
}
export default DrawerWrapper
