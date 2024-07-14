export type ErrorIssue = {
  [key: string]: string
}

export type ErrorIssues = {
  errors: ErrorIssue[]
}

export function formatValidationError(error: unknown): ErrorIssues {
  const issues = (error as any).issues as {
    path: string[]
    message: string
  }[]

  return {
    errors: issues.reduce((acc: ErrorIssue[], issue) => {
      ;(acc as any)[issue.path[0]] = issue.message
      return acc
    }, []),
  }
}
