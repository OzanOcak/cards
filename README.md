## Features

- Drizzle ORM
- Expo SQLite
- Expo SDK 50
- Expo Router v3
- Nativewind v4

## Run locally

If you already have a simulator/emulator set up, this should open Expo Go automatically:

```zsh
bun install
bun run ios # or android
```

```javascript
const data = db
	.select()
	.from(table)
	.where(sql`param1 = ${params.param1} AND param2 = ${params.param2}`)
```

```javascript

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

```
