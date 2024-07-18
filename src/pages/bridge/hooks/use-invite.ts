import { useWallet } from '@/composables/hooks/use-wallet'
import { getArrayFirst } from '@preflower/utils'
import { createInvitationRelationship } from '@/request/api/user'
import { WALLET_TYPE } from 'oooo-components/oooo-wallet'
import useSignatureStore from '@/store/signature'

export const useInvite = () => {
  const route = useRoute()
  const inviteCode = computed(() => getArrayFirst(route.query.inviteCode))

  const signature = useSignatureStore()
  const { address, walletType, onConnect } = useWallet()

  watch(address, async (address) => {
    if (address == null) return
    if (inviteCode.value == null) return
    if (signature.signInfo == null) {
      await signature.onSign()
    }
    await createInvitationRelationship({
      ...signature.signInfo!,
      inviteCode: inviteCode.value
    })
  }, {
    immediate: true
  })

  onMounted(() => {
    if (inviteCode.value == null) return
    if (walletType.value === WALLET_TYPE.BITCOIN) return
    if (address.value == null) {
      onConnect(WALLET_TYPE.ETHEREUM)
    }
  })
}
