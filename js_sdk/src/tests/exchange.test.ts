import { dumpError400 } from '../utils/network_tools'
import { TradingInterval,
    GetAccountRequest,
    GetCandlestickRequest,
    GetTokenBalancesRequest,
    GetAllowancesRequest,
    GetTickerRequest,
    GetDepthRequest,
    DEFAULT_TIMEOUT,
    GetMarketTradesRequest,
} from '../defs/loopring_defs'
import { ChainId } from '../defs/web3_defs'
import { ExchangeAPI } from '../api/exchange_api'

import { loopring_exported_account as acc } from './utils'

import { hasMarket, getPair, getExistedMarket, } from '../utils/symbol_tools'

let api: ExchangeAPI

describe('ExchangeAPI test', function () {

    beforeEach(() => {
        api = new ExchangeAPI(ChainId.GORLI)
    })

    it('getAccount', async () => {
        const request: GetAccountRequest = {
            owner: acc.address
        }
        const response = await api.getAccount(request)
        console.log(response)
    }, DEFAULT_TIMEOUT)

    it('getGasPrice', async () => {
        const response = await api.getGasPrice()
        console.log(response)
    }, DEFAULT_TIMEOUT)

    it('getMarketTrades', async () => {
        const req: GetMarketTradesRequest = {
            market: 'LRC-ETH'
        }
        const response = await api.getMarketTrades(req)
        console.log(response)
    }, DEFAULT_TIMEOUT)

    it('getRelayerCurrentTime', async () => {
        const response = await api.getRelayerCurrentTime()
        console.log(response)
    }, DEFAULT_TIMEOUT)

    it('getFiatPrice1', async () => {
        const response = await api.getFiatPrice({ legal: 'USD' })
        console.log(response)
    }, DEFAULT_TIMEOUT)

    it('getFiatPrice2', async () => {
        const response = await api.getFiatPrice({ legal: 'CNY' })
        console.log(response)
    }, DEFAULT_TIMEOUT)

    it('getLatestTokenPrices', async () => {
        const response = await api.getLatestTokenPrices()
        console.log(response)
    }, DEFAULT_TIMEOUT)

    it('getAllowances', async () => {
        
        try {

            const request: GetAllowancesRequest = {
                owner: acc.address,
                token: 'LRC,ETH,DAI',
            }

            const tokens = await api.getTokens()

            const response = await api.getAllowances(request, tokens.tokenSymbolMap)
            console.log(response)
        } catch (reason) {
            dumpError400(reason)
        }
    }, DEFAULT_TIMEOUT)

    it('getTokenBalances', async () => {

        console.log('getTokenBalances acc.address:', acc.address)
        try {

            const tokens = await api.getTokens()

            console.log('tokens:', tokens.tokenSymbolMap)

            const request: GetTokenBalancesRequest = {
                owner: acc.address,
                token: '',
            }

            const response = await api.getTokenBalances(request, tokens.tokenSymbolMap)
            console.log(response)
        } catch (reason) {
            dumpError400(reason)
        }
    }, DEFAULT_TIMEOUT)

    it('getMixMarkets', async () => {
        const response = await api.getMixMarkets()
        console.log(response)
        console.log(response.pairs.LRC.tokenList)

        console.log('hasMarket LRC-ETH:', hasMarket(response.markets, 'LRC-ETH'))
        console.log('market 1:', getExistedMarket(response.marketArr, 'LRC', 'ETH'))
        console.log('market 2:', getExistedMarket(response.marketArr, 'ETH', 'LRC'))

    }, DEFAULT_TIMEOUT)

    it('getTokens', async () => {
        const response = await api.getTokens()
        console.log(response)
    }, DEFAULT_TIMEOUT)

    it('getDepth', async () => {

        api = new ExchangeAPI(ChainId.MAINNET)

        const request: GetDepthRequest = {
            market: ['LRC-ETH']
        }

        const response = await api.getDepth(request)
        console.log(response)
        console.log(response.depth.bids)
        console.log(response.depth.asks)
    }, DEFAULT_TIMEOUT)

    it('getExchangeInfo', async () => {
        const response = await api.getExchangeInfo()
        console.log(response)
    }, DEFAULT_TIMEOUT)

    it('getTicker', async () => {
        const request: GetTickerRequest = {
            market: 'LRC-ETH',
        }
        const response = await api.getTicker(request)
        console.log(response)
    }, DEFAULT_TIMEOUT)

    it('getAllTickers', async () => {

        const response = await api.getAllTickers()
        console.log(response)

    }, DEFAULT_TIMEOUT)

    it('getCandlestick', async () => {
        const request: GetCandlestickRequest = {
            market: 'LRC-ETH',
            interval: TradingInterval.min15,
            limit: 96,
        }
        const response = await api.getCandlestick(request)
        console.log(response)
    }, DEFAULT_TIMEOUT)

})
