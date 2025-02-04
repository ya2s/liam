import { showModeSchema } from '@/schemas/showMode'
import {
  updateActiveTableName,
  updateIsPopstateInProgress,
  updateShowMode,
} from '@/stores'
import { useEffect } from 'react'
import * as v from 'valibot'

export const usePopStateListener = () => {
  useEffect(() => {
    const handlePopState = async () => {
      const url = new URL(window.location.href)
      const tableName = url.searchParams.get('active')
      const showMode = url.searchParams.get('showMode')

      updateIsPopstateInProgress(true)
      updateActiveTableName(tableName ?? undefined)

      const result = v.safeParse(showModeSchema, showMode)
      if (result.success && result.output) {
        updateShowMode(result.output)
      }

      setTimeout(() => {
        updateIsPopstateInProgress(false)
      }, 0)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
}
