import { BreadCrumbs, type Breadcrumb } from "../breadcrumbs"
import { Maybe } from "../maybe"
import { TypographyH1 } from "../typography/h1.typography"

export interface PageProps {
  heading?: React.ReactNode
  breadcrumbs?: Breadcrumb[]
  as?: "h1" | "h2" | "h3" | "h4"
}

export const PageHeader = ({
  breadcrumbs,
  heading,
}: PageProps): JSX.Element => {
  return (
    <>
      <Maybe check={heading}>
        <TypographyH1 className='mb-4 items-center'>{heading}</TypographyH1>
      </Maybe>
      <Maybe check={breadcrumbs}>
        <BreadCrumbs className='mb-8' crumbs={breadcrumbs as Breadcrumb[]} />
      </Maybe>
    </>
  )
}

PageHeader.displayName = "PageHeader"
