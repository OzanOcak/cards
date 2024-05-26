import { Text, View } from "@/components/themed"
import { useCategories } from "@/hooks/use-category-store"
import {
	useRouteActions,
	useRouteState,
	useWordActions,
} from "@/hooks/use-word-store"
import { Link, useLocalSearchParams } from "expo-router"
import { useEffect } from "react"
import { FlatList, Pressable } from "react-native"

export default function Index() {
	const Categories = useCategories()
	const { refetch } = useWordActions()
	const languageIdParam = useLocalSearchParams()

	const { onSetCat, onSetLang } = useRouteActions()
	const { cat, lang } = useRouteState()

	useEffect(() => {
		console.log(languageIdParam.id)
		console.log("cat: ", cat, "lang: ", lang)
	}, [])

	if (Categories.length === 0)
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="animate-spin p-4 text-8xl">⓿</Text>
				<Text>Nothing yet</Text>
			</View>
		)

	return (
		<FlatList
			numColumns={1}
			data={Categories}
			refreshing={false}
			onRefresh={refetch}
			keyExtractor={(category) => String(category.id)}
			contentInsetAdjustmentBehavior="automatic"
			renderItem={({ item: category }) => (
				<Link
					asChild
					href={{
						pathname: "/words",
						params: { l: languageIdParam.id, c: category.id },
					}}
				>
					<Pressable
						onPress={() => {
							onSetCat(Number(languageIdParam.id))
							onSetLang(Number(category.id))
						}}
						className="flex-1 gap-y-2 rounded border border-black/75 p-4 dark:border-white/75"
					>
						<Text className="line-clamp-1 text-2xl font-medium">
							{category.title}
						</Text>
					</Pressable>
				</Link>
			)}
			contentContainerStyle={{ gap: 8, padding: 8 }}
			//columnWrapperStyle={{ gap: 8 }}
		/>
	)
}
