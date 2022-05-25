export const environment = {
  production: true,
  serverUrl: {
    api: 'https://backenddev.playngo.it',
    apiUrl: 'https://backenddev.playngo.it/playandgo/api/',
    profile: 'player/profile',
    register: 'player/register',
    player: 'player',
    territory: 'territory',
    avatar: 'player/avatar',
    status: '/report/player/status',
    transportStats: 'report/player/transport/stats',
    avatarSmall: 'player/avatar/small',
  },
  auth: {
    aacUrl: 'https://aac.platform.smartcommunitylab.it',
    aacClientId: 'c_5445634c-95d6-4c0e-a1ff-829b951b91b3',
    redirectUrl: 'https://backofficedev.playngo.it/',
    logout_redirect: 'https://backofficedev.playngo.it/',
    scope: 'openid email profile'
  }
};
