import { useEffect, useState } from "react";
import { OrderBookEntry } from "../types/types"

const OrderTable = ({isAsk=true,data,updatedOrders}:{isAsk:boolean,data:OrderBookEntry[],updatedOrders: OrderBookEntry[]}) => {
  const [updatedOrdersState, setUpdatedOrdersState] = useState<OrderBookEntry[]>([]);

  useEffect(() => {
    setUpdatedOrdersState(updatedOrders);

    // Remove the flash class after a short delay
    const timeout = setTimeout(() => {
      setUpdatedOrdersState([]);
    }, 500);

    return () => clearTimeout(timeout);
  }, [updatedOrders]);


  return (
    <table className='text-xs text-left border-collapse'>
        <thead>
        <tr className='table-head'>
            <th className='px-2 text-slate-500'>Size</th>
            <th className='px-2 text-slate-500'>Price(USD)</th>
        </tr>
        </thead>
        <tbody>
        {data.map(([price, size], index) => (
            <tr key={index}
            className={updatedOrdersState.find(([p]) => p === price) ? (!isAsk ? 'animate-redFlash' : 'animate-greenFlash') : ''}
            >
                <td className="px-2">{size}</td>
                <td className={`px-2 ${isAsk?'text-green-600':'text-red-600'}`}>{price}</td>
            </tr>
        ))}
        </tbody>
    </table>
  )
}

export default OrderTable