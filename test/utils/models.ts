export interface Root {
    result: Result
  }
  
  export interface Result {
    tx: Tx
    quote: Quote
    fee: Fee
    chainId: number
    ata: Ata
  }
  
  export interface Tx {
    data: string
    gas: string
    gasPrice: string
    from: string
    to: string
    value: string
  }
  
  export interface Quote {
    aggregatorID: string
    fromAsset: FromAsset
    toAsset: ToAsset
    fromAmount: string
    toAmount: string
    amountReference: string
    priceImpact: string
    highPriceImpact: boolean
    chainId: number
    slippage: string
  }
  
  export interface FromAsset {
    name: string
    currencyCode: string
    address: string
    decimals: number
    imageURL: string
    blockchain: string
    aggregators: string[]
    swappable: boolean
    network: string
    chainId: number
    unverified: boolean
    uuid: string
  }
  
  export interface ToAsset {
    name: string
    currencyCode: string
    address: string
    decimals: number
    imageURL: string
    blockchain: string
    aggregators: string[]
    swappable: boolean
    network: string
    chainId: number
    unverified: boolean
    uuid: string
  }
  
  export interface Fee {
    baseAsset: BaseAsset
    percentage: string
    amount: string
  }
  
  export interface BaseAsset {
    name: string
    currencyCode: string
    address: string
    decimals: number
    imageURL: string
    blockchain: string
    aggregators: string[]
    swappable: boolean
    network: string
    chainId: number
    unverified: boolean
    uuid: string
  }
  
  export interface Ata {}
  