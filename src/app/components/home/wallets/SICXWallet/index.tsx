import React from 'react';

import { Tabs, TabPanels, TabPanel } from '@reach/tabs';

import Divider from 'app/components/Divider';
import { BoxPanel } from 'app/components/Panel';

import { StyledTabList, StyledTab } from '../utils';
import DepositPanel from './DepositPanel';
import SendPanel from './SendPanel';
import UnstakePanel from './UnstakePanel';

export default function SICXWallet() {
  return (
    <BoxPanel bg="bg3">
      <Tabs>
        <StyledTabList>
          <StyledTab>Send</StyledTab>
          <StyledTab>Deposit</StyledTab>
          <StyledTab>Unstake</StyledTab>
        </StyledTabList>
        <Divider mb={3} />
        <TabPanels>
          <TabPanel>
            <SendPanel />
          </TabPanel>

          <TabPanel>
            <DepositPanel />
          </TabPanel>
          <TabPanel>
            <UnstakePanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </BoxPanel>
  );
}
