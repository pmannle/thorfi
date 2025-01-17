import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'
import { useConnectorActiveIds } from '@xdefi/wallets-connector'
import { WalletsContext } from '@xdefi/wallets-connector'
import styled, { css } from 'styled-components'
import { DefaultTheme } from 'styled-components/macro'

// import { ReactComponent as LinkOutSvg } from '@xdefi/wallets-connector'
// import { ReactComponent as ArrowSvg } from '@xdefi/wallets-connector'
// import { ReactComponent as WalletSvg } from '@xdefi/wallets-connector'
import { canInject, IProviderUserOptions } from '@xdefi/wallets-connector'
// import { CircleSpinner } from '@xdefi/wallets-connector'

interface IProviderProps {
    provider: IProviderUserOptions
    onSelect: () => void
    onShowChainSelector?: () => void
}

export function WalletProvider({
    provider,
    onSelect,
    onShowChainSelector,
    ...rest
}: IProviderProps) {
    const { name, logo: El, chains, id, installationLink } = provider
    const pids = useConnectorActiveIds()
    const context = useContext(WalletsContext)
    const supportedChains = useMemo(() => {
        return chains ? Object.keys(chains) : []
    }, [chains])

    const needInstall = useMemo(() => {
        return (
            (installationLink && !canInject()) || !context?.isAvailableProvider(id)
        )
    }, [installationLink, context, id])

    const disabledByWallet = useMemo(
        () => context && context.disabledByProvider(id),
        [context, id]
    )

    const [loading, setLoading] = useState(false)

    const isActive = useMemo(() => {
        return pids.some((i) => i === id)
    }, [pids, id])

    const isAvailable = !disabledByWallet && !needInstall

    const isConnected = !!pids.find((providerId) => providerId === id)

    const connectToProvider = useCallback(async () => {

        if (
            isAvailable && context && !needInstall
        ) {
            setLoading(true)
            try {
                await context.connector.connectTo(id, supportedChains)
            } finally {
                setLoading(false)
            }
            onSelect()
        }
    }, [
        isAvailable,
        context,
        id,
        supportedChains,
        onSelect,
        setLoading,
        needInstall
    ])

    const isRecommended = id === 'xdefi'

    const handleClickProvider = () => {
        if (isRecommended) {
            onShowChainSelector?.()
            return
        }
        connectToProvider()
    }

    useEffect(() => {
        if (isActive && !isAvailable && context) {
            context?.disconnect()
        }
    }, [context, isActive, isAvailable])

    const rightPart = useMemo(() => {
        if (isConnected) {
            return provider?.label === 'Browser Wallet' ? (
                <ConnectedText>{name} connected</ConnectedText>
            ) : (
                <ConnectedText>Connected</ConnectedText>
            )
        }

        if (disabledByWallet) {
            return (
                <DisabledText>
                    To connect with Browser Wallet, please turn off “Prioritise XDEFI” in
                    your wallet
                </DisabledText>
            )
        }

        if (needInstall && !disabledByWallet) {
            return installationLink ? (
                <SLink href={installationLink} target='_blank'>
                    <span>Please install {name}</span>
                    {/* <LinkOutSvg /> */}
                    {'LinkOutSvg'}
                </SLink>
            ) : (
                <SLinkFallback>Please install {name}</SLinkFallback>
            )
        }

        if (isRecommended) {
            return (
                <RecommendedWrapper>
                    <span>Recommended</span>
                    {/* <ArrowSvg /> */}
                    {'Arrow SVG'}
                </RecommendedWrapper>
            )
        }

        if (loading) {
            // return <CircleSpinnerStyled />
            return 'loading'
        }

        return null
    }, [
        disabledByWallet,
        isConnected,
        isRecommended,
        installationLink,
        name,
        needInstall,
        loading,
        provider?.label
    ])

    return (
        <SProviderWrapper
            {...rest}
            onClick={handleClickProvider}
            available={isAvailable && !isConnected}
            active={isActive}
        >
            <NameWrapper>
                {provider?.label === 'Browser Wallet' ? (
                    // <WalletSvg /> 
                    'Wallet SVG'
                ) : (
                    <SIcon>
                        {typeof El !== 'string' ? (
                            <El style={{ flexShrink: 0 }} />
                        ) : (
                            <img src={El} />
                        )}
                    </SIcon>
                )}
                <SName>{provider?.label ? provider?.label : name}</SName>
            </NameWrapper>
            {rightPart}
        </SProviderWrapper>
    )
}

export function DisconnectWalletProvider({
    provider,
    ...rest
}: IProviderProps) {
    const { name, logo: El, id } = provider

    const context = useContext(WalletsContext)

    const disconnectHandler = useCallback(async () => {
        context && context.disconnect(id)
    }, [context, id])

    return (
        <SProviderDisconnectWrapper {...rest} onClick={disconnectHandler}>
            <SIcon>{typeof El !== 'string' ? <El /> : <img src={El} />}</SIcon>
            <SNameDisconnect>{name}</SNameDisconnect>
        </SProviderDisconnectWrapper>
    )
}

// const CircleSpinnerStyled = styled(CircleSpinner)`
//     position: absolute;
//     right: 12px;
//     top: 12px;
//   `

const SIcon = styled.div`
    width: 28px;
    height: 28px;
    display: flex;
    overflow: visible;
    box-shadow: none;
    justify-content: center;
    align-items: center;
  
    & svg {
      width: 28px;
      height: 28px;
      fill: ${({ theme }) => theme.colors.primaryDark};
    }
  
    & img {
      width: 28px;
      height: 28px;
    }
  

  `

const SProviderWrapper = styled.div<{
    available?: boolean
    active?: boolean
}>`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52px;
    padding: 0 16px;
    grid-gap: 12px;
    opacity: ${({ available }) => (available ? 1 : 0.4)};
    border-radius: 8px;
    cursor: ${({ available }) => (available ? 'pointer' : 'unset')};
  

  
    &:hover {
      background-color: #111314;
    }
  `

const SProviderDisconnectWrapper = styled.div<{
    available?: boolean
    active?: boolean
}>`
    opacity: ${({ available = true }) => (available ? 1 : 0.4)};
    background: ${({ theme }) => theme.backgroundColor};
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 16px 44px;
    position: relative;
    flex-direction: row;
    width: 100%;
    min-height: 60px;
    height: auto;
  `

const STYLES = (theme: DefaultTheme) => `
    cursor: pointer;
    color: ${theme.wallet.name};
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
  `

const SName = styled.div`
    
  `

const SNameDisconnect = styled.div`
    
    margin-top: 0;
    text-align: left;
    margin-left: 44px;
  `

const linkStyles = css`
    display: flex;
    align-items: center;
    grid-gap: 12px;
  
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.positive};
    text-align: right;
  `

const SLink = styled.a`
    ${linkStyles}
  
    &:hover {
      text-decoration: underline;
    }
  `
const SLinkFallback = styled.div`
    ${linkStyles}
  `

const NameWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    grid-gap: 12px;
  `

const DisabledText = styled.div`
    color: ${({ theme }) => theme.colors.negative};
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: right;
  `
const RecommendedWrapper = styled.div`
    display: flex;
    align-items: center;
    grid-gap: 8px;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
  `

const ConnectedText = styled.div`
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.primary};
  `
