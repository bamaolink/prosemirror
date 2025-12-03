import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/Theme/useTheme'

export const ModeToggle = () => {
  const { setTheme } = useTheme()
  return (
    <>
      <Button
        onClick={() => {
          setTheme('light')
        }}
      >
        开灯
      </Button>
      <Button
        onClick={() => {
          setTheme('dark')
        }}
      >
        关灯
      </Button>
    </>
  )
}

export default ModeToggle
