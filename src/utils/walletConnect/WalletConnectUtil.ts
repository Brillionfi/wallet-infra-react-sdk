import { WalletKit, IWalletKit } from "@reown/walletkit"
import { Core } from "@walletconnect/core"
export let wcClient: IWalletKit

export async function createWalletKit(projectId: string, relayerRegionURL?: string) {
  const core = new Core({
    projectId,
    relayUrl: relayerRegionURL,
    customStoragePrefix: "brln-wc-dapp",
  })
  wcClient = await WalletKit.init({
    core,
    metadata: {
      name: 'Brillion',
      description: 'Brillion Wallet',
      url: 'https://brillion.finance',
      icons: [''], // TODO add brillion icon
    },
  });

  try {
    const clientId = await wcClient.engine.signClient.core.crypto.getClientId()
    console.log("WalletConnect ClientID: ", clientId)
    localStorage.setItem("WALLETCONNECT_CLIENT_ID", clientId)
  } catch (error) {
    console.error("Failed to set WalletConnect clientId in localStorage: ", error)
  }
}

export async function updateSignClientChainId(chainId: string, address: string) {
  console.log("chainId", chainId, address)
  // get most recent session
  const sessions = wcClient.getActiveSessions()
  if (!sessions) return
  const namespace = chainId.split(":")[0]
  Object.values(sessions).forEach(async session => {
    await wcClient.updateSession({
      topic: session.topic,
      namespaces: {
        ...session.namespaces,
        [namespace]: {
          ...session.namespaces[namespace],
          chains: [
            ...new Set([chainId].concat(Array.from(session?.namespaces?.[namespace]?.chains || [])))
          ],
          accounts: [
            ...new Set(
              [`${chainId}:${address}`].concat(
                Array.from(session?.namespaces?.[namespace]?.accounts || [])
              )
            )
          ]
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 1000))

    const chainChanged = {
      topic: session.topic,
      event: {
        name: "chainChanged",
        data: parseInt(chainId.split(":")[1])
      },
      chainId: chainId
    }

    const accountsChanged = {
      topic: session.topic,
      event: {
        name: "accountsChanged",
        data: [`${chainId}:${address}`]
      },
      chainId
    }
    await wcClient.emitSessionEvent(chainChanged)
    await wcClient.emitSessionEvent(accountsChanged)
  })
}