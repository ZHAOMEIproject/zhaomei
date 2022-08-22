const { keccak256, defaultAbiCoder, toUtf8Bytes, solidityPack } = require('ethers/lib/utils');
// const { BigNumberish } = require('ethers');

const PERMIT_TYPEHASH = keccak256(
  toUtf8Bytes("PermitMint(address gainer,uint256 typemint,uint256 deadline,uint256 nonce)")
)

// Returns the EIP712 hash which should be signed by the user
// in order to make a call to `permit`
function getPermitDigest(
  name,
  address,
  chainId,
  params
) {
  const DOMAIN_SEPARATOR = getDomainSeparator(name, address, chainId)
  return keccak256(
    solidityPack(
      ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
      [
        '0x19',
        '0x01',
        DOMAIN_SEPARATOR,
        keccak256(
          defaultAbiCoder.encode(
            ['bytes32','address', 'uint256', 'uint256', 'uint256'],
            [PERMIT_TYPEHASH, ...params]
          )
        ),
      ]
    )
  )
}

// Gets the EIP712 domain separator
function getDomainSeparator(name, contractAddress, chainId) {
  return keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        keccak256(toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')),
        keccak256(toUtf8Bytes(name)),
        keccak256(toUtf8Bytes('1')),
        chainId,
        contractAddress,
      ]
    )
  )
}

module.exports = {
  getPermitDigest,
  getDomainSeparator
}