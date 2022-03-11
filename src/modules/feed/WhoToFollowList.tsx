interface Profile {
  pfp?: string;
  pubkey: string;
  handle?: string;
}

function FollowButton() {
  return (
    <button className="rounded-full bg-white px-6 py-2 text-base text-gray-900">Follow</button>
  );
}

function FollowListItem({ profile }: { profile: Profile }) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <div className="mr-4">
          {profile.pfp ? (
            <img
              className="h-8 w-8 rounded-full"
              src={profile.pfp}
              alt={'profile picture for ' + profile.handle || profile.pubkey}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-700"></div>
          )}
        </div>
        <div> {profile.handle} </div>
      </div>
      <FollowButton />
    </div>
  );
}

const WHO_TO_FOLLOW: Profile[] = [
  {
    pfp: 'https://pbs.twimg.com/profile_images/1502268999316525059/nZNPG8GX_bigger.jpg',
    pubkey: '',
    handle: '@kristianeboe',
  },
  { pubkey: '', handle: '@anafescandon' },
  { pubkey: '', handle: 'damiandotsol' },
  { pubkey: '', handle: 'kaylakane' },
  { pubkey: '', handle: 'belle_belle.sol' },
];

export default function WhoToFollowList() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="m-0 text-base font-medium text-white">Who to follow</h3>
        <button className="text-base text-gray-300">See more</button>
      </div>

      <div className="space-y-4">
        {WHO_TO_FOLLOW.map((p) => (
          <FollowListItem key={p.handle} profile={p} />
        ))}
      </div>
    </div>
  );
}