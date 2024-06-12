import Dropdown,{Option} from "react-dropdown";
import useOrderBookStore from "../hooks/orderBookStore";


const Dropdowns = () => {
    const  {setCoin,coin,priceIncrement,setPriceIncrement} = useOrderBookStore()
    const handleCoinChange = (e:Option)=>{
      console.log(e)
        const value = e.value;
        if(value){
          setCoin(value)
        }
    }
    const handleAggregateChange = (e:Option)=>{
      const value = e.value;
      if(value){
        setPriceIncrement(+value)
      }
  }
    const coinOptions = ["BTC-USD", "ETH-USD", "LTC-USD", "BCH-USD"];
    const aggregateOptions = ["0.01", "0.05", "0.1", "1", "10"];

    const arrowOpen = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                      </svg>
    const arrowClosed = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>

  return (
    <div className="py-6 w-fit flex gap-2">
        <Dropdown
          options={coinOptions}
          onChange={handleCoinChange}
          value={coin}
          className="border border-slate-700 rounded relative"
          controlClassName="flex gap-2 items-center w-full px-2 py-1"
          menuClassName="absolute bg-slate-950 border-slate-700 border w-full cursor-pointer"
          arrowClosed={arrowClosed}
          arrowOpen={arrowOpen}
        />
        <Dropdown
          options={aggregateOptions}
          onChange={handleAggregateChange}
          value={priceIncrement.toString()}
          className="border border-slate-700 rounded relative"
          controlClassName="flex gap-2 items-center w-full px-2 py-1"
          menuClassName="absolute bg-slate-950 border-slate-700 border w-full cursor-pointer"
          arrowClosed={arrowClosed}
          arrowOpen={arrowOpen}
        />
      </div>
  )
}

export default Dropdowns