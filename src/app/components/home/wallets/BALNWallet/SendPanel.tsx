import React from 'react';

import BigNumber from 'bignumber.js';
import { isAddress } from 'icon-sdk-js/lib/data/Validator.js';
import { BalancedJs } from 'packages/BalancedJs';
import { useIconReact } from 'packages/icon-react';
import { Box, Flex } from 'rebass/styled-components';

import AddressInputPanel from 'app/components/AddressInputPanel';
import { Button, TextButton } from 'app/components/Button';
import CurrencyInputPanel from 'app/components/CurrencyInputPanel';
import Modal from 'app/components/Modal';
import { Typography } from 'app/theme';
import bnJs from 'bnJs';
import { CURRENCY_LIST } from 'constants/currency';
import { useTransactionAdder } from 'store/transactions/hooks';
import { useWalletBalances, useBALNDetails } from 'store/wallet/hooks';

import { Grid, MaxButton } from '../utils';

export default function SendPanel() {
  const [value, setValue] = React.useState('');

  const handleCurrencyInput = (value: string) => {
    setValue(value);
  };

  const [address, setAddress] = React.useState('');

  const handleAddressInput = (value: string) => {
    setAddress(value);
  };

  const { account } = useIconReact();

  const wallet = useWalletBalances();

  const details = useBALNDetails();

  const maxAmount: BigNumber = details['Available balance'] || new BigNumber(0);

  const handleMax = () => {
    setValue(maxAmount.toFixed());
  };

  // modal logic
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const beforeAmount = wallet['BALN'];

  const differenceAmount = isNaN(parseFloat(value)) ? new BigNumber(0) : new BigNumber(value);

  const afterAmount = beforeAmount.minus(differenceAmount);

  const addTransaction = useTransactionAdder();

  const handleSend = () => {
    bnJs
      .inject({ account })
      .BALN.transfer(address, BalancedJs.utils.toLoop(differenceAmount))
      .then(res => {
        if (res.result) {
          addTransaction(
            { hash: res.result },
            {
              pending: `Sending BALN...`,
              summary: `Sent ${differenceAmount.dp(2).toFormat()} BALN.`,
            },
          );
          toggleOpen();
          setValue('');
          setAddress('');
        } else {
          console.error(res);
        }
      });
  };

  const isDisabled =
    !isAddress(address) ||
    differenceAmount.isNegative() ||
    differenceAmount.isZero() ||
    differenceAmount.isGreaterThan(maxAmount);

  return (
    <>
      <Grid>
        <Flex alignItems="center" justifyContent="space-between">
          <Typography variant="h3">Send BALN</Typography>
          <MaxButton onClick={handleMax}>Send max</MaxButton>
        </Flex>

        <CurrencyInputPanel
          value={value}
          showMaxButton={false}
          currency={CURRENCY_LIST['baln']}
          onUserInput={handleCurrencyInput}
          id="baln-currency-input-in-baln-wallet"
        />

        <AddressInputPanel value={address} onUserInput={handleAddressInput} />
      </Grid>

      <Flex alignItems="center" justifyContent="center" mt={5}>
        <Button onClick={toggleOpen} disabled={isDisabled}>
          Send
        </Button>
      </Flex>

      <Modal isOpen={open} onDismiss={toggleOpen}>
        <Flex flexDirection="column" alignItems="stretch" m={5} width="100%">
          <Typography textAlign="center" mb="5px">
            Send asset?
          </Typography>

          <Typography variant="p" fontWeight="bold" textAlign="center" fontSize={20}>
            {differenceAmount.dp(2).toFormat() + ' BALN'}
          </Typography>

          <Typography textAlign="center" mb="2px" mt="20px">
            Address
          </Typography>

          <Typography variant="p" textAlign="center" mr="30px" ml="30px" fontSize={16}>
            {address}
          </Typography>

          <Flex my={5}>
            <Box width={1 / 2} className="border-right">
              <Typography textAlign="center">Before</Typography>
              <Typography variant="p" textAlign="center">
                {beforeAmount.dp(2).toFormat() + ' BALN'}
              </Typography>
            </Box>

            <Box width={1 / 2}>
              <Typography textAlign="center">After</Typography>
              <Typography variant="p" textAlign="center">
                {afterAmount.dp(2).toFormat() + ' BALN'}
              </Typography>
            </Box>
          </Flex>

          <Flex justifyContent="center" mt={4} pt={4} className="border-top">
            <TextButton onClick={toggleOpen} fontSize={14}>
              Cancel
            </TextButton>
            <Button onClick={handleSend} fontSize={14}>
              Send
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
