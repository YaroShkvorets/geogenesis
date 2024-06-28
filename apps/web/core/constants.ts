export const ZERO_WIDTH_SPACE = '\u200b';

export const PLACEHOLDER_IMAGES = {
  'San Francisco': 'https://cdn.discordapp.com/attachments/1010259815395754147/1047945562336534588/SF-image.png',
  Health: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15',
  Values: 'https://images.unsplash.com/photo-1637008336770-b95d637fd5fa',
};

export const ALL_SPACES_IMAGE = 'ipfs://QmQXJYrbJJZcukgkzk8C71nQL1V8ND9TQjrtP4sKWjYPFH';

export const ROOT_SPACE_IMAGE =
  'https://api.thegraph.com/ipfs/api/v0/cat?arg=QmU3TRxyXGKbgCFPFVddJmRnxHQ6ojnppumU3zpPUjJ4WK';

export const DEFAULT_OPENGRAPH_IMAGE = 'https://www.geobrowser.io/static/geo-social-image-v2.png';

export const PLACEHOLDER_SPACE_IMAGE = '/placeholder.png';

export const DEFAULT_OPENGRAPH_DESCRIPTION =
  "Browse and organize the world's public knowledge and information in a decentralized way.";

export const IPFS_GATEWAY_PATH = 'https://node.lighthouse.storage';
export const IPFS_GATEWAY_READ_PATH = `${IPFS_GATEWAY_PATH}/ipfs/`;
// export const IPFS_GATEWAY_READ_PATH = 'https://api.thegraph.com/ipfs/api/v0/cat?arg=';

export const ADMIN_ROLE_BINARY = '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775';
export const EDITOR_CONTROLLER_ROLE_BINARY = '0xbc2c04b16435c5f4eaa37fec9ad808fec563d665b1febf40775380f3f1b592b4';
export const EDITOR_ROLE_BINARY = '0x21d1167972f621f75904fb065136bc8b53c7ba1c60ccd3a7758fbee465851e9c';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const PUBLIC_SPACES = [
  '0x170b749413328ac9a94762031a7A05b00c1D2e34', // root
  '0xc46618C200f02EF1EEA28923FC3828301e63C4Bd', // San Francisco
  '0xe3d08763498e3247EC00A481F199B018f2148723', // Health
  '0xB4B3d95e9c82cb26A5bd4BC73ffBa46F1e979f16', // Philosophy
  '0x1A39E2Fe299Ef8f855ce43abF7AC85D6e69E05F5', // Crypto
  '0x6144659cc8FCcBb7Bb41c94Fc8429Aec201A3ff5', // AI
  // '0xb4476A42A66eC1356A58D300555169E17db6756c', // People
  '0x35D15c85AF6A00aBdc3AbFa4178C719e0220838e', // Sustainability
  '0x62b5b813B74C4166DA4f3f88Af6E8E4e657a9458', // Energy
  '0xC46a79dD4Cf9635011ba3A68Fb3CE6b6f8008cC0', // Social work
  '0x74519E6EEc5BCFBC4Eb8F1A6d0C6D343173A286b', // Construction
  '0xA2BBB63667917d88DaD3DC70A11EE4354D6f5d36', // Education
  '0x93EB1E3b864A5A5108F298A76f18E265eD458f83', // Psychology
  '0xD5445416E19Cc19451b3eBF3C31c434664Ad4310', // Software
  '0xC3819cbe5e3A2afe1884F0Ef97949bC989387061', // News
  '0xAA23D756137665Ac6D665Fa6808D76094F45dFCa', // Cryptography
  '0x4Ade9E4dB33D275A588d31641C735f25cFD52891', // Personal development
  '0xD159867D94aBF20fB20cBb60221A3984E5D98492', // Travel
  '0x0A7d904669976410e8Da452e592EeFC5A4b5d3c9', // Spirituality
  '0xaA96BF170A91B63b394BC34D4C77796E53dD53e2', // Defense (Foreign relations)
  '0x8c2590D488802DD3B106d0677Dd495020560E808', // Healthcare
  '0x843010627854BaA37070fC86535ff19C3Beb33A6', // California
  '0x41155BC2156119e71d283237D299FC1a648602C2', // US Politics
  '0xd93A5fCf65b520BA24364682aCcf50dd2F9aC18B', // Agriculture
  '0x2200938c792106D10f67f75cdD2f14A9dAeFf381', // Art
  '0xD8Ad7433f795fC19899f6b62a9b9831090495CAF', // Music
  '0xf1803e327b4c4652c7De5B77D612eCc1222918F3', // Film
  '0x4b6c1BCBB27CC1F8FaCb1Db263cc3bB3cc95587f', // Employment
  '0x96543F995669446ECB91aE84A6e564242eE0af39', // Books
  '0x44a6e58B483d4c569bAaB9DD1FC7fA445C1f1Ea9', // History
];

// These spaces are "Subspaces." We don't show these on the front page
// of Geo.
const PUBLIC_SUBSPACES = [
  '0xEC07c19743179f1AC904Fee97a1A99310e500aB6', // End Homelessness in SF
  '0xdFDD5Fe53F804717509416baEBd1807Bd769D40D', // Street Outreach in SF
  '0x759Cc61Ea01ae5A510C7cAA7e79581c07d2A80C3', // Mentorship in SF
  '0xdb1c4a316933cd481860cfCa078eE07ea7Ad4EdD', // Transitional Housing in SF
  '0x668356E8e22B11B389B136BB3A3a5afE388c6C5c', // Workforce Development in SF
  '0x5402D2C23d9495F6632bAf6EA828D1893e870484', // Recovery in Sf

  '0x1b7a66284C31A8D11a790ec79916c425Ef6E7886', // The Graph
];

export const ALL_PUBLIC_SPACES = [...PUBLIC_SPACES, ...PUBLIC_SUBSPACES];

export const PIMLICO_FACTORY_ADDRESS: `0x${string}` = '0x9406Cc6185a346906296840746125a0E44976454';
export const PROPOSAL_DURATION = 60 * 60 * 24 * 1; // 1 day
