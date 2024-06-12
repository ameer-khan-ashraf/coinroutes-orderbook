import {create} from 'zustand';
import { OrderBookEntry, OrderBookState, OrderUpdate } from '../types/types';
import {throttle} from 'lodash'


const updateQueue:{bids:OrderUpdate[],asks:OrderUpdate[]} = {
  bids: [],
  asks: [],
};

const useOrderBookStore = create<OrderBookState>((set,get) => ({
  bids: [],
  asks: [],
  prevBids: [],
  prevAsks: [],
  tickerData:[],
  isLoading: true,
  priceIncrement: 0.01, // Default, can be changed
  bestBidData:null,
  bestAskData:null,
  coin:'BTC-USD',

  setBids: (bids) => set({ bids }),
  setAsks: (asks) => set({ asks }),
  setCoin: (coin)=> set({coin}),
  setIsLoading: (isLoading) => set({ isLoading }),
  setPriceIncrement: (priceIncrement) => set({ priceIncrement }),

  updateBids: (update) => {
    updateQueue.bids.push(update);
  },

  updateAsks: (update) => {
    updateQueue.asks.push(update);
  },

  updateTickerData: throttle((ticker) => set((state) => {
    const currentTime = new Date().getTime();
    const oneMinuteAgo = currentTime - 60000;
    const newTickerData = [...state.tickerData, ticker];
    return {
      bestBidData:{
        price:ticker.best_bid,
        size:ticker.best_bid_size
      },
      bestAskData:{
        price:ticker.best_ask,
        size:ticker.best_ask_size
      },
      tickerData:newTickerData.filter((item) => {
        const timestamp = new Date(item.time).getTime();
        return timestamp >= oneMinuteAgo;
      })
    }
  }),1500),

  applyUpdates: throttle(() => {
    const { bids, asks } = get();
    const updatedBids = updateQueue.bids.reduce((acc, update) => updateOrders(acc, update), bids);
    const updatedAsks = updateQueue.asks.reduce((acc, update) => updateOrders(acc, update), asks);

    set({ bids: updatedBids, prevBids: bids, asks: updatedAsks, prevAsks: asks });
    updateQueue.bids = [];
    updateQueue.asks = [];
  }, 1000),

  resetChartData:()=>set(() => ({ bestAskData:null,bestBidData:null,tickerData:[] })),
}));

const updateOrders = (orders:OrderBookEntry[], update:OrderUpdate):OrderBookEntry[] => {
  const [price, size] = update.slice(1).map(parseFloat);
  const index = orders.findIndex(([p]) => p === price);

  if (size === 0) {
    return index > -1 ? orders.filter((_, i) => i !== index) : orders;
  } else if (index > -1) {
    return orders.map((order, i) => (i === index ? [price, size] : order));
  } else {
    const newOrders = [...orders, [price, size]];
    return newOrders.sort((a, b) => a[0] - b[0]) as OrderBookEntry[];
  }
};

export default useOrderBookStore;