import { db } from "@/db/client"
import { words, type SelectWord } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { create } from "zustand"

// ------------   search store -------------------

type SearchStore = {
	searchText: string
	actions: {
		onChangeSearchText: (text: string) => void
	}
}

const useSearchStore = create<SearchStore>((set) => ({
	searchText: "",
	actions: {
		onChangeSearchText: (text) => set({ searchText: text }),
	},
}))

export const useSearchText = () => useSearchStore((state) => state.searchText)
export const useSearchActions = () => useSearchStore((state) => state.actions)


// ------------   fetch words from db store -------------------


type WordStore = {
	selectedWords: SelectWord[]
	actions: {refetch: () => void}
}

const useWordStore = create<WordStore>((set) => {
	const fetchStatement = db.select().from(words).orderBy(desc(words.id))
	try {
		return {
			selectedWords: fetchStatement.all(),
			actions: {
				refetch: () => set({ selectedWords: fetchStatement.all() }),
			},
		}
	} catch (error) {
		return {
			selectedWords: [],
			actions: {
				refetch: () => set({ selectedWords: fetchStatement.all() }),
			},
		}
	}
})

export const useWords = () => useWordStore((state) => state.selectedWords)
export const useWordActions = () => useWordStore((state) => state.actions)


// ------------ edit word store -------------------


type levels ="basic"| "intermadiate"|"advanced";

type EditWordStore = {
	word: { title: string | undefined;
		    definition: string | undefined;
			sentence: string | undefined;
			level: levels;
			inGame: boolean;
		}
	actions: {
		onChangeTitle: (title: string) => void
		onChangeDefinition: (definition: string) => void
		onChangeSentence: (sentence: string) => void
		onChangeLevel: (level: levels ) => void
		onChangeInGame: (inGame: boolean) => void
		saveWord: (id: string) => void
		deleteWord: (id: string) => void
	}
}

const useEditWordStore = create<EditWordStore>((set, get) => ({
	word: { title: undefined, definition: undefined,sentence:undefined,level:"basic",inGame:true },
	actions: {
		onChangeTitle: (title) =>set((state) => ({ word: { ...state.word, title } })),
		onChangeDefinition: (definition) =>set((state) => ({ word: { ...state.word, definition } })),
		onChangeSentence: (sentence) =>set((state) => ({ word: { ...state.word, sentence } })),
		onChangeLevel: (level) =>set((state) => ({ word: { ...state.word, level } })),
		onChangeInGame: (inGame) =>set((state) => ({ word: { ...state.word, inGame } })),
		saveWord: (id) => {
			const { title, definition, sentence, level, inGame } = get().word
			if (!title && !definition && !sentence && !level && ! inGame) return
			db.insert(words)
				.values({ id: Number(id), title, definition, sentence,level ,inGame })
				.onConflictDoUpdate({
					target: words.id,
					set: { title, definition, sentence, level, inGame,  createdAt: new Date().toISOString() },
				})
				.run()
			set({ word: { title: undefined, definition: undefined, sentence, level, inGame } })
			useWordStore.getState().actions.refetch()
		},
		deleteWord: (id) => {
			db.delete(words)
				.where(eq(words.id, Number(id)))
				.run()
			useWordStore.getState().actions.refetch()
		},
	},
}))

export const useEditWord = () => useEditWordStore((state) => state.word)
export const useEditWordActions = () =>
	useEditWordStore((state) => state.actions)
