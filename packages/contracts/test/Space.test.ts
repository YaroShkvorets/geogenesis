/* eslint-disable node/no-missing-import */
import { expect } from 'chai'
import { ethers } from 'hardhat'

import { deploySpace } from '../src/deploy'
import { addEntry } from '../src/entry'

describe('Space', () => {
  it('add entry', async () => {
    const [deployer] = await ethers.getSigners()
    const contract = await deploySpace({ signer: deployer })

    const uri1 = 'abc'
    const entry1 = await addEntry(contract, uri1)

    expect(entry1.author).to.be.eq(deployer.address.toString())
    expect(entry1.uri).to.be.eq(uri1)
    expect(entry1.index).to.be.eq(0)

    const uri2 = 'def'
    const entry2 = await addEntry(contract, uri2)

    expect(entry2.author).to.be.eq(deployer.address.toString())
    expect(entry2.uri).to.be.eq(uri2)
    expect(entry2.index).to.be.eq(1)
  })

  it('read entry', async () => {
    const [deployer] = await ethers.getSigners()
    const contract = await deploySpace({ signer: deployer })

    const uri1 = 'abc'
    await addEntry(contract, uri1)

    const uri2 = 'def'
    await addEntry(contract, uri2)

    expect(await contract.entryCount()).to.be.eq(2)

    const entry1 = await contract.entryAtIndex(0)
    expect(entry1.author).to.be.eq(deployer.address.toString())
    expect(entry1.uri).to.be.eq(uri1)

    const entry2 = await contract.entryAtIndex(1)
    expect(entry2.author).to.be.eq(deployer.address.toString())
    expect(entry2.uri).to.be.eq(uri2)

    const entries = await contract.entries(0, 10)
    expect(entries).to.be.deep.eq([
      ['abc', deployer.address],
      ['def', deployer.address],
    ])
  })

  it('Grants and revokes role', async () => {
    const [deployer, address1] = await ethers.getSigners()
    const contract = await deploySpace({ signer: deployer })

    expect(
      await contract.hasRole(await contract.EDITOR_ROLE(), address1.address)
    ).to.be.eq(false)

    await contract.grantRole(await contract.EDITOR_ROLE(), address1.address)

    expect(
      await contract.hasRole(await contract.EDITOR_ROLE(), address1.address)
    ).to.be.eq(true)

    await contract.revokeRole(await contract.EDITOR_ROLE(), address1.address)

    expect(
      await contract.hasRole(await contract.EDITOR_ROLE(), address1.address)
    ).to.be.eq(false)
  })
})