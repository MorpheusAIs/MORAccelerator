// MOR Token ABI for the official Morpheus Token with OFT functionality
export const MOR_TOKEN_ABI = [
  // ERC20 Standard Functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)",
  
  // OFT (Omnichain Fungible Token) Functions
  "function estimateSendFee(uint16 _dstChainId, bytes _toAddress, uint256 _amount, bool _useZro, bytes _adapterParams) view returns (uint256 nativeFee, uint256 zroFee)",
  "function sendFrom(address _from, uint16 _dstChainId, bytes _toAddress, uint256 _amount, address payable _refundAddress, address _zroPaymentAddress, bytes _adapterParams) payable",
  "function circulatingSupply() view returns (uint256)",
  
  // Additional MOR functions (from IMOR.sol)
  "function isWhitelisted(address account) view returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event SendToChain(uint16 indexed _dstChainId, address indexed _from, bytes indexed _toAddress, uint256 _amount)"
];
