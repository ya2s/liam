import '@xyflow/react/dist/style.css'
import { SidebarProvider, SidebarTrigger, ToastProvider } from '@liam-hq/ui'
import { ReactFlowProvider } from '@xyflow/react'
import { type FC, useCallback, useState } from 'react'
import { AppBar } from './AppBar'
import { ERDContent } from './ERDContent'
import styles from './ERDRenderer.module.css'
import { LeftPane } from './LeftPane'
import '@/styles/globals.css'
import { toggleLogEvent } from '@/features/gtm/utils'
import { useVersion } from '@/providers'
import { useDBStructureStore, useUserEditingStore } from '@/stores'
import { CardinalityMarkers } from './CardinalityMarkers'
// biome-ignore lint/nursery/useImportRestrictions: Fixed in the next PR.
import { Toolbar } from './ERDContent/Toolbar'
import { ErrorDisplay } from './ErrorDisplay'
import { RelationshipEdgeParticleMarker } from './RelationshipEdgeParticleMarker'
import { TableDetailDrawer, TableDetailDrawerRoot } from './TableDetailDrawer'
import { convertDBStructureToNodes } from './convertDBStructureToNodes'

type ErrorObject = {
  name: string
  message: string
}

type Props = {
  defaultSidebarOpen?: boolean | undefined
  errorObjects?: ErrorObject[] | undefined
}

export const ERDRenderer: FC<Props> = ({
  defaultSidebarOpen = false,
  errorObjects = [],
}) => {
  const [open, setOpen] = useState(defaultSidebarOpen)

  const { showMode } = useUserEditingStore()
  const dbStructure = useDBStructureStore()
  const { nodes, edges } = convertDBStructureToNodes({
    dbStructure,
    showMode,
  })

  const { version } = useVersion()
  const handleChangeOpen = useCallback(
    (open: boolean) => {
      setOpen(open)
      toggleLogEvent({
        element: 'leftPane',
        isShow: open,
        platform: version.displayedOn,
        gitHash: version.gitHash,
        ver: version.version,
        appEnv: version.envName,
      })
    },
    [version],
  )

  return (
    <div className={styles.wrapper}>
      <CardinalityMarkers />
      <RelationshipEdgeParticleMarker />
      <ToastProvider>
        <AppBar />
        <SidebarProvider open={open} onOpenChange={handleChangeOpen}>
          <ReactFlowProvider>
            <div className={styles.mainWrapper}>
              <LeftPane />
              <main className={styles.main}>
                <div className={styles.triggerWrapper}>
                  <SidebarTrigger />
                </div>
                <TableDetailDrawerRoot>
                  {errorObjects.length > 0 && (
                    <ErrorDisplay errors={errorObjects} />
                  )}
                  {errorObjects.length > 0 || (
                    <>
                      <ERDContent
                        key={`${nodes.length}-${showMode}`}
                        nodes={nodes}
                        edges={edges}
                      />
                      <div className={styles.toolbarWrapper}>
                        <Toolbar />
                      </div>
                      <TableDetailDrawer />
                    </>
                  )}
                </TableDetailDrawerRoot>
              </main>
            </div>
          </ReactFlowProvider>
        </SidebarProvider>
      </ToastProvider>
    </div>
  )
}
