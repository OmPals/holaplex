import { ProfileMenu } from '@/common/components/elements/ProfileMenu';
import { mq } from '@/common/styles/MediaQuery';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { ConnectTwitterButton, WalletIdentityProvider } from '@cardinal/namespaces-components';
import { PublicKey } from '@solana/web3.js';

import { FC, useState } from 'react';
import styled from 'styled-components';

import { shortenAddress, showFirstAndLastFour } from '@/modules/utils/string';
import { DuplicateIcon, CheckIcon } from '@heroicons/react/outline';
import { ProfileDataProvider, useProfileData } from '@/common/context/ProfileData';
import { FollowUnfollowButtonDataWrapper } from '../home/FeaturedProfilesSection';
import { FollowerCount } from '../elements/FollowerCount';
import { FollowModal, FollowModalVisibility } from '../elements/FollowModal';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '../../../modules/server-side/getProfile';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

const ProfilePageHead = (props: {
  publicKey: string;
  twitterProfile?: {
    twitterHandle?: string | null;
    pfp?: string;
    banner?: string;
  };
  description: string;
}) => {
  const handle = props.twitterProfile?.twitterHandle
    ? '@' + props.twitterProfile?.twitterHandle
    : showFirstAndLastFour(props.publicKey);

  const description = props.description;
  const title = `${handle}'s profile | Holaplex`;
  return (
    <Head>
      <title>{handle}&apos;s profile | Holaplex</title>
      <meta property="description" key="description" content={props.description} />
      <meta property="image" key="image" content={props.twitterProfile?.banner} />
      {/* Schema */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={props.twitterProfile?.banner} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image:src" content={props.twitterProfile?.banner} />
      <meta name="twitter:site" content="@holaplex" />
      {/* Open Graph */}
      <meta name="og-title" content={title} />
      <meta name="og-description" content={description} />
      <meta name="og-image" content={props.twitterProfile?.banner} />
      <meta name="og-url" content={`https://holaplex.com/profiles/${props.publicKey}/nfts`} />
      <meta name="og-site_name" content="Holaplex" />
      <meta name="og-type" content="product" />
    </Head>
  );
};

interface ProfileLayoutProps {
  children: any;
  profileData: WalletDependantPageProps;
}

const ProfileLayout = ({ children, profileData }: ProfileLayoutProps) => {
  const { banner, profilePicture, twitterHandle, publicKey } = useProfileData();

  const [showFollowsModal, setShowFollowsModal] = useState<FollowModalVisibility>('hidden');
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  return (
    <>
      <ProfilePageHead
        publicKey={publicKey}
        twitterProfile={{
          twitterHandle: profileData.twitterHandle,
          banner: profileData.banner,
          pfp: profileData.profilePicture,
        }}
        description="View activity for this, or any other pubkey, in the Holaplex ecosystem."
      />
      <WalletIdentityProvider appName="Holaplex" appTwitter="@holaplex">
        <div>
          <header>
            <Banner className="h-40 md:h-64 " style={{ backgroundImage: `url(${banner})` }} />
          </header>
          <div className="container  mx-auto px-6 pb-20 md:px-12 lg:flex">
            <div className="relative lg:sticky lg:top-24 lg:mr-28 lg:h-96 lg:w-full lg:max-w-xs ">
              <div className="-mt-12 flex  justify-center text-center lg:justify-start lg:gap-12">
                <div className=" max-w-fit rounded-full border-4 border-gray-900 ">
                  <img
                    src={profilePicture}
                    // imgOpt(, 400)
                    className="h-24 w-24 rounded-full  bg-gray-900 "
                    alt="profile picture"
                  />
                </div>
                <div className="mt-16 flex justify-center lg:justify-start">
                  {anchorWallet?.publicKey.toString() == publicKey.toString() && !twitterHandle && (
                    <ConnectTwitterButton
                      address={new PublicKey(publicKey)}
                      connection={connection}
                      wallet={anchorWallet}
                      cluster={'mainnet-beta'}
                      variant={'secondary'}
                      style={{ background: 'rgb(33,33,33)', height: '37px', borderRadius: '18px' }}
                    />
                  )}
                  {anchorWallet?.publicKey.toString() !== publicKey.toString() && (
                    <FollowUnfollowButtonDataWrapper
                      targetPubkey={publicKey.toString()}
                      className={`pointer-events-auto absolute right-0 flex`}
                    />
                  )}
                </div>
              </div>

              <div className="mt-10 flex justify-center lg:justify-start">
                <ProfileDisplayName />
              </div>
              <FollowerCount
                wallet={anchorWallet}
                setShowFollowsModal={setShowFollowsModal}
                showButton={false}
              />
            </div>
            <div className="mt-10 w-full">
              <ProfileMenu />
              {children}
            </div>
            <FollowModal
              wallet={anchorWallet}
              visibility={showFollowsModal}
              setVisibility={setShowFollowsModal}
            />
          </div>
          {/* <Footer /> */}
        </div>
      </WalletIdentityProvider>
    </>
  );
};

const ProfileDisplayName: FC = () => {
  const { publicKey, twitterHandle } = useProfileData();

  const [copied, setCopied] = useState(false);
  const copyPubKey = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center text-2xl font-medium">
      {twitterHandle ? (
        <div className={`flex flex-col items-center justify-start gap-4 lg:items-start`}>
          <a
            className="hover:text-gray-300"
            target="_blank"
            href={'https://www.twitter.com/' + twitterHandle}
            rel="noreferrer"
          >
            @{twitterHandle}
          </a>
          <span
            className={`flex max-w-fit cursor-pointer gap-2 rounded-full px-2 py-1 font-mono text-xs shadow-lg shadow-black hover:text-gray-300`}
            onClick={copyPubKey}
          >
            {shortenAddress(publicKey)}{' '}
            {copied ? (
              <CheckIcon className="h-4 w-4 " />
            ) : (
              <DuplicateIcon className="h-4 w-4 cursor-pointer " />
            )}
          </span>
        </div>
      ) : (
        <span className="flex items-center font-mono">
          {shortenAddress(publicKey)}{' '}
          {copied ? (
            <CheckIcon className="ml-4 h-7 w-7 hover:text-gray-300" />
          ) : (
            <DuplicateIcon
              className="ml-4 h-7 w-7 cursor-pointer hover:text-gray-300"
              onClick={copyPubKey}
            />
          )}
        </span>
      )}
    </div>
  );
};

export const PFP_SIZE = 100;

const Banner = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  ${mq('lg')} {
    background-size: 100%;
  }
`;

export default ProfileLayout;