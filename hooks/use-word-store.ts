import { db } from "@/db/client"
import { words, type SelectWord } from "@/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { useEffect } from "react"
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
	actions: {
		refetch: () => void
		//iFetch: () => void
	}
}

const useWordStore = create<WordStore>((set,get) => {

	//const initiate = useRouteStore.getState().route.initiate;
	//let cat = useRouteStore.getState().route.cat;
	//let lang = useRouteStore.getState().route.lang;
    const fetchStatement = db.select().from(words).orderBy(desc(words.id))// we dont need to fetch at the start, 
    
	//const fetchStatement = db.select().from(words).where(and(eq(words.languageId,useRouteStore.getState().route.cat),eq(words.categoryId,useRouteStore.getState().route.lang))).orderBy(desc(words.id))
    
	try {
		return {
			selectedWords: fetchStatement.all(),//[]
			actions: {		
				//if(cat != undefined && lang != undefined)	fetch();	//need to assign undefine when back btn
			//	ifetch: useEffect(()=>{},[]),
				refetch: () =>{ set({ selectedWords: fetchStatement.all() })},// need to create a action with lang and cat parameters(loading)
			},// smilart to save and create words in useEditWordStore
		}
	} catch (error) {
		return {
			selectedWords: [],
			actions: {
				refetch: () => set({ selectedWords: fetchStatement.all() }),
				//initFetch: () => {useRouteStore.getState().route.initiate}

			},
		}
	
}
})

console.log(useWordStore.getState().selectedWords);


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
			languageId: number ;
			categoryId: number ;
		}
	actions: {
		onChangeTitle: (title: string) => void
		onChangeDefinition: (definition: string) => void
		onChangeSentence: (sentence: string) => void
		onChangeLevel: (level: levels ) => void
		onChangeInGame: (inGame: boolean) => void
		onSetLanguageId: (languageId: number) => void
		onSetCategoryId: (categoryId: number) => void
		saveWord: (id: string) => void
		deleteWord: (id: string) => void
	}
}

const useEditWordStore = create<EditWordStore>((set, get) => ({
	word: { title: undefined, definition: undefined,sentence:undefined,level:"basic",inGame:true,languageId:1,categoryId:1 },
	actions: {
		onChangeTitle: (title) =>set((state) => ({ word: { ...state.word, title } })),
		onChangeDefinition: (definition) =>set((state) => ({ word: { ...state.word, definition } })),
		onChangeSentence: (sentence) =>set((state) => ({ word: { ...state.word, sentence } })),
		onChangeLevel: (level) =>set((state) => ({ word: { ...state.word, level } })),
		onChangeInGame: (inGame) =>set((state) => ({ word: { ...state.word, inGame } })),
		onSetLanguageId: (languageId) =>set((state) => ({ word: { ...state.word, languageId } })),
		onSetCategoryId: (categoryId) =>set((state) => ({ word: { ...state.word, categoryId } })),
		saveWord: (id) => {
			const { title, definition, sentence, level, inGame,languageId,categoryId } = get().word
			if (!title && !definition && !sentence && !level && ! inGame && ! languageId && ! categoryId) return
			db.insert(words)
				.values({ id: Number(id), title, definition, sentence,level ,inGame,languageId,categoryId })
				.onConflictDoUpdate({
					target: words.id,
					set: { title, definition, sentence, level, inGame,languageId,categoryId, createdAt: new Date().toISOString() },
				})
				.run()
			set({ word: { title: undefined, definition: undefined, sentence, level, inGame,languageId,categoryId } })
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

//------------------- route store --------------------------------

type routeState = {
	route:{lang: number , cat: number ,initiate: boolean}
	actions:{
		onSetLang: (lang: number) => void 
	    onSetCat: (cat: number) => void
		onSetInitiate: (initiate: boolean) => void
	}
  }
  
  const useRouteStore = create<routeState>()((set,get) => ({
	route:{lang: 1,cat: 1,initiate: false},
	actions:{
		onSetLang : (lang) =>set((state) => ({ route: { ...state.route, lang } })),
	    onSetCat: (cat) =>set((state) => ({ route: { ...state.route, cat } })),
		onSetInitiate: (initiate) =>set((state) => ({ route: { ...state.route, initiate } }))

	}
  }))
  console.log(useRouteStore.getState().route.lang);


export const useRouteState = () => useRouteStore((state) => state.route)
export const useRouteActions = () => useRouteStore((state) => state.actions)


