"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

type NavItem = {
  title: string
  url: string
  items?: {
    title: string
    url: string
  }[]
}

export function NavBreadcrumb({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  // Find the matching item for the current path
  const currentItem = items?.find(item => {
    if (item.url === pathname) return true
    return item.items?.some(subItem => subItem.url === pathname)
  })

  // Find the matching sub-item if we're in a sub-route
  const currentSubItem = currentItem?.items?.find(
    item => item.url === pathname
  )

  if (!currentItem) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {currentSubItem ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={currentItem.url}>
                {currentItem.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentSubItem.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>{currentItem.title}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
