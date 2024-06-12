type OrderSide = 'buy' | 'sell';

export type OrderUpdate = [OrderSide, string, string];

export type OrderBookEntry = [price: number,size: number];

export interface Snapshot {
    type: 'snapshot';
    bids: [string, string][];
    asks: [string, string][];
  }
  
export interface L2Update {
    type: 'l2update';
    changes: OrderUpdate[];
}
  
export  interface Ticker {
    type: 'ticker';
    trade_id: number;
    sequence: number;
    time: string;
    product_id: string;
    price: string;
    open_24h: string;
    volume_24h: string;
    low_24h: string;
    high_24h: string;
    volume_30d: string;
    best_bid: string;
    best_bid_size: string;
    best_ask: string;
    best_ask_size: string;
    side: OrderSide;
    time_micro: string;
    last_size: string;
  }

export type WebSocketMessage = Snapshot | L2Update | Ticker;


export type OrderBookState = {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  prevBids:OrderBookEntry[],
  prevAsks: OrderBookEntry[],
  tickerData: Ticker[];
  isLoading: boolean;
  priceIncrement: number;
  bestBidData: { price: string; size: string } | null;
  bestAskData: { price: string; size: string } | null;
  coin: string;
  setBids: (bids: OrderBookEntry[]) => void;
  setAsks: (asks: OrderBookEntry[]) => void;
  setCoin: (coin: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setPriceIncrement: (priceIncrement: number) => void;
  updateBids: (update: OrderUpdate) => void;
  updateAsks: (update: OrderUpdate) => void;
  updateTickerData: (ticker: Ticker) => void;
  resetChartData: () => void;
  applyUpdates: () => void
};

``