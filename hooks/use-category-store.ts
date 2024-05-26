import { db } from "@/db/client"
import {category, type SelectCategory} from "@/db/schema"
import { create } from "zustand"

type WordStore = {
	selectedCategories: SelectCategory[]
	actions: {refetch: () => void}
} 

const useCategoryStore = create<WordStore>((set) => {
	const fetchStatement = db.select().from(category).orderBy(category.id)
	try {
		return {
			selectedCategories: fetchStatement.all(),
			actions: {
				refetch: () => set({ selectedCategories: fetchStatement.all() }),
			},
		}
	} catch (error) {
		return {
			selectedCategories: [],
			actions: {
				refetch: () => set({ selectedCategories: fetchStatement.all() }),
			},
		}
	}
})

export const useCategories = () => useCategoryStore((state) => state.selectedCategories)
export const useCategoryActions = () => useCategoryStore((state) => state.actions)
