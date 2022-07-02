import { Team } from "@utils/projectData"
import { DocumentData, getFirestore, doc, setDoc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore"
import firebaseApp from "./firebase"

const db = getFirestore(firebaseApp)

export const getTeamsRef = () => {
  return collection(db, "teams")
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
      submitted: false,
    }

    createVote(tId, blankVote)
    return blankVote
  } else return vote.data()
}
