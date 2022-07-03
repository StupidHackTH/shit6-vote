import { Team } from "@utils/projectData"
import { DocumentData, getFirestore, doc, setDoc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore"
import firebaseApp from "./firebase"

const db = getFirestore(firebaseApp)

export const getTeamsRef = () => {
  return collection(db, "teams")
}

const teamsData = [
  {
    id: "cl51eou3g1799w54yij9vth5f",
    teamname: "Karakasang",
    name: "Karage by Karakasang",
    imgURL: "/images/6bfef960-87a1-4f71-8b4b-4e52c0daab24.png",
  },
  {
    id: "cl51eou3o1809w54y6vc42z8h",
    teamname: "de",
    name: "กรรมตามติด",
    imgURL: "/images/689e4792-b03c-4502-bfaa-927cdeab1adc.png",
  },
  {
    id: "cl51eou3t1819w54yqz59vbpv",
    teamname: "ลุงลุ่งลุ้ง",
    name: "luungluungluung",
    imgURL: "/images/0d7d9a2b-0f6f-4c5c-b6d7-ef31b7e8069c.png",
  },
  {
    id: "cl51eou3u1829w54y8oh3ie8v",
    teamname: "tam-arai-sak-yang-tee",
    name: "MosQlick",
    imgURL: "/images/a7a6ad45-ce17-421b-9fff-4eacd0e76ed1.jpg",
  },
  {
    id: "cl51eou3v1839w54y1d3y1nsu",
    teamname: "มวดทุกเขา",
    name: "TAOLOI",
    imgURL: "/images/70bd8026-a0ee-40f5-a8f2-f74913f350c1.png",
  },
  {
    id: "cl51eou3y1849w54y2uaup14k",
    teamname: "LAzyDev",
    name: "Kaptcha",
    imgURL: "/images/77cae660-ad31-4f62-b5c6-42724c7ec0c6.png",
  },
  {
    id: "cl51eou411859w54yfpqjvcht",
    teamname: "ไว้ค่อยคิดชื่อละกัน",
    name: "ไว้ทำพรุ่งนี้นะ",
    imgURL: "/images/1a7511d4-e413-466e-8ca6-096e7ff4af0b.png",
  },
  {
    id: "cl51eou441869w54yiekk3tsc",
    teamname: "ชานม",
    name: "พิจ๋าวนักแปล แปลฟรีๆ ไม่คิดตังค์",
    imgURL: "/images/348874ce-067a-4d75-a2a4-937feb0fa278.png",
  },
  {
    id: "cl51eou471879w54y7ryh8ulw",
    teamname: "2147483647",
    name: "Social BuT PDPA Filter",
    imgURL: "/images/d58c183b-5638-4dbf-af45-cb3c0dadaa48.jpg",
  },
  {
    id: "cl51eou481889w54yfrgvjx0j",
    teamname: "OMYIM",
    name: "OMYIM",
    imgURL: "/images/aab512e5-8d73-46c7-958f-9f196bf9ea90.png",
  },
  {
    id: "cl51eou4a1899w54y8m4h83y0",
    teamname: "Monks",
    name: "Jerm - a blessing github action...",
    imgURL: null,
  },
  {
    id: "cl51eou4b1909w54yjt4ql0vz",
    teamname:
      "ผจญภัยในป่าอะเมซอน ไปเจอชนเผ่ามายาฮี มายาฮู มายาฮา มายาห๊ะ นั่นเสียงอะไรหน่ะ นั่นสิ ไม่รู้ ไม่รู้ ไม่รู้",
    name: "RRRaaSs",
    imgURL: "/images/5ee59bdd-7f28-4ea2-b9e7-05d45f2a91cb.png",
  },
  {
    id: "cl51eou4c1919w54yzgnepjp1",
    teamname: "นั้นสิ",
    name: "ได้รับเเรงบันดาลใจจาก ภปร.",
    imgURL: "/images/8269e3c6-fc2d-4c1e-8c59-60ea10aa2106.png",
  },
  {
    id: "cl51eou4e1929w54ypw3kwfe3",
    teamname: "Cunny",
    name: "Yellow-house",
    imgURL: null,
  },
  {
    id: "cl51eou4h1939w54yji90hpae",
    teamname: "PEDEEP",
    name: "PEDEEEPE-A",
    imgURL: "/images/1bdc7649-ae6d-434d-b338-ce8e8b3bb758.png",
  },
]

export const getTeamRef = (teamId: string) => {
  return doc(db, "teams", teamId)
}

export const updateTeams = async () => {
  teamsData.forEach((team) => {
    const voteRef = getTeamRef(team.id)

    return setDoc(
      voteRef,
      {
        teamname: team.teamname,
        name: team.name,
        imgURL: `https://s6.wonderful.software${team.imgURL}`,
      },
      { merge: true }
    )
  })
}

export const getTeams = async () => {
  const teamsRef = getTeamsRef()
  const teams = await getDocs(teamsRef)
  return teams.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Team))
}

export const getVoteRef = (tId: string) => {
  return doc(db, "votes", tId)
}

export const updateVote = (tId: string, data: DocumentData): Promise<void> => {
  const voteRef = getVoteRef(tId)

  return updateDoc(voteRef, data)
}

export const createVote = (tId: string, data: DocumentData): Promise<void> => {
  const voteRef = getVoteRef(tId)

  return setDoc(voteRef, data, { merge: true })
}

export const getVote = async (tId: string) => {
  const voteRef = getVoteRef(tId)

  const vote = await getDoc(voteRef)

  if (!vote.exists()) {
    const blankVote = {
      blue: null,
      red: null,
      green: null,
      yellow: null,
    }

    createVote(tId, blankVote)
    return blankVote
  } else return vote.data()
}
