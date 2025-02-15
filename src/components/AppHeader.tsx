import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { ProfileImage } from './ProfileImage';
import { mq } from '@/assets/styles/MediaQuery';
import { MobileMenu } from './MobileMenu';
import { ButtonReset } from '@/assets/styles/ButtonReset';
import { Menu as MenuIcon } from '@/assets/icons/Menu';
import { ChevronRight } from '@/assets/icons/ChevronRight';
import { toast } from 'react-toastify';
import { Check } from '@/assets/icons/Check';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import DialectNotificationsButton from '@/views/_global/DialectNotificationsButton';
import classNames from 'classnames';
import { Button5 } from './Button2';
import SearchBar from 'src/views/_global/SearchBar';

const WHICHDAO = process.env.NEXT_PUBLIC_WHICHDAO;

export function AppHeader() {
  const router = useRouter();

  const {
    connected,
    wallet: userWallet,
    connect: connectUserWallet,
    publicKey,
    connecting,
    disconnecting,
  } = useWallet();
  const hasWalletTypeSelected =
    userWallet?.readyState === WalletReadyState.Installed ||
    userWallet?.readyState === WalletReadyState.Loadable;
  const connectedAndInstalledWallet = hasWalletTypeSelected && connected;

  const { setVisible } = useWalletModal();

  const handleViewProfile = useCallback(() => {
    router.push(`/profiles/${publicKey!.toBase58()}/nfts`);
  }, [publicKey, router]);

  useEffect(() => {
    if (connected) {
      toast(
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white" onClick={handleViewProfile}>
            <Check color="#32D583" className="mr-2" />
            <div>
              Wallet connected successfully!{' '}
              <span className="font-semibold underline">View profile</span>
            </div>
          </div>
        </div>,
        {
          toastId: 'connection-success',
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return (
    <>
      <nav
        className={`hidden flex-row items-center justify-between gap-6 bg-transparent px-6 py-4 md:flex`}
      >
        <div className={`flex w-full flex-row items-center gap-10 py-1 text-2xl font-bold`}>
          <Link href="/" passHref>
            <a className={`font-bold`}>
              👋&nbsp;&nbsp;<span>Holaplex</span>
            </a>
          </Link>
          {/* TODO: temp disabled for deploy */}
          <SearchBar />
        </div>
        {!WHICHDAO && (
          <div className={`flex min-w-fit flex-row items-center justify-end gap-6`}>
            {connected && (
              <Link href="/alpha" passHref>
                <a
                  key="alpha"
                  className={classNames(
                    'text-lg font-medium  duration-100 ease-in hover:text-white focus:text-white',
                    router.pathname === '/alpha' ? 'text-white' : 'text-gray-300'
                  )}
                >
                  Alpha
                </a>
              </Link>
            )}

            <Link href="/nfts/new" passHref>
              <a
                key="create"
                className={classNames(
                  'text-lg font-medium  duration-100 ease-in hover:text-white focus:text-white',
                  router.pathname === '/nfts/new' ? 'text-white' : 'text-gray-300'
                )}
              >
                Create
              </a>
            </Link>

            {connectedAndInstalledWallet && (
              <Link href={'/messages'} passHref>
                <a className="text-lg font-medium text-gray-300 duration-100 ease-in hover:text-white focus:text-white">
                  Messages
                </a>
              </Link>
            )}

            {connectedAndInstalledWallet && <DialectNotificationsButton />}

            {connectedAndInstalledWallet ? (
              <ProfileImage />
            ) : (
              <Button5
                v="primary"
                loading={connecting}
                onClick={() => setVisible(true)}
                className={`min-h-full text-lg font-medium`}
              >
                Connect
              </Button5>
            )}
          </div>
        )}
      </nav>
      <MobileHeader />
    </>
  );
}

const MobileHeader = () => {
  const [displayMenu, setDisplayMenu] = useState(false);
  return (
    <>
      <MobileHeaderContainer>
        <div className={`mr-4 flex w-full flex-row items-center gap-4 text-2xl`}>
          <Link href="/" passHref>
            <EmojiLogoAnchor>👋</EmojiLogoAnchor>
          </Link>
          {/* TODO: temp disabled for deploy */}
          <SearchBar />
        </div>
        <button
          className="flex items-center justify-center rounded-full shadow-lg shadow-black hover:bg-gray-800"
          onClick={() => setDisplayMenu(true)}
        >
          <MenuIcon color="#fff" />
        </button>
      </MobileHeaderContainer>
      {displayMenu ? <MobileMenu onCloseClick={() => setDisplayMenu(false)} /> : null}
    </>
  );
};

const EmojiLogoAnchor = styled.a`
  width: 40px;
  height: 40px;
  font-size: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MobileHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
  min-height: 72px;
  ${mq('md')} {
    display: none;
  }
`;
