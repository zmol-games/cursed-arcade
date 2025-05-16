import React, { useState } from 'react'
import { walletClient, publicClient } from '../utils/viemClient'
import { decodeEventLog } from 'viem'
import { CONTRACTS } from '../utils/contracts'
import { getWalletAccount } from '../utils/wallet'
import Layout from '../components/Layout'

const playFortuneSound = () => {
  const audio = new Audio('/sounds/fortune.mp3')
  audio.volume = 0.5
  audio.play().catch(err => console.warn('🔇 Fortune sound failed:', err))
}

const playPeeringSound = () => {
  const audio = new Audio('/sounds/peering.mp3')
  audio.volume = 1.0
  audio.play().catch(err => console.warn('🔇 Fortune sound failed:', err))
}

export default function MadameZmoltra() {
  const [fortune, setFortune] = useState(null)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [creditsRefreshKey, setCreditsRefreshKey] = useState(0)
  const [pointsRefreshKey, setPointsRefreshKey] = useState(0)

  const drawFortune = async () => {
    playPeeringSound()
    setLoading(true)
    setError(null)
    setFortune(null)
    setPointsEarned(0)

    try {
      const account = await getWalletAccount()

      const txHash = await walletClient.writeContract({
        account,
        address: CONTRACTS.madameZmoltra.address,
        abi: CONTRACTS.madameZmoltra.abi,
        functionName: 'drawFortune',
        gas: 250000n,
      })

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

      console.log('📬 Receipt status:', receipt.status)
      console.log('📦 Raw logs:', receipt.logs)

      if (receipt.status !== 'success') throw new Error('Out of credits! Buy more to hear your future.')

      const decodedLogs = receipt.logs
        .map(log => {
          try {
            return decodeEventLog({
              abi: CONTRACTS.madameZmoltra.abi,
              data: log.data,
              topics: log.topics,
            })
          } catch (err) {
            return null
          }
        })
        .filter(Boolean)

      const fortuneLog = decodedLogs.find(log => log.eventName === 'FortuneDrawn')
      console.log('🔮 Decoded event:', fortuneLog)

      if (!fortuneLog || !fortuneLog.args) throw new Error('FortuneDrawn event missing')

      setFortune(fortuneLog.args.fortune)
      setPointsEarned(Number(fortuneLog.args.pointsAwarded))

      if (Number(fortuneLog.args.pointsAwarded) > 0) {
        setPointsRefreshKey((k) => k + 1)
      }

      setCreditsRefreshKey((k) => k + 1)

      playFortuneSound()

    } catch (err) {
      console.error(err)
      setError(err.shortMessage || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout
      creditsRefreshKey={creditsRefreshKey}
      pointsRefreshKey={pointsRefreshKey}
      onBuyCreditsSuccess={() => setCreditsRefreshKey(k => k + 1)}
    >
      <div className="px-4 py-8 sm:px-8 border-4 border-gameboyButton rounded-2xl shadow-[0_4px_12px_#8bac0f] bg-gameboyFade w-full max-w-md text-center">
        <h1 className="text-3xl font-gameboy mb-6 text-gameboyDark">Madame Zmoltra</h1>

        <img
        src="images/madamez.png"
        alt="Madame Zmoltra"
        className="mx-auto mb-1 w-36 h-auto animate-floaty"
        />

        <p className="font-ibm mb-4 text-gameboyDark">What's your fortune?</p>

        <button
          onClick={drawFortune}
          disabled={loading}
          className="px-6 py-3 sm:px-8 sm:py-4 font-vt bg-gameboyButton rounded hover:animate-cursed disabled:opacity-50 transition-all duration-200 text-xl"
        >
          {loading ? 'Peering into the mist...' : 'Ask Zmoltra'}
        </button>

        {typeof error === 'string' && !error.includes("reading '0'") && (
          <p className="text-red-500 mt-2">Error: {error}</p>
        )}

        {fortune && (
          <div className="mt-8 p-4 rounded-lg shadow bg-gameboyDark text-white">
            <p className="font-ibm text-lg mb-2">{fortune}</p>

            {pointsEarned > 0 && (
              <p className="text-lime-300 font-vt">+{pointsEarned} </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}