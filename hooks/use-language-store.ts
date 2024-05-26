import { db } from "@/db/client"
import {language, type  SelectLanguage } from "@/db/schema"
import { create } from "zustand"

type WordStore = {
	selectedLanguages: SelectLanguage[]
	actions: {refetch: () => void}
}

const useLanguageStore = create<WordStore>((set) => {
	const fetchStatement = db.select().from(language).orderBy(language.id)
	try {
		return {
			selectedLanguages: fetchStatement.all(),
			actions: {
				refetch: () => set({ selectedLanguages: fetchStatement.all() }),
			},
		}
	} catch (error) {
		return {
			selectedLanguages: [],
			actions: {
				refetch: () => set({ selectedLanguages: fetchStatement.all() }),
			},
		}
	}
})

export const useLanguages = () => useLanguageStore((state) => state.selectedLanguages)
export const useLanguageActions = () => useLanguageStore((state) => state.actions)
