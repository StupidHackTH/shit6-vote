import { DescribeRoute } from "@components/Meta/DescribeRoute"
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next"
import classNames from "classnames"
import { FC, useEffect, useState } from "react"
import { BinaryLike, createHmac, KeyObject } from "crypto"
import { ProjectData, Team } from "@utils/projectData"
import { AnimatePresence, motion } from "framer-motion"
import { getTeams, getVote, updateTeams, updateVote } from "@lib/db"
import { useRouter } from "next/router"
import jwt_decode from "jwt-decode"

const ColorSet = {
  blue: { idle: "border-blue-500", active: "bg-blue-600", hover: "hover:bg-blue-600" },
  green: { idle: "border-green-500", active: "bg-green-600", hover: "hover:bg-green-600" },
  red: { idle: "border-red-500", active: "bg-red-600", hover: "hover:bg-red-600" },
  yellow: { idle: "border-yellow-600", active: "bg-yellow-500", hover: "hover:bg-yellow-500" },
}

type ColorSetTypes = "blue" | "green" | "red" | "yellow"

export const getServerSideProps: GetServerSideProps<{ ticketID: string }> = async ({ query }) => {
  const { ticketID, hMap } = query

  const hmac = createHmac("sha256", process.env.HASH_KEY as BinaryLike | KeyObject)
    .update(ticketID as string)
    .digest("hex")

  if (hmac !== hMap) {
    return {
      redirect: {
        permanent: false,
        destination: "/error",
      },
      props: { ticketID: ticketID as string },
    }
  } else {
    // const decodedHeader = jwt_decode(hMap)

    return {
      props: { ticketID: ticketID as string },
    }
  }
}

const TeamCard: FC<{
  name: string
  teamname: string
  imgURL: string
  colorSet: ColorSetTypes | null
  onClick: () => void
}> = ({ name, teamname, imgURL, onClick, colorSet = null }) => {
  return (
    <button onClick={onClick} className="w-full max-w-xs font-sans normal-case">
      <div
        className={classNames(
          colorSet && ColorSet[colorSet].idle,
          colorSet && ColorSet[colorSet].active,
          colorSet ? "bg-opacity-40 hover:bg-opacity-40" : "bg-white bg-opacity-100",
          "flex flex-col items-center justify-center gap-6 border p-6 transition-all hover:brightness-95"
        )}
      >
        {imgURL ? (
          <img src={imgURL} className="aspect-video w-4/5 object-fill" />
        ) : (
          <div className="aspect-video w-4/5 object-fill"></div>
        )}
        <div>
          <h2 className="text-lg">{name}</h2>
          <p className="text-gray-600">{teamname}</p>
        </div>
      </div>
    </button>
  )
}

const Categories: Record<string, string> = {
  blue: "most aesthetically pleasing",
  green: "most impressive technology",
  red: "non stupid award",
  yellow: "most stupid award",
}

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ ticketID }) => {
  const [teams, setTeams] = useState<Team[]>([])

  const [selectedColor, setSelectedColor] = useState<"blue" | "green" | "red" | "yellow">("blue")
  const [selectedTeams, setSelectedTeams] = useState<{
    blue: null | string
    green: null | string
    red: null | string
    yellow: null | string
  }>({ blue: null, green: null, red: null, yellow: null })
  const checkData = (teamID: string) => {
    const out = Object.entries(selectedTeams).find(([color, selectedTeamID]) => teamID === selectedTeamID)

    if (out) {
      return out[0]
    } else {
      return null
    }
  }

  useEffect(() => {
    getVote(ticketID).then((data) => {
      if (!data) return

      setSelectedTeams({ blue: data.blue, green: data.green, red: data.red, yellow: data.yellow })
    })

    getTeams().then((teams) => {
      if (!teams) return

      setTeams(teams)
    })
  }, [])

  return (
    <DescribeRoute title="SHiT๖ Voting" description="SHiT๖ Voting">
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 pt-6 pb-12 font-display uppercase">
        <h1 className="text-2xl">Voting</h1>

        <p>โหวตเลย !</p>

        <div className="flex items-center gap-6">
          {Object.keys(ColorSet)
            .filter((colorSet) => colorSet !== "normal")
            .map((colorSet) => (
              <div className="flex w-16 flex-col items-center gap-2">
                <button
                  onClick={() => setSelectedColor(colorSet as "red" | "green" | "blue" | "yellow")}
                  key={colorSet}
                  className={classNames(
                    ColorSet[colorSet as ColorSetTypes].idle,
                    ColorSet[colorSet as ColorSetTypes].hover,
                    selectedColor === colorSet && ColorSet[colorSet as ColorSetTypes].active,
                    "h-10 w-10 rounded-full border transition-colors"
                  )}
                />

                <p className="text-ellipsis break-words text-center text-xs">{Categories[colorSet]}</p>
              </div>
            ))}
        </div>

        <section className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {teams.map((team) => (
            <TeamCard
              onClick={() => {
                const out = checkData(team.id)

                const newSelectedTeams = {
                  ...selectedTeams,
                  [selectedColor]: team.id,
                  ...(out && { [out]: null }),
                }

                setSelectedTeams(newSelectedTeams)
                updateVote(ticketID, newSelectedTeams)
              }}
              key={team.id}
              name={team.name}
              imgURL={team.imgURL}
              teamname={team.teamname}
              colorSet={checkData(team.id) as ColorSetTypes | null}
            />
          ))}
        </section>
      </main>
    </DescribeRoute>
  )
}

export default Home
