import React, {FC, useCallback, useState} from 'react'
import './Calculator.scss'
import Button from "../UIComponents/Button/Button";
import {calculate, round} from "../../utils/calculate";

interface Props {

};

const Calculator: FC<Props> = (props) => {

    const [queue, setQueue] = useState<string>('')
    const [current, setCurrent] = useState<string>('0')

    const inputCurrent = useCallback((symbol: string): void => {
        setCurrent((prev) => {
            if (symbol === ',') {
                //защита от нескольких запятых
                if (/,/.test(prev)) {
                    return prev
                } else {
                    return prev + symbol
                }
            } else if (prev === '0') {
                return symbol
            } else {
                return prev + symbol
            }
        })
    },[])

    const clear = useCallback((): void => {
        setQueue('')
        setCurrent('0')
    },[])

    const addOperation = useCallback((symbol: string): void => {
        if (current !== '0' && current[current.length - 1] !== '%') {
            const brackets = /%/.test(current) && /√/.test(current)
            let toAdd = brackets? '(' + current + ')' : current
            setCurrent(prev => '0')
            setQueue(prev => {
                return prev + toAdd + symbol
            })
        }
        if (queue !== '') {

            if (current === '0' && queue.at(-1) !== symbol) {
                setQueue(prev => prev.slice(0, prev.length - 1) + symbol)
            }
            if (queue.at(-1) === '=') {
                setQueue(prev => current+symbol)
            }
        }
    },[current,queue])

    const root = useCallback(() => {
        if (current !== '0' && current[0] !== '√') {
            setCurrent((prev) => {
                return '√' + prev
            })
        } else if (current !== '0' && current[0] === '√') {
            setCurrent((prev) => {
                return prev.slice(1, prev.length)
            })
        }
    },[current])

    const percent = useCallback(() => {
        if (current !== '0') {
            if (!/%/.test(current)) {
                setCurrent((prev) => {
                    return prev + '%'
                })
            }
        }
    },[current])

    const getResult = useCallback(() => {
        if (queue !== '' && current !== '0' && current[current.length - 1] !== '%') {
            const result = calculate(queue + current)
            console.log(result)
            setQueue(queue + current + '=')
            setCurrent(result)
        }
        if (queue === '' && current !== '0') {

            if (current.indexOf('√') !== -1 && /\d/.test(current[current.length - 1])) {

                if (current.indexOf('%') !== -1 && /\d/.test(current[current.length - 1])) {
                    console.log('√%')
                    let index = current.indexOf('%')
                    let percentRes = Number(current.slice(1, index).replace(',', '.')) / 100
                        * Number(current.slice(index + 1, current.length).replace(',', '.'))
                    let rootRes = Math.sqrt(percentRes)
                    setCurrent(round(rootRes.toFixed(3).toString().replace('.', ',')))
                } else {
                    console.log('√')
                    let rootRes = Math.sqrt(Number(current.slice(1, current.length).replace(',', '.')))
                    setCurrent(round(rootRes.toFixed(3).toString().replace('.', ',')))
                }
            } else if (current.indexOf('%') !== -1 && /\d/.test(current[current.length - 1])) {

                let index = current.indexOf('%')
                let percentRes = Number(current.slice(0, index).replace(',', '.')) / 100
                    * Number(current.slice(index + 1, current.length).replace(',', '.'))
                setCurrent(round(percentRes.toFixed(3).toString().replace('.', ',')))
            }
        }
    },[current,queue])

    const roundResult = useCallback(() => {
        if (queue.at(-1) === '=') {
            setCurrent(prev => {
                let index = prev.indexOf(',')
                console.log('index', index)
                if (index !== -1) {
                    let remainder = prev.slice(index + 1, prev.length)//числа после запятой
                    if (remainder.length === 3) {
                        return Number(prev.replace(',', '.')).toFixed(2).toString().replace('.', ',')
                    } else if (remainder.length === 2) {
                        return Number(prev.replace(',', '.')).toFixed(1).toString().replace('.', ',')
                    } else {
                        return prev.slice(0, index)
                    }
                } else {
                    return prev
                }
            })
        }
    },[queue])

    return (
        <div className="Calculator__wrapper">
            <div className="Calculator__body">
                <div className="Calculator__scoreboard">
                    <div className="Calculator__scoreboard-desc">
                        {queue}
                    </div>
                    <div className="Calculator__scoreboard-result">
                        {current}
                    </div>
                </div>
                <div className="Calculator__dashboard">
                    <Button symbol={'C1'} handler={clear} value={'C'}/>
                    <Button symbol={'√'} handler={root} value={'√'}/>
                    <Button symbol={'%'} handler={percent} value={'%'}/>
                    <Button symbol={'/'} handler={addOperation} value={'/'}/>
                    <Button symbol={'7'} handler={inputCurrent} value={'7'}/>
                    <Button symbol={'8'} handler={inputCurrent} value={'8'}/>
                    <Button symbol={'9'} handler={inputCurrent} value={'9'}/>
                    <Button symbol={'×'} handler={addOperation} value={'×'}/>
                    <Button symbol={'4'} handler={inputCurrent} value={'4'}/>
                    <Button symbol={'5'} handler={inputCurrent} value={'5'}/>
                    <Button symbol={'6'} handler={inputCurrent} value={'6'}/>
                    <Button symbol={'-'} handler={addOperation} value={'-'}/>
                    <Button symbol={'1'} handler={inputCurrent} value={'1'}/>
                    <Button symbol={'2'} handler={inputCurrent} value={'2'}/>
                    <Button symbol={'3'} handler={inputCurrent} value={'3'}/>
                    <Button symbol={'+'} handler={addOperation} value={'+'}/>
                    <Button symbol={'00'} handler={roundResult} value={'00'}/>
                    <Button symbol={'0'} handler={inputCurrent} value={'0'}/>
                    <Button symbol={','} handler={inputCurrent} value={','}/>
                    <Button symbol={'='} handler={getResult} value={'='} filled={true}/>
                </div>
            </div>
        </div>
    )
}

export default Calculator