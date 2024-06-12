import { useEffect, useMemo, useState } from "react";
import OrderTable from "./OrderTable";
import useOrderBookStore from "../hooks/orderBookStore";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import { aggregateOrders, findUpdatedOrders } from "../utils/orderbook";
import { OrderBookEntry } from "../types/types";

const OrderBook = () => {
  const {isLoading,bids,asks,priceIncrement,prevBids, prevAsks} = useOrderBookStore()
  const aggregatedBids = useMemo(() => aggregateOrders(bids, priceIncrement), [bids, priceIncrement]);
  const aggregatedAsks = useMemo(() => aggregateOrders(asks, priceIncrement), [asks, priceIncrement]);

  const topBids = useMemo(() => aggregatedBids.slice(-20).reverse(), [aggregatedBids]);
  const topAsks = useMemo(() => aggregatedAsks.slice(0, 20).reverse(), [aggregatedAsks]);

  const [updatedBids, setUpdatedBids] = useState<OrderBookEntry[]>([]);
  const [updatedAsks, setUpdatedAsks] = useState<OrderBookEntry[]>([]);

  useEffect(() => {
    setUpdatedBids(findUpdatedOrders(topBids, prevBids));
    setUpdatedAsks(findUpdatedOrders(topAsks, prevAsks));
  }, [topBids, topAsks, prevBids, prevAsks]);

  
  return (
    <div className="border border-slate-700 min-w-[200px]">
      <h2 className="font-base px-2 py-2.5 m-0 text-left border-b border-b-slate-700">Order Book</h2>
      {isLoading?<div className="min-h-[700px] flex justify-center items-center">
        <LoadingSpinner/>
      </div>:
      <div className="flex flex-col">
          <OrderTable isAsk={true} data={topAsks} updatedOrders={updatedAsks}/>
       <hr className='w-full border-slate-700'/>
          <OrderTable isAsk={false} data={topBids} updatedOrders={updatedBids}/>
      </div>
      }
    </div>
  )
}

export default OrderBook