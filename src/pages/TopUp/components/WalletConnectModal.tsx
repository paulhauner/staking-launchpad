import React, { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { Layer } from 'grommet';
import { Network } from 'grommet-icons';
import {
  AllowedELNetworks,
  fortmatic,
  metamask,
  NetworkChainId,
  portis,
  EL_NETWORK_NAME,
} from '../../ConnectWallet/web3Utils';
import { WalletButton } from '../../ConnectWallet/WalletButton';
import { web3ReactInterface } from '../../ConnectWallet';
import metamaskLogo from '../../../static/metamask.svg';
import {
  ENABLE_RPC_FEATURES,
  IS_MERGE_TESTNET,
  PORTIS_DAPP_ID,
} from '../../../utils/envVars';
import portisLogo from '../../../static/portis.svg';
import fortmaticLogo from '../../../static/fortmatic.svg';
import { Heading } from '../../../components/Heading';
import { Text } from '../../../components/Text';
import { MetamaskHardwareButton } from '../../ConnectWallet/MetamaskHardwareButton';

const WalletConnectModal: React.FC = () => {
  const {
    connector,
    error,
    chainId,
    active,
  }: web3ReactInterface = useWeb3React<Web3Provider>();

  const [selectedWallet, setSelectedWallet] = useState<
    AbstractConnector | null | undefined
  >(null);

  const isInvalidNetwork = useMemo(() => {
    if (!chainId) return false;

    const network = NetworkChainId[chainId as number];

    return !Object.values(AllowedELNetworks).includes(network);
  }, [chainId]);

  if (isInvalidNetwork) {
    return (
      <Layer>
        <div className="p20">
          <Heading level={2} color="blueMedium" center className="mb20">
            <FormattedMessage defaultMessage="Wrong network" />
          </Heading>
          <Network
            size="xlarge"
            style={{ margin: '45 auto', display: 'block' }}
          />
          <Text center>
            <FormattedMessage
              defaultMessage="Connect to {network}"
              values={{
                network: EL_NETWORK_NAME,
              }}
              description="{network} is 'Mainnet' or 'Göerli' or other testnet names"
            />
          </Text>
        </div>
      </Layer>
    );
  }

  if (active) return null;

  return (
    <Layer>
      <Heading level={2} color="blueMedium" style={{ margin: '20px auto' }}>
        <FormattedMessage defaultMessage="Connect a wallet" />
      </Heading>
      <div style={{ margin: 'auto' }}>
        <WalletButton
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
          logoSource={metamaskLogo}
          walletProvider={metamask}
          title="Metamask"
          error={connector === metamask ? error : undefined}
        />
        {!IS_MERGE_TESTNET && (
          <WalletButton
            invalid={PORTIS_DAPP_ID === ''}
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
            logoSource={portisLogo}
            walletProvider={portis}
            title="Portis"
            error={connector === portis ? error : undefined}
          />
        )}
        {!IS_MERGE_TESTNET && (
          <WalletButton
            invalid={!ENABLE_RPC_FEATURES}
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
            logoSource={fortmaticLogo}
            walletProvider={fortmatic}
            title="Fortmatic"
            error={connector === fortmatic ? error : undefined}
          />
        )}

        <MetamaskHardwareButton />
      </div>
    </Layer>
  );
};

export default WalletConnectModal;
