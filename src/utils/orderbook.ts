import Decimal from "decimal.js";
import { OrderBookEntry } from "../types/types";

export const aggregateOrders = (orders:OrderBookEntry[], increment:number):OrderBookEntry[] => {
    const aggregated: { [key: string]: Decimal } = {};

    orders.map(([price, size]) => {
        const decimalPrice = new Decimal(price);
        const bucket = decimalPrice.div(increment).floor().mul(increment);
        const bucketKey = formatPrice(bucket, increment);
        aggregated[bucketKey] = (aggregated[bucketKey] || new Decimal(0)).add(size);
    })

    return Object.entries(aggregated)
        .map(([priceStr, decimalSize]) => [parseFloat(priceStr), parseFloat(formatSize(decimalSize))] as OrderBookEntry)
        .sort((a, b) => new Decimal(a[0]).cmp(new Decimal(b[0])));
};

export const findUpdatedOrders = (currentOrders: OrderBookEntry[], prevOrders: OrderBookEntry[]): OrderBookEntry[] => {
    return currentOrders.filter(
      (order) => !prevOrders.find(([prevPrice, prevSize]) => prevPrice === order[0] && prevSize === order[1])
    );
};

export const formatSize = (size:Decimal) => {
    return size.toFixed(5);
};

const formatPrice = (price:Decimal, increment:number) => {
    const decimalPlaces = increment < 1 ? increment.toString().split('.')[1].length : 0;
    return price.toFixed(decimalPlaces);
};
  