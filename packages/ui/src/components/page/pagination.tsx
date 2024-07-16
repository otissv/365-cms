"use client"

import * as React from "react"

import {
  Pagination as UiPagination,
  PaginationContent as UiPaginationContent,
  PaginationEllipsis as UiPaginationEllipsis,
  PaginationItem as UiPaginationItem,
  PaginationLink as UiPaginationLink,
  PaginationNext as UiPaginationNext,
  PaginationPrevious as UiPaginationPrevious,
  // PaginationFirstPage as UiPaginationFirstPage,
  // PaginationLastPage as UiPaginationLastPage
} from "@repo/ui/pagination"
import { cn } from "../../lib/utils"

import { usePushQueryString } from "../../hooks/querystring-hook"

export function usePagination({
  page = 1,
  total = 0,
  limit = 10,
  siblingCount = 1,
}) {
  const [isPending, startTransition] = React.useTransition()
  const pushQueryString = usePushQueryString(startTransition)

  const currentPage = page
  const pageCount = Math.floor(total / limit)

  const paginationRange = React.useMemo(() => {
    const delta =
      siblingCount + (currentPage === 1 || currentPage === total ? 3 : 1)

    const range = []
    for (
      let i = Math.max(2, Number(page) - delta);
      i <= Math.min(pageCount, Number(page) + delta);
      i++
    ) {
      range.push(i)
    }

    if (Number(page) - delta > 2) {
      range.unshift("...")
    }
    if (Number(page) + delta < pageCount - 1) {
      range.push("...")
    }

    range.unshift(1)

    return range
  }, [pageCount, page, siblingCount, total, currentPage])

  return {
    isPending,
    pushQueryString,
    paginationRange,
    currentPage,
    limit,
    pageCount,
    total,
  }
}

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  limit: number
  orderBy?: string[]
  totalPages?: number
  page?: number
}
export const Pagination = ({
  limit,
  orderBy,
  totalPages,
  page,
}: PaginationProps): React.JSX.Element => {
  const {
    isPending,
    pushQueryString,
    paginationRange,
    currentPage,
    pageCount,
  } = usePagination({
    total: totalPages,
    limit,
    page,
  })

  return (
    <UiPagination>
      <UiPaginationContent>
        <UiPaginationItem>
          <UiPaginationPrevious
            title='Previous Page'
            href='#'
            size='sm'
            className='w-auto p-4'
            disabled={Number(currentPage) === 1 || isPending}
            onClick={() =>
              pushQueryString({
                page: `${Number(currentPage) - 1}`,
                limit,
                // where,
                orderBy,
              })
            }
          >
            Previous
          </UiPaginationPrevious>
        </UiPaginationItem>

        {paginationRange.map((pageNumber: number | string) => {
          return `${pageNumber}` === "..." ? (
            <UiPaginationItem key={pageNumber}>
              <UiPaginationEllipsis>...</UiPaginationEllipsis>
            </UiPaginationItem>
          ) : (
            <UiPaginationItem
              key={pageNumber}
              className={cn(Number(pageNumber) === pageCount && "hidden")}
            >
              <UiPaginationLink
                title={`Page ${pageNumber}`}
                href='#'
                size='sm'
                aria-label={`Page ${pageNumber}`}
                isActive={Number(currentPage) === pageNumber}
                onClick={() =>
                  pushQueryString({
                    page: pageNumber as any,
                    limit,
                    // where,
                    orderBy,
                  })
                }
                disabled={isPending}
              >
                {pageNumber}
              </UiPaginationLink>
            </UiPaginationItem>
          )
        })}

        <UiPaginationItem>
          <UiPaginationLink
            title='Last Page'
            href='#'
            size='sm'
            aria-label={`Page ${pageCount}`}
            isActive={Number(currentPage) === pageCount}
            onClick={() =>
              pushQueryString({
                page: pageCount as any,
                limit,
                // where,
                orderBy,
              })
            }
            disabled={isPending}
          >
            {pageCount}
          </UiPaginationLink>
        </UiPaginationItem>

        <UiPaginationItem>
          <UiPaginationNext
            title='Next Page'
            href='#'
            size='sm'
            className='w-auto p-4'
            disabled={
              pageCount === 1 ||
              Number(currentPage) === (limit ?? 10) ||
              isPending
            }
            onClick={() =>
              pushQueryString({
                page: `${Number(currentPage) + 1}`,
                limit,
                // where,
                orderBy,
              })
            }
          >
            Next
          </UiPaginationNext>
        </UiPaginationItem>
      </UiPaginationContent>
    </UiPagination>
  )
}

Pagination.displayName = "Pagination"
