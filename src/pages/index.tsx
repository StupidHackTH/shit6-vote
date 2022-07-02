import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"

const HomePage: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("https://s6v.wonderful.software/")
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center font-display uppercase">
      <p>Redirecting...</p>
    </div>
  )
}

export default HomePage
