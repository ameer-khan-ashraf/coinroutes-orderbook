import useOrderBookStore from '../hooks/orderBookStore'
import LoadingSpinner from './LoadingSpinner/LoadingSpinner'

const BestOrder = () => {
    const {bestBidData:bidData,bestAskData:askData,isLoading} = useOrderBookStore()
    if(isLoading){
        return <div className='flex justify-evenly'>
            <div className='w-[100px]'>
                <LoadingSpinner/>
            </div>
            <div className='w-[100px]'>
                <LoadingSpinner/>
            </div>
        </div>
    }
  return (
    <div className='flex w-full justify-center items-center gap-20 px-4'>
        {bidData&&
        <div className=' flex flex-col flex-1 border border-slate-700'>
            <div className='py-2 px-4 text-xl bg-green-500'>Best Bid</div>
            <div className='flex'>
                <div className='flex-1 py-2 px-4 border-r border-slate-700'>
                    <p className='font-semibold'>{bidData.price}</p>
                    <p className='text-xs text-slate-500'>Bid Price</p>
                </div>
                <div className='flex-1 py-2 px-4'>
                    <p className='font-semibold'>{bidData.size}</p>
                    <p className='text-xs text-slate-500'>Bid Quantity</p>
                </div>
            </div>
        </div>}
        {askData&&<div className=' flex flex-col flex-1 border border-slate-700'>
            <div className='py-2 px-4 text-xl bg-red-500'>Best Ask</div>
            <div className='flex'>
                <div className='flex-1 py-2 px-4 border-r border-slate-700'>
                    <p className='font-semibold'>{askData.price}</p>
                    <p className='text-xs text-slate-500'>Ask Price</p>
                </div>
                <div className='flex-1 py-2 px-4'>
                    <p className='font-semibold'>{askData.size}</p>
                    <p className='text-xs text-slate-500'>ask Quantity</p>
                </div>
            </div>
        </div>}
    </div>
  )
}

export default BestOrder