import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import styles from './LinkHeading.module.css'

type Props = PropsWithChildren<{
  href?: string
}>

export const LinkHeading = ({ children, href }: Props) => {
  return (
    <div className={styles.heading}>
      <Link href={href ?? '/'}>{children}</Link>
    </div>
  )
}
