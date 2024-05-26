import { Text, View } from "@/components/themed"
import { useLanguages } from "@/hooks/use-language-store"
import { useWordActions } from "@/hooks/use-word-store"
//import { useSearchText, useWordActions, useWords } from "@/hooks/use-word-store"
import { Link } from "expo-router"
import { FlatList, Pressable } from "react-native"

export default function Index() {
	const languages = useLanguages()
	const { refetch } = useWordActions()

	if (languages.length === 0)
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="animate-spin p-4 text-8xl">⓿</Text>
				<Text>Nothing yet</Text>
			</View>
		)

	return (
		<FlatList
			numColumns={1}
			data={languages}
			refreshing={false}
			onRefresh={refetch}
			keyExtractor={(language) => String(language.id)}
			contentInsetAdjustmentBehavior="automatic"
			renderItem={({ item: language }) => (
				<Link
					asChild
					href={{
						pathname: "/categories",
						params: { id: language.id },
					}}
				>
					<Pressable className="flex-1 gap-y-2 rounded border border-black/75 p-4 dark:border-white/75">
						<Text className="line-clamp-1 text-2xl font-medium">
							{language.title}
						</Text>
					</Pressable>
				</Link>
			)}
			contentContainerStyle={{ gap: 8, padding: 8 }}
			//columnWrapperStyle={{ gap: 8 }}
		/>
	)
}
