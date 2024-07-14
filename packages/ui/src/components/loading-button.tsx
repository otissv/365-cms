import { Button, type ButtonProps } from "@ui/ui/button"

export interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean
  loadingText?: string
}

export function LoadingButton({
  isLoading,
  children,
  loadingText,
  ...props
}: LoadingButtonProps) {
  return (
    <>
      <style>
        {`   
          .ellipsis-loading::after {
            display: inline-block;
            animation: dotty steps(1,end) 1.7s infinite;
            content: '';
          }
          
          @keyframes dotty {
              0%   { content: ''; }
              25%  { content: '.'; }
              50%  { content: '..'; }
              75%  { content: '...'; }
              100% { content: ''; }
          }`}
      </style>
      <Button disabled={isLoading} {...props}>
        {isLoading ? (
          <>
            {loadingText}{" "}
            <span className='inline-flex justify-start text-2xl w-3 ellipsis-loading ' />
          </>
        ) : (
          <>{children}</>
        )}
      </Button>
    </>
  )
}
