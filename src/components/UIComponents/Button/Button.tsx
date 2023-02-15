import React, { FC } from 'react'
import './Button.scss'

interface Props {
    symbol:string
    value: string
    isImg?: boolean
    filled?: boolean
    handler?: (symbol:string)=>void
};

const Button: FC<Props> = React.memo(({symbol,value,isImg,filled,handler}) => {

    const callHandler = () => {
        handler && handler(symbol)
    }

    return (
        <div onClick={callHandler} className={`Button__wrapper ${filled?'Button__wrapper_white':''}`}>
            <button className={'Button__button' + (filled?' Button__button_white':'')}>
                {isImg//На случай если нужно будет отобразить картинку на кнопке
                    ? <img src={require('../../../assets/images/' + value)} alt=""/>
                    : value
                }
            </button>
        </div>
    )
})

export default Button