import BigNumber from 'bignumber.js';

import { NETWORK_ID } from '../constants/config';
import { isQueue } from '../constants/currency';
import { SUPPORTED_TOKENS } from '../constants/tokens';
import { Token } from './balanced-sdk-core/entities';
import { CurrencyAmount, Fraction } from './balanced-sdk-core/entities/fractions';
import { Pair } from './balanced-v1-sdk/entities';
import { CurrencyKey, Pool } from './index';

const tokens = SUPPORTED_TOKENS[NETWORK_ID];

export const getTokenFromCurrencyKey = (key?: CurrencyKey) => {
  if (key) return tokens.find((token: Token) => token.symbol === key);
};

const TEN = new BigNumber(10);

export const convertPair = (pool?: Pool) => {
  if (pool) {
    const baseToken = getTokenFromCurrencyKey(pool.baseCurrencyKey);
    const quoteToken = getTokenFromCurrencyKey(pool.quoteCurrencyKey);

    if (
      baseToken &&
      quoteToken &&
      BigNumber.isBigNumber(pool.base) &&
      !pool.base.isNaN() &&
      BigNumber.isBigNumber(pool.quote) &&
      !pool.quote.isNaN()
    ) {
      const [baseNumerator, baseDenominator] = pool.base.times(TEN.pow(baseToken.decimals)).toFraction();
      const [quoteNumerator, quoteDenominator] = pool.quote.times(TEN.pow(quoteToken.decimals)).toFraction();

      if (isQueue(pool)) {
        const [rateNumerator, rateDenominator] = pool.rate.toFraction();
        return new Pair(
          CurrencyAmount.fromFractionalAmount(baseToken, baseNumerator.toFixed(), baseDenominator.toFixed()),
          CurrencyAmount.fromFractionalAmount(quoteToken, quoteNumerator.toFixed(), quoteDenominator.toFixed()),
          { queueRate: new Fraction(rateNumerator.toFixed(), rateDenominator.toFixed()) },
        );
      } else {
        return new Pair(
          CurrencyAmount.fromFractionalAmount(baseToken, baseNumerator.toFixed(), baseDenominator.toFixed()),
          CurrencyAmount.fromFractionalAmount(quoteToken, quoteNumerator.toFixed(), quoteDenominator.toFixed()),
          {},
        );
      }
    }
  }
};
