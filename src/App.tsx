import useWebSocket from "react-use-websocket";
import { useEffect } from "react";
import OrderBook from "./components/OrderBook";
import useOrderBookStore from "./hooks/orderBookStore";
import LineChart from "./components/LineChart";
import { COINBASE_WS_URL, MAX_DEPTH } from "./utils/constants";
import BestOrder from "./components/BestOrder";
import Dropdowns from "./components/Dropdowns";
import { L2Update, Snapshot, Ticker, WebSocketMessage } from "./types/types";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";


function App() {

  const { setIsLoading, setBids, setAsks, updateBids, updateAsks, updateTickerData, applyUpdates, resetChartData, coin } =
    useOrderBookStore();

  const { sendJsonMessage, lastJsonMessage }:{sendJsonMessage:SendJsonMessage,lastJsonMessage:WebSocketMessage} = useWebSocket(COINBASE_WS_URL, {
    onOpen: () => console.log("socket connection opened" ),
    onClose:()=>console.log("socket connection closed" ),
    onError: (event) => console.error("WebSocket error:", event),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    sendJsonMessage({
      type: "subscribe",
      product_ids: [coin],
      channels: ["level2_batch","ticker"],
    });
    return () => {
      sendJsonMessage({
        type: "unsubscribe",
        product_ids: [coin],
        channels: ["level2_batch","ticker"],
      });
    };
  }, [coin, sendJsonMessage]);

  useEffect(() => {
    if (!lastJsonMessage) return;

    let snapshot: Snapshot | null = null;
    let l2update: L2Update | null = null;
    let ticker: Ticker | null = null;

    switch(lastJsonMessage.type){
      case 'snapshot':
        snapshot = lastJsonMessage as Snapshot;
        setBids(
          snapshot.bids.slice(0, MAX_DEPTH).map(([p, s]) => [parseFloat(p), parseFloat(s)])
        );
        setAsks(
          snapshot.asks.slice(0, MAX_DEPTH).map(([p, s]) => [parseFloat(p), parseFloat(s)])
        );
        resetChartData();
        setIsLoading(false);
        break;
      case 'l2update':
        l2update = lastJsonMessage as L2Update;
        l2update.changes.forEach((change) => {
          if (change[0] === "buy") {
            updateBids(change);
          } else {
            // sell
            updateAsks(change);
          }
        });
        applyUpdates();
        break;
      case 'ticker':
        ticker = lastJsonMessage as Ticker;
        updateTickerData(ticker)        
        break;
      default:
        break;
    }
  }, [applyUpdates, lastJsonMessage, resetChartData, setAsks, setBids, setIsLoading, updateAsks, updateBids, updateTickerData]);


  return (
    <div className="flex flex-col container mx-auto font-Inter h-screen w-screen">
      <Dropdowns/>
      <div className="flex gap-10">
        <OrderBook />
        <div className="flex-1">
          <BestOrder/>
          <LineChart/>
        </div>
      </div>
    </div>
  );
}

export default App;
